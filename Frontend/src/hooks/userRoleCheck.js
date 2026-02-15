import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useRoleCheck = () => {
  const { user } = useContext(AuthContext);

  return {
    isAdmin: user?.role === 'admin',
    isWorker: user?.role === 'worker',
    hasRole: (roles) => user?.role && roles.includes(user.role),
    role: user?.role,
  };
};
