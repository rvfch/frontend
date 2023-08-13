import axios from 'axios';
import Calls from '.';
import { AppDispatch } from '../store';
import {
  CREATE_ARTICLE_FAILURE,
  CREATE_ARTICLE_REQUEST,
  CREATE_ARTICLE_SUCCESS,
  GET_ARTICLE_FAILURE,
  GET_ARTICLE_REQUEST,
  GET_ARTICLE_SUCCESS,
  MY_ARTICLES_FAILURE,
  MY_ARTICLES_REQUEST,
  MY_ARTICLES_SUCCESS,
  PUBLISH_ARTICLE_FAILURE,
  PUBLISH_ARTICLE_REQUEST,
  PUBLISH_ARTICLE_SUCCESS,
  RECENT_ARTICLES_FAILURE,
  RECENT_ARTICLES_REQUEST,
  RECENT_ARTICLES_SUCCESS,
  REMOVE_ARTICLE_FAILURE,
  REMOVE_ARTICLE_REQUEST,
  REMOVE_ARTICLE_SUCCESS,
  UPDATE_ARTICLE_FAILURE,
  UPDATE_ARTICLE_REQUEST,
  UPDATE_ARTICLE_SUCCESS,
} from '../store/features/article.slice';
import { IArticle } from './interface/article.interface';
import { IPage } from './interface/page.interface';

const PREFIX = '/blog';

export const getArticle = (id: string) => async (dispatch: AppDispatch) => {
  // GET_ARTICLE_REQUEST
  dispatch(GET_ARTICLE_REQUEST());
  try {
    const response = await Calls.get(PREFIX + `/article/${id}`);
    // GET_ARTICLE_SUCCESS
    dispatch(GET_ARTICLE_SUCCESS(response.data));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // GET_ARTICLE_FAILURE
      dispatch(GET_ARTICLE_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const getAllArticles = (dtoIn: IPage) => async (dispatch: AppDispatch) => {
  // RECENT_ARTICLES_REQUEST
  dispatch(RECENT_ARTICLES_REQUEST());
  try {
    const response = await Calls.get(PREFIX + `/article/all`, { params: { ...dtoIn } });
    // RECENT_ARTICLES_SUCCESS
    dispatch(RECENT_ARTICLES_SUCCESS(response.data));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // RECENT_ARTICLES_FAILURE
      dispatch(RECENT_ARTICLES_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const getMyArticles = (dtoIn: IPage) => async (dispatch: AppDispatch) => {
  // MY_ARTICLES_REQUEST
  dispatch(MY_ARTICLES_REQUEST());
  try {
    const response = await Calls.get(PREFIX + `/article/myArticles`, { params: { ...dtoIn } });
    // MY_ARTICLES_SUCCESS
    dispatch(MY_ARTICLES_SUCCESS(response.data));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // RECENT_ARTICLES_FAILURE
      dispatch(MY_ARTICLES_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const publishArticle = (dtoIn: IArticle) => async (dispatch: AppDispatch) => {
  // PUBLISH_ARTICLE_REQUEST
  dispatch(PUBLISH_ARTICLE_REQUEST());
  try {
    const response = await Calls.post(PREFIX + `/article/publish`, dtoIn);
    // PUBLISH_ARTICLE_SUCCESS
    dispatch(PUBLISH_ARTICLE_SUCCESS(response.data));

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // PUBLISH_ARTICLE_FAILURE
      dispatch(PUBLISH_ARTICLE_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const createArticle = (dtoIn: IArticle) => async (dispatch: AppDispatch) => {
  // CREATE_ARTICLE_REQUEST
  dispatch(CREATE_ARTICLE_REQUEST());
  try {
    const response = await Calls.post(PREFIX + `/article/create`, dtoIn);
    // CREATE_ARTICLE_SUCCESS
    dispatch(CREATE_ARTICLE_SUCCESS(response.data));

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // CREATE_ARTICLE_FAILURE
      dispatch(CREATE_ARTICLE_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const updateArticle = (dtoIn: IArticle) => async (dispatch: AppDispatch) => {
  // UPDATE_ARTICLE_REQUEST
  dispatch(UPDATE_ARTICLE_REQUEST());
  try {
    const response = await Calls.patch(PREFIX + `/article/update`, dtoIn);
    // UPDATE_ARTICLE_SUCCESS
    dispatch(UPDATE_ARTICLE_SUCCESS(dtoIn));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // UPDATE_ARTICLE_FAILURE
      dispatch(UPDATE_ARTICLE_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const removeArticle = (dtoIn: IArticle) => async (dispatch: AppDispatch) => {
  // REMOVE_ARTICLE_REQUEST
  dispatch(REMOVE_ARTICLE_REQUEST());
  try {
    const response = await Calls.delete(PREFIX + `/article/remove`, { data: dtoIn });
    // REMOVE_ARTICLE_SUCCESS
    dispatch(REMOVE_ARTICLE_SUCCESS(dtoIn));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // REMOVE_ARTICLE_FAILURE
      dispatch(REMOVE_ARTICLE_FAILURE(error.response?.data));
      throw error;
    }
  }
};
