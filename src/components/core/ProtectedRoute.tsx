import { useLocation } from 'react-router-dom';
import TNavigate from './TenantNavigate';
import { useUser } from '../../hooks/UseUser.hook';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useUser();
  const location = useLocation();

  return user ? children : <TNavigate to='login' state={{ from: location }} />;
}

export default ProtectedRoute;
