import React, { useEffect } from 'react';
import ArticleContent from '../components/ArticleContent';
import Comments from '../components/Comments';
import RelatedArticles from '../components/RelatedArticles';
import { IArticle } from '../api/interface/article.interface';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { getArticle } from '../api/article.api';
import BeatLoader from 'react-spinners/BeatLoader';

export const ArticleDetail: React.FC<IArticle> = () => {
  const { state: article } = useLocation();
  const { articleId } = useParams();
  const dispatch = useAppDispatch();
  const { selectedArticle, isLoading } = useAppSelector((state) => state.articles);

  useEffect(() => {
    if (!article && articleId) {
      dispatch(getArticle(articleId));
    }
  }, [articleId, dispatch, article]);

  const articleToShow = article || selectedArticle;

  // ...mock data...
  const relatedArticles: IArticle[] = [
    {
      id: 'ttert',
      title: 'Related Article 1',
      perex: 'This is a short perex of Related Article 1.',
      createdAt: '21-07-2023',
    },
    {
      id: 'tyert',
      title: 'Related Article 1',
      perex: 'This is a short perex of Related Article 1.',
      createdAt: '21-07-2023',
    },
    // Add more related articles here
  ];

  if (isLoading) return <BeatLoader className='h-screen flex items-center justify-center' />;

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex-grow container mx-auto p-4 flex'>
        <div className='w-2/3 pr-4'>
          <ArticleContent
            title={articleToShow?.title}
            user={articleToShow?.user}
            createdAt={articleToShow?.createdAt}
            content={articleToShow?.content}
            imageUrl={articleToShow?.imageUrl}
            id={articleToShow?.id}
            perex={articleToShow?.perex}
          />
          <hr className='border-t border-gray-300 my-4' />
          <Comments id={articleToShow?.id} />
        </div>
        <div className='w-1/3 pl-4 border-l border-gray-300'>
          <RelatedArticles articles={relatedArticles} />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
