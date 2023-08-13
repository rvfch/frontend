import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { IComment } from '../api/interface/comment.interface';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { toast } from 'react-toastify';
import SendComment from './SendComment';
import { useUser } from '../hooks/UseUser.hook';
import { motion } from 'framer-motion';
import moment from 'moment';

interface CommentComponentProps extends IComment {
  level?: number;
  children?: CommentComponentProps[];
  isReplying?: boolean;
  onToggleReply?: () => void;
  handleToggleReply?: (commentId: string) => void;
  currentlyReplyingCommentId?: string;
}

const RATE_COMMENT = gql`
  mutation ($dto: RateCommentDto!) {
    rateComment(dto: $dto) {
      id
      articleId
      user {
        id
        name
      }
      text
      ratingScore
    }
  }
`;

const COMMENT_RATED = gql`
  subscription {
    commentRated {
      id
      articleId
      user {
        id
        name
      }
      text
      ratingScore
    }
  }
`;

const Comment: React.FC<CommentComponentProps> = ({
  id,
  text,
  user,
  createdAt,
  ratingScore = 0,
  level = 0,
  canVote,
  articleId,
  children = [],
  parentId,
  isReplying,
  handleToggleReply,
  currentlyReplyingCommentId,
}) => {
  /* Hooks */
  const [rateComment] = useMutation(RATE_COMMENT);
  const { data: ratedData } = useSubscription(COMMENT_RATED);

  const currentUser = useUser();

  const [voted, setVoted] = useState(!canVote);

  const [localRatingScore, setLocalRatingScore] = useState(ratingScore);

  useEffect(() => {
    if (ratedData?.commentRated?.id === id) {
      setLocalRatingScore(ratedData.commentRated.ratingScore);
    }
  }, [ratedData, id]);

  /* Methods */
  const handleRate = async (isUpvote: boolean) => {
    try {
      await rateComment({
        variables: {
          dto: {
            commentId: id,
            userId: currentUser?.id,
            isUpvote,
          },
        },
      });
      setVoted(true);
    } catch (error) {
      toast.error(error as string);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  /* Render */
  return (
    <motion.div
      className='my-5 shadow-md rounded-lg p-6 bg-white transition-transform duration-300'
      style={{ marginLeft: `${level * 20}px` }}
      initial='hidden'
      animate='visible'
      variants={fadeIn}
    >
      <div className='flex items-center mb-4'>
        <img
          className='w-8 h-8 rounded-full mr-4 hover:shadow-md transition-transform transform hover:scale-105 duration-300'
          src='https://via.placeholder.com/150'
          alt='User Avatar'
        />
        <div>
          <p className='font-semibold text-sm text-blue-600'>{user?.name}</p>
          <p className='text-sm text-gray-500 mt-1'>
            {moment(createdAt).format('DD-MM-YYYY hh:mm:ss')}
          </p>
        </div>
      </div>
      <p className='mb-3 text-base text-gray-700 leading-relaxed'>{text}</p>
      <div className='flex items-center space-x-3'>
        <AiFillStar />
        <span className='text-gray-800 font-medium'>{localRatingScore}</span>
        {!voted && currentUser && (
          <>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              className='text-green-500 text-lg'
              onClick={() => handleRate(true)}
            >
              <FaArrowUp />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              className='text-red-500 text-lg'
              onClick={() => handleRate(false)}
            >
              <FaArrowDown />
            </motion.button>
          </>
        )}
      </div>
      <div className='flex mt-4 items-center justify-between'>
        {currentUser && !isReplying && (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0px 0px 8px rgba(0,0,255,0.2)' }}
            whileTap={{ scale: 0.95 }}
            className='py-1 px-3 bg-blue-100 hover:bg-blue-200 text-blue-500 rounded-md transition-transform duration-300'
            onClick={() => handleToggleReply && handleToggleReply(id)}
          >
            Reply
          </motion.button>
        )}

        {isReplying && (
          <div className='mt-3 border-t border-gray-200 pt-3 w-full'>
            <SendComment
              replyUsername={user?.name}
              onSuccess={() => handleToggleReply && handleToggleReply(id)}
              id={articleId}
              parentId={parentId}
            />
          </div>
        )}
      </div>
      {children?.map((reply) => (
        <Comment
          key={reply.id}
          id={reply.id}
          text={reply.text}
          level={level + 1}
          ratingScore={reply.ratingScore}
          user={reply.user}
          articleId={reply.articleId}
          createdAt={reply.createdAt}
          canVote={reply.canVote}
          children={reply.children}
          parentId={parentId}
          isReplying={currentlyReplyingCommentId === reply.id}
          onToggleReply={() => handleToggleReply && handleToggleReply(reply.id)}
          handleToggleReply={handleToggleReply}
          currentlyReplyingCommentId={currentlyReplyingCommentId}
        />
      ))}
    </motion.div>
  );
};

export default Comment;
