// ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; // If using Redux
// OR use your existing auth state management

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;