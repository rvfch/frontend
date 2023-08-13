import { Link, LinkProps } from 'react-router-dom';
import { useTenant } from '../../hooks/UseTenant.hook';

const TLink: React.FC<LinkProps> = ({ to, state = null, ...props }) => {
  const { tenantId } = useTenant();

  return <Link to={`/${tenantId}/${to}`} state={state ?? {}} {...props} />;
};

export default TLink;
