import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootState, useAppDispatch, useAppSelector } from '../store';
import { initTenant } from '../api/auth.api';
import { parseTenantId } from '../helpers/auth.helpers';

import { ArticleList } from './ArticleList';
import ArticleDetail from './ArticleDetail';
import Auth from './Auth';
import MyArticles from './MyArticles';
import CreateEditArticle from './CreateEditArticle';
import { CreateEditArticleMode } from '../components/core/enums/CreateEditArticleMode.enum';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from '../components/core/ProtectedRoute';
import NotFound from './NotFound';
import BeatLoader from 'react-spinners/BeatLoader';

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tenantInitialized } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!tenantInitialized) {
      dispatch(initTenant({ id: parseTenantId() }));
    }
  }, [dispatch, tenantInitialized]);

  return (
    <>
      <ToastContainer />
      {tenantInitialized ? (
        <Routes>
          <Route path='/:tenantId/*'>
            <Route index element={<ArticleList />} />
            <Route path='login' element={<Auth />} />
            <Route path='signup' element={<Auth signup />} />
            <Route
              path='myarticles'
              element={
                <ProtectedRoute>
                  <MyArticles />
                </ProtectedRoute>
              }
            />
            <Route
              path='article/new'
              element={
                <ProtectedRoute>
                  <CreateEditArticle mode={CreateEditArticleMode.Create} />
                </ProtectedRoute>
              }
            />
            <Route
              path='article/:articleId/edit'
              element={
                <ProtectedRoute>
                  <CreateEditArticle mode={CreateEditArticleMode.Edit} />
                </ProtectedRoute>
              }
            />
            <Route path='articles/:articleId' element={<ArticleDetail />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      ) : (
        <BeatLoader className='h-screen flex items-center justify-center' />
      )}
    </>
  );
};

export default Main;
