import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'; 
import './App.css';
import './style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import './tailwind.css';
import WebRoutes from './WebRoutes';
import Footer from './Component/Footer';
import SideBar from './Component/SideBar';
import PageTitle from './Component/PageTitle';
import Loader from './Component/Loader';
import Header from './Component/Header';
function AppContent() {
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken && location.pathname !== '/login') {
      navigate('/login');
    } 
    else if (authToken) {
      setUserType(localStorage.getItem('user_type')); 
    }
  }, [navigate, location]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [location]);

  // Check if current route is login page
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
        <div className="page-wrapper compact-wrapper" id="pageWrapper">
          {/* Don't show header/sidebar on login page */}
          {!isLoginPage && <Header />}
          
          <div className={`page-body-wrapper ${isLoginPage ? 'login-page' : ''}`}>
            {!isLoginPage && <SideBar />}
            
            <div className="page-body">
              {!isLoginPage && <PageTitle />}              
              <WebRoutes />
            </div>
            
            {!isLoginPage && <Footer />}
          </div>
         </div> 
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;