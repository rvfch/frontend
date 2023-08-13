import { IUser } from '../api/interface/user.interface';
import { useAppSelector } from '../store';

export const useUser = (): IUser | null => {
  const user = useAppSelector((state) => state.auth.user);

  return user;
};
