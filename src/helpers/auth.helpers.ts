export const parseTenantId = () => {
  const location = window.location.pathname.split('/');
  if (location && location.length > 1) {
    if (location[1].length > 5) {
      return location[1];
    }
  }
  return 'default';
};
