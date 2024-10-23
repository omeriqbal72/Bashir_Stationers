import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext }  from '../context/UserContext.jsx';
import Loader from '../components/Loader/Loader.jsx';

const PrivateRoute = ({ adminRoute = false }) => {
  const { user, loading } = useUserContext();

  // Show a loading spinner or message while loading user data
  if (loading) {
    return <Loader height={100} /> ;
  }

  // Once loading is done, check if user exists
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminRoute && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
