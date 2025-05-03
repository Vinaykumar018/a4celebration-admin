import React, { useState } from 'react';

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Static credentials for demonstration
  const staticCredentials = {
    email: 'admin@gmail.com',
    password: '123456'
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Check credentials
    if (email === staticCredentials.email && password === staticCredentials.password) {
      // Store authentication data in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('user_type', email);
      localStorage.setItem('authToken', 'dummy-auth-token-123'); // In a real app, this would come from your backend
      
      setSuccess(true);
      
      // Optional: Redirect after successful login
      setTimeout(() => {
        window.location.href = '/dashboard'; // Change this to your desired route
      }, 1500);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container">
      <link rel="icon" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      
      <div className="grid grid-cols-12">
        <div className="col-span-5 xl:col-span-12">
          <img className="bg-img-cover bg-center" src="/src/assets/images/login/3.jpg" alt="loginpage"/>
        </div>
        <div className="col-span-7 xl:col-span-12">
          <div className="login-card login-dark">
            <div>
              <div>
                <a className="logo !text-start" href="index-2.html"> 
                  <img className="max-w-full h-auto for-light" src="/src/assets/images/logo/logo.png" alt="loginpage"/>
                  <img className="max-w-full h-auto for-dark" src="/src/assets/images/logo/logo_dark.png" alt="loginpage"/>
                </a>
              </div>
              <div className="login-main">
                <form className="theme-form" method="post" onSubmit={handleSubmit}>
                  <h4>Sign in to account</h4>
                  <p>Enter your email & password to login</p>
                  
                  {error && (
                    <div className="alert alert-danger mb-4">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="alert alert-success mb-4">
                      Login successful! Redirecting...
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label className="col-form-label">Email Address</label>
                    <input 
                      className="form-control" 
                      type="email" 
                      required 
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Password</label>
                    <div className="form-input relative">
                      <input 
                        className="form-control" 
                        type={passwordVisible ? "text" : "password"} 
                        required 
                        placeholder="*********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="show-hide" onClick={togglePasswordVisibility}>
                        <span className={`show ${passwordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'}`}></span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-0">
                    <div className="form-check flex gap-1 items-center">
                      <input 
                        className="checkbox-primary form-check-input custom-checkbox" 
                        id="checkbox1" 
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            localStorage.setItem('rememberMe', 'true');
                          } else {
                            localStorage.removeItem('rememberMe');
                          }
                        }}
                      />
                      <label className="text-muted form-check-label !mb-0" htmlFor="checkbox1">Remember password</label>
                    </div>
                    <button className="btn btn-primary btn-block w-full text-white mt-[24px]" type="submit">Sign in</button>
                  </div>
                  <h6 className="text-muted or mt-[24px]">Or Sign in with</h6>
                  <div className="social mt-[24px]">
                    <div className="btn-showcase">
                      <a className="btn btn-light inline-block" href="https://www.linkedin.com/login" target="_blank" rel="noopener noreferrer">
                        <i className="fa fa-linkedin"></i>
                      </a>
                      <a className="btn btn-light inline-block" href="https://twitter.com/login?lang=en" target="_blank" rel="noopener noreferrer">
                        <i className="fa fa-twitter"></i>
                      </a>
                      <a className="btn btn-light inline-block" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                        <i className="fa fa-facebook"></i>
                      </a>
                      <a className="btn btn-light inline-block" href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
                        <i className="fa fa-google"></i>
                      </a>
                    </div>
                  </div>
                  <p className="text-center mt-[24px] !mb-0">Don't have account?<a className="ms-2" href="sign-up.html">Create Account</a></p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;