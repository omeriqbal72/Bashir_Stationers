import { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';

const useAuth = () => {
  const { user, loading } = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    console.log('loading:', loading);
    console.log('User:', user);
    if (!loading) {
      if (user) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    }
  }, [loading, user]);

  return { isAuthorized, user, loading };
};

export default useAuth;
