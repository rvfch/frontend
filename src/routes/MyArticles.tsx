import React, { useEffect, useState, useCallback, useRef } from 'react';
import TLink from '../components/core/TenantLink';
import DeleteButton from '../components/buttons/delete.button';
import PublishButton from '../components/buttons/publish.button';
import { useAppDispatch, useAppSelector } from '../store';
import { getMyArticles } from '../api/article.api';
import BeatLoader from 'react-spinners/BeatLoader';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { IArticle } from '../api/interface/article.interface';
import { CLEAR_MY_ARTICLES, articleSelector } from '../store/features/article.slice';

const MyArticles: React.FC = () => {
  /* Hooks */
  const initialLoad = useRef(true);

  const dispatch = useAppDispatch();
  const { myArticles, isLoading, error, hasMore } = useAppSelector(articleSelector);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (initialLoad.current && !myArticles.length && !error) {
      dispatch(CLEAR_MY_ARTICLES());
      dispatch(getMyArticles({ page, pageSize: 20 }));
      initialLoad.current = false;
      setPage(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myArticles, error]);

  const handleLoadMore = useCallback(() => {
    if (!error) {
      dispatch(getMyArticles({ page, pageSize: 20 }));
      setPage((prevPage) => prevPage + 1);
    }
  }, [dispatch, error, page]);

  const [tableRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasMore,
    onLoadMore: handleLoadMore,
    rootMargin: '0px 0px 400px 0px',
  });

  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  /* Methods */

  /* Render */
  if (isLoading) return <BeatLoader className='h-screen flex items-center justify-center' />;

  const renderRows = myArticles.map((article: IArticle, index) => (
    <tr key={article.id} className='bg-white shadow-lg rounded-lg'>
      <td className='px-4 py-2'>
        <input
          type='checkbox'
          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          checked={checkedItems[index]}
          onChange={() => {
            const newCheckedItems = [...checkedItems];
            newCheckedItems[index] = !newCheckedItems[index];
            setCheckedItems(newCheckedItems);

            // Also update the selectAll state based on new values
            setSelectAll(newCheckedItems.every((item) => item));
          }}
        />
      </td>
      <td className='px-4 py-2 max-w-xs truncate'>
        <TLink state={article} to={`articles/${article.id}`}>
          {article.title}
        </TLink>
      </td>
      <td className='px-4 py-2 max-w-xs truncate'>{article.perex}</td>
      <td className='px-4 py-2'>{article.commentsCount}</td>
      <td className='px-4 py-2'>{article.status}</td>
      <td className='px-4 py-2 flex justify-end gap-x-3'>
        <TLink
          className='bg-blue-500 text-white px-4 py-1 rounded'
          to={`article/${article.id}/edit`}
          state={article}
        >
          Edit
        </TLink>
        {article.status === 'DRAFT' && <PublishButton article={article} />}
        <DeleteButton article={article} />
      </td>
    </tr>
  ));

  return (
    <div className='container mx-auto p-4 space-y-8'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-4xl font-bold'>My Articles</h1>
        <TLink to='article/new' className='bg-blue-500 text-white px-6 py-2 rounded'>
          Create New Article
        </TLink>
      </div>
      <table className='w-full text-left border-separate space-y-6'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-4 py-2'>
              <input
                type='checkbox'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                checked={selectAll}
                onChange={() => {
                  const allChecked = myArticles.map(() => !selectAll);
                  setCheckedItems(allChecked);
                  setSelectAll((prev) => !prev);
                }}
              />
            </th>
            <th className='px-4 py-2'>Article Title</th>
            <th className='px-4 py-2'>Perex</th>
            <th className='px-4 py-2'># of Comments</th>
            <th className='px-4 py-2'>Status</th>
            <th className='px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody ref={tableRef}>
          {myArticles.length ? (
            renderRows
          ) : (
            <tr>
              <td colSpan={6} className='text-center'>
                No articles :(
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyArticles;
