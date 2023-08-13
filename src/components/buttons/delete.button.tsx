import React, { useState } from 'react';
import { useTransition, animated } from '@react-spring/web';
import { IArticle } from '../../api/interface/article.interface';
import { removeArticle } from '../../api/article.api';
import { useAppDispatch } from '../../store';
import { toast } from 'react-toastify';

const DeleteButton: React.FC<{ article: IArticle }> = ({ article }) => {
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useAppDispatch();

  const transitions = useTransition(showDialog, {
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    enter: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    leave: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
  });

  const handleRemove = async () => {
    try {
      await dispatch(removeArticle(article));
      toast.success('Article removed successfully.');
    } catch (error) {
      // The error will be handled by our middleware, no need to show a toast here.
    }
    setShowDialog(false);
  };

  return (
    <div className='relative inline-block'>
      <button
        onClick={() => setShowDialog(true)}
        className='bg-red-500 text-white px-4 py-1 rounded'
      >
        Delete
      </button>

      {transitions((styles, item) =>
        item ? (
          <animated.div
            style={styles}
            className='absolute top-100 -left-40 mt-2 w-64 px-2 py-4 z-50 bg-white shadow rounded'
          >
            <p className='mb-4 text-lg font-semibold'>
              Are you sure you want to delete this article?
            </p>
            <button
              onClick={handleRemove}
              className='inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-300 disabled:opacity-25 transition ease-in-out duration-150'
            >
              Yes
            </button>
            <button
              onClick={() => setShowDialog(false)}
              className='ml-2 inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150'
            >
              No
            </button>
          </animated.div>
        ) : null,
      )}
    </div>
  );
};

export default DeleteButton;
