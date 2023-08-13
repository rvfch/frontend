import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IArticle } from '../../api/interface/article.interface';
import { IResponse } from '../../api/interface/response.interface';
import { createSelector } from 'reselect';
import { RootState } from '..';

interface IArticleState {
  articles: IArticle[];
  selectedArticle: IArticle | null;
  myArticles: IArticle[];
  error: IResponse | null;
  isLoading: boolean;
  hasMore: boolean;
}

const initialState: IArticleState = {
  articles: [],
  selectedArticle: null,
  error: null,
  isLoading: false,
  myArticles: [],
  hasMore: false,
};

export const articleSlice = createSlice({
  initialState,
  name: 'article',
  reducers: {
    // RECENT_ARTICLES
    RECENT_ARTICLES_REQUEST: (state) => {
      state.isLoading = true;
      state.hasMore = true;
    },
    RECENT_ARTICLES_SUCCESS: (state, action: PayloadAction<IArticle[]>) => {
      state.articles = [...new Set([...state.articles, ...action.payload])];
      state.isLoading = false;
      state.error = null;
      state.hasMore = action.payload.length === 10;
    },
    RECENT_ARTICLES_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.hasMore = false;
    },
    CLEAR_RECENT_ARTICLES: (state) => {
      state.articles = [];
    },
    // ARTICLE
    GET_ARTICLE_REQUEST: (state) => {
      state.isLoading = true;
    },
    GET_ARTICLE_SUCCESS: (state, action: PayloadAction<IArticle>) => {
      state.selectedArticle = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    GET_ARTICLE_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    // MY_ARTICLES
    MY_ARTICLES_REQUEST: (state) => {
      state.isLoading = true;
      state.hasMore = true;
    },
    MY_ARTICLES_SUCCESS: (state, action: PayloadAction<IArticle[]>) => {
      state.myArticles = [...new Set([...state.myArticles, ...action.payload])];
      state.isLoading = false;
      state.error = null;
      state.hasMore = action.payload.length === 10;
    },
    MY_ARTICLES_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.hasMore = false;
    },
    CLEAR_MY_ARTICLES: (state) => {
      state.myArticles = [];
    },
    // REMOVE ARTICLE
    REMOVE_ARTICLE_REQUEST: (state) => {
      state.isLoading = true;
    },
    REMOVE_ARTICLE_SUCCESS: (state, action: PayloadAction<IArticle>) => {
      if (state.articles) {
        state.articles = state.articles.filter((article) => article.id !== action.payload.id);
      }
      if (state.myArticles) {
        state.myArticles = state.myArticles.filter((article) => article.id !== action.payload.id);
      }
      state.isLoading = false;
      state.error = null;
    },
    REMOVE_ARTICLE_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    // PUBLISH ARTICLE
    PUBLISH_ARTICLE_REQUEST: (state) => {
      state.isLoading = true;
    },
    PUBLISH_ARTICLE_SUCCESS: (state, action: PayloadAction<IArticle>) => {
      if (state.myArticles) {
        state.myArticles = state.myArticles.map((article) =>
          article.id === action.payload.id ? { ...article, status: 'PUBLISHED' } : article,
        );
      }
      state.isLoading = false;
      state.error = null;
    },
    PUBLISH_ARTICLE_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    // SELECT CURRENT ARTICLE
    SELECT_ARTICLE: (state, action: PayloadAction<IArticle>) => {
      state.selectedArticle = action.payload;
    },
    // CREATE ARTICLE
    CREATE_ARTICLE_REQUEST: (state) => {
      state.isLoading = true;
    },
    CREATE_ARTICLE_SUCCESS: (state, action: PayloadAction<IArticle>) => {
      state.error = null;
      if (state.myArticles) {
        state.myArticles.unshift(action.payload);
      }
      state.isLoading = false;
    },
    CREATE_ARTICLE_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    // UPDATE ARTICLE
    UPDATE_ARTICLE_REQUEST: (state) => {
      state.isLoading = true;
    },
    UPDATE_ARTICLE_SUCCESS: (state, action: PayloadAction<IArticle>) => {
      state.error = null;
      state.isLoading = false;
      if (state.myArticles) {
        state.myArticles = state.myArticles.map((article) =>
          article.id === action.payload.id ? action.payload : article,
        );
      }

      if (state.articles) {
        state.articles = state.articles.map((article) =>
          article.id === action.payload.id ? action.payload : article,
        );
      }
    },
    UPDATE_ARTICLE_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(RECENT_ARTICLES_REQUEST, (state) => {
        state.isLoading = true;
      })
      .addCase(RECENT_ARTICLES_SUCCESS, (state, action: PayloadAction<IArticle[]>) => {
        state.isLoading = false;
        if (state.articles) {
          state.articles = state.articles.concat(action.payload);
        }
        state.hasMore = action.payload.length === 10;
      })
      .addCase(RECENT_ARTICLES_FAILURE, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(MY_ARTICLES_REQUEST, (state) => {
        state.isLoading = true;
      })
      .addCase(MY_ARTICLES_SUCCESS, (state, action: PayloadAction<IArticle[]>) => {
        state.isLoading = false;
        if (state.myArticles) {
          state.myArticles = state.myArticles.concat(action.payload);
        }
        state.hasMore = action.payload.length === 10;
      })
      .addCase(MY_ARTICLES_FAILURE, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default articleSlice.reducer;

const selectArticlesState = (state: RootState) => state.articles;

export const articleSelector = createSelector([selectArticlesState], (articles) => ({
  myArticles: articles.myArticles,
  articles: articles.articles,
  isLoading: articles.isLoading,
  error: articles.error,
  hasMore: articles.hasMore,
  selectedArticle: articles.selectedArticle,
}));

export const {
  RECENT_ARTICLES_REQUEST,
  RECENT_ARTICLES_SUCCESS,
  RECENT_ARTICLES_FAILURE,
  CLEAR_RECENT_ARTICLES,
  GET_ARTICLE_REQUEST,
  GET_ARTICLE_SUCCESS,
  GET_ARTICLE_FAILURE,
  MY_ARTICLES_REQUEST,
  MY_ARTICLES_SUCCESS,
  MY_ARTICLES_FAILURE,
  CLEAR_MY_ARTICLES,
  SELECT_ARTICLE,
  REMOVE_ARTICLE_REQUEST,
  REMOVE_ARTICLE_SUCCESS,
  REMOVE_ARTICLE_FAILURE,
  PUBLISH_ARTICLE_REQUEST,
  PUBLISH_ARTICLE_SUCCESS,
  PUBLISH_ARTICLE_FAILURE,
  CREATE_ARTICLE_REQUEST,
  CREATE_ARTICLE_SUCCESS,
  CREATE_ARTICLE_FAILURE,
  UPDATE_ARTICLE_REQUEST,
  UPDATE_ARTICLE_SUCCESS,
  UPDATE_ARTICLE_FAILURE,
} = articleSlice.actions;
