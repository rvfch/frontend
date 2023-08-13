import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import SendComment from './SendComment';
import { IArticle } from '../api/interface/article.interface';
import { IComment } from '../api/interface/comment.interface';
import { gql, useQuery } from '@apollo/client';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'react-toastify';
import { useUser } from '../hooks/UseUser.hook';
import { motion } from 'framer-motion';

const COMMENT_FRAGMENT = gql`
  fragment CommentFields on CommentDto {
    id
    articleId
    text
    user {
      id
      name
    }
    ratingScore
    canVote
    parentId
    createdAt
    children {
      id
      articleId
      text
      user {
        id
        name
      }
      ratingScore
      canVote
      parentId
      createdAt
    }
  }
`;

const GET_COMMENTS = gql`
  ${COMMENT_FRAGMENT}
  query ($articleId: String!) {
    getComments(articleId: $articleId) {
      ...CommentFields
    }
  }
`;

const COMMENT_CREATED = gql`
  subscription {
    commentCreated {
      id
      articleId
      text
      ratingScore
      canVote
      parentId
      createdAt
    }
  }
`;

const Comments: React.FC<IArticle> = (article: IArticle) => {
  /* Hooks */
  const { loading, error, data, subscribeToMore } = useQuery(GET_COMMENTS, {
    variables: {
      articleId: article.id,
    },
  });
  const user = useUser();
  const [currentlyReplyingCommentId, setCurrentlyReplyingCommentId] = useState<string | null>(null);

  useEffect(() => {
    subscribeToMore({
      document: COMMENT_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newComment = subscriptionData.data.commentCreated;

        return {
          getComments: [...prev.getComments, newComment],
        };
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    toast.error(error?.message);
  }, [error]);

  /* Methods */
  const calculateCommentsCount = (comments: IComment[]): number =>
    comments.reduce(
      (acc, comment: IComment) =>
        acc + 1 + calculateCommentsCount((comment.children as IComment[]) ?? []),
      0,
    );

  const handleToggleReply = (commentId: string) => {
    if (currentlyReplyingCommentId === commentId) {
      setCurrentlyReplyingCommentId(null);
    } else {
      setCurrentlyReplyingCommentId(commentId);
    }
  };

  /* Render */
  if (loading) return <BeatLoader />;

  return (
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='text-4xl font-bold mb-4 border-b-2 pb-2 border-blue-600'>
        Comments ({calculateCommentsCount(data.getComments)})
      </h2>
      {user && (
        <motion.div
          className='mt-6 mb-10'
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SendComment id={article.id} />
        </motion.div>
      )}
      <div className='space-y-5'>
        {data.getComments?.map((comment: IComment) => (
          <Comment
            key={comment.id}
            id={comment.id}
            parentId={comment.id}
            text={comment.text}
            ratingScore={comment.ratingScore}
            user={comment.user}
            articleId={comment.articleId}
            createdAt={comment.createdAt}
            canVote={comment.canVote}
            children={comment.children}
            isReplying={currentlyReplyingCommentId === comment.id}
            onToggleReply={() => handleToggleReply(comment.id)}
            handleToggleReply={handleToggleReply}
            currentlyReplyingCommentId={currentlyReplyingCommentId as string}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Comments;
