import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext }  from '../context/UserContext.jsx';

const PrivateRoute = ({ adminRoute = false }) => {
  const { user, loading } = useUserContext();

  // Show a loading spinner or message while loading user data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Once loading is done, check if user exists
  if (!user) {
    // Redirect to login if no user is found
    return <Navigate to="/login" />;
  }

  // If it's an admin route and user is not admin, redirect them
  if (adminRoute && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Render the protected component if everything is fine
  return <Outlet />;
};

export default PrivateRoute;
