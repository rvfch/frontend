import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Article } from '../components/Article';
import { useAppDispatch, useAppSelector } from '../store';
import { getAllArticles } from '../api/article.api';
import BeatLoader from 'react-spinners/BeatLoader';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { IArticle } from '../api/interface/article.interface';
import { CLEAR_RECENT_ARTICLES, articleSelector } from '../store/features/article.slice';

export const ArticleList: React.FC = () => {
  const initialLoad = useRef(true);

  const dispatch = useAppDispatch();
  const { articles, isLoading, error, hasMore } = useAppSelector(articleSelector);

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (initialLoad.current && !articles.length && !error) {
      dispatch(CLEAR_RECENT_ARTICLES());
      dispatch(getAllArticles({ page, pageSize: 10 }));
      initialLoad.current = false;
      setPage(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles, error]);

  const handleLoadMore = useCallback(() => {
    if (!error) {
      dispatch(getAllArticles({ page, pageSize: 10 }));
      setPage((prevPage) => prevPage + 1);
    }
  }, [dispatch, error, page]);

  const [articlesRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasMore,
    onLoadMore: handleLoadMore,
    rootMargin: '0px 0px 400px 0px',
  });

  const renderArticle = (article: IArticle) => (
    <div key={article.id} className='transition duration-500 ease-in-out transform hover:scale-105'>
      <Article {...article} />
    </div>
  );

  if (isLoading) return <BeatLoader className='h-screen flex items-center justify-center' />;

  return (
    <div className='container mx-auto p-4 space-y-8'>
      <h1 className='text-3xl font-bold mb-4'>Recent articles</h1>
      {articles?.length ? articles.map(renderArticle) : <>No articles :(</>}
      <div ref={articlesRef}></div>
    </div>
  );
};
