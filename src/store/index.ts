import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import articleReducer from './features/article.slice';
import authReducer from './features/auth.slice';
import filesReducer from './features/files.slice';
import { persistReducer, persistStore } from 'redux-persist';
import localForage from 'localforage';
import { parseTenantId } from '../helpers/auth.helpers';
import errorMiddleware from './middleware/error.middleware';

const persistConfig = {
  key: `auth-${parseTenantId()}`,
  storage: localForage,
  blacklist: ['tenantInitialized', '_persist', 'error'],
};

// Use type casting here
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    articles: articleReducer,
    auth: persistedAuthReducer,
    files: filesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(errorMiddleware),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
