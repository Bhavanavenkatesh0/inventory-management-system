import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn === "true" ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;