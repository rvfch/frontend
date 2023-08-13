import { createContext, useMemo, useState } from 'react';
import { parseTenantId } from '../helpers/auth.helpers';

type TenantContextType = {
  tenantId: string | null;
  setTenantId: React.Dispatch<React.SetStateAction<string | null>>;
};

export const TenantContext = createContext<TenantContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const TenantProvider: React.FC<Props> = ({ children }) => {
  const [tenantId, setTenantId] = useState<string | null>(parseTenantId());

  const momoizedTenant = useMemo(() => ({ tenantId, setTenantId }), [tenantId, setTenantId]);

  return <TenantContext.Provider value={momoizedTenant}>{children}</TenantContext.Provider>;
};
