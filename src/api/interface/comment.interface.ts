import { IUser } from './user.interface';

export interface IComment {
  id: string;
  text: string;
  ratingScore: number;
  user: IUser;
  articleId: string;
  createdAt: string;
  canVote: boolean;
  parentId?: string;
  children?: IComment[];
}
