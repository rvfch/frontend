import { IUser } from './user.interface';

export interface IArticle {
  id?: string;
  title?: string;
  perex?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: IUser;
  imageUrl?: string;
  commentsCount?: number;
  status?: 'DRAFT' | 'PUBLISHED';
}
