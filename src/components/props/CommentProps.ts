export interface CommentProps {
  id: string;
  userName: string;
  date: string;
  text: string;
  rating: number;
  replies?: CommentProps[]; // nested comments
}
