import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth.api';
import { useUser } from '../../hooks/UseUser.hook';
import TLink from '../../components/core/TenantLink';
import { useTenant } from '../../hooks/UseTenant.hook';
import { useAppDispatch } from '../../store';

export const AuthenticatedContent: React.FC = () => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tenantId } = useTenant();

  const handleLogout = () => {
    dispatch(logout());
    navigate(`/${tenantId}`);
  };

  return (
    <div className='flex space-x-4 md:space-x-8'>
      <p>
        Hello, <b>{user && user.name}</b>
      </p>
      <TLink to='myarticles' className='text-blue-500'>
        My articles
      </TLink>
      <button className='text-blue-500' onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};
