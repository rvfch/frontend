import { LinkProps, Navigate } from 'react-router-dom';
import { useTenant } from '../../hooks/UseTenant.hook';

const TNavigate: React.FC<LinkProps> = ({ to, ...props }) => {
  const { tenantId } = useTenant();

  return <Navigate to={`/${tenantId}/${to}`} {...props} />;
};

export default TNavigate;
