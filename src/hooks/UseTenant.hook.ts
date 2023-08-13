import { useContext } from 'react';
import { TenantContext } from '../context/TenantContext';

export const useTenant = () => {
  const context = useContext(TenantContext);

  if (context === null) {
    throw new Error('useTenant must be used within a TenantProvider');
  }

  return context;
};
