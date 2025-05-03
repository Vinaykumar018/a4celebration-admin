import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignCenter, faAngleRight, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { 
  faSearch, 
  faStar, 
  faMoon, 
  faSun,
  faShoppingCart, 
  faBell, 
  faUser, 
  faEnvelope, 
  faFileAlt, 
  faServer, 
  faCog, 
  faSignOutAlt,
  faAngleDown,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarkFlipped, setIsBookmarkFlipped] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleBookmark = () => setIsBookmarkFlipped(!isBookmarkFlipped);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <header className="page-header">
      <div className="header-wrapper grid grid-cols-12 m-0">
        <form className={`form-inline search-full col-auto ${isSearchOpen ? 'block' : 'hidden'}`}>
          <div className="form-group w-full">
            <div className="Typeahead Typeahead--twitterUsers">
              <div className="u-posRelative">
                <input 
                  className="demo-input Typeahead-input form-control-plaintext w-full" 
                  type="text" 
                  placeholder="Search Anything Here..." 
                  name="q" 
                  autoFocus
                />
                <div className="spinner-border Typeahead-spinner" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <button 
                  type="button" 
                  className="close-search"
                  onClick={toggleSearch}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <div className="Typeahead-menu"></div>
            </div>
          </div>
        </form>

        <div className="left-header col-span-5 xxl:col-span-6 xl:col-span-5 lg:col-span-4 md:col-span-3">
          <div className="notification-slider">
            <div className="h-full !flex items-center">
              <FontAwesomeIcon icon={faAngleRight} className="f-light" />
            </div>
          </div>
        </div>

        <div className="nav-right col-span-7 xxl:col-span-6 xl:col-span-7 md:col-span-11 float-right right-header p-0 ms-auto">
          <ul className="nav-menus flex items-center">
            <li className="fullscreen-body">
              <button onClick={toggleFullscreen}>
                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
              </button>
            </li>

          

            <li className="cart-nav onhover-dropdown">
              <div className="cart-box relative">
                <FontAwesomeIcon icon={faShoppingCart} />
                <span className="badge rounded-full badge-danger text-white absolute -top-2 -right-2">2</span>
              </div>
              <div className="cart-dropdown onhover-show-div">
                <h6 className="mb-0 dropdown-title text-[18px]">Cart</h6>
                <ul>
                  <li className="total">
                    <h6 className="mb-0">
                      Order Total : <span className="float-right">$1000.00</span>
                    </h6>
                  </li>
                  <li className="text-center">
                    <a className="block view-cart font-bold btn btn-primary text-white w-full rounded-full hover:text-white" href="/cart">
                      View Cart
                    </a>
                    <a className="view-checkout btn btn-primary text-white w-full font-bold rounded-full hover:text-white mt-2" href="/checkout">
                      Checkout
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li className="onhover-dropdown">
              <div className="notification-box relative">
                <FontAwesomeIcon icon={faBell} />
                <span className="badge rounded-full badge-success text-white absolute -top-2 -right-2">4</span>
              </div>
              <div className="onhover-show-div notification-dropdown">
                <h6 className="mb-0 dropdown-title text-[18px]">Notifications</h6>
                <ul>
                </ul>
              </div>
            </li>

            <li className="profile-nav onhover-dropdown pe-0 py-0">
              <div className="flex profile-media items-center">
                <img className="w-10 h-10 rounded-full" src="/src/assets/images/logo6.png" style={{width:"30px",height:"30px",borderRadius:"50% !important;"}} alt="Profile" />
                <div className="grow w-[calc(100%_-_250px)] ml-2">
                  <span>Vaidic  Sanskar</span>
                  <p className="mb-0 flex items-center">
                    Admin <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                  </p>
                </div>
              </div>
              <ul className="profile-dropdown onhover-show-div">
                {/* <li>
                  <a className="flex items-center" href="/account">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    <span>Account</span>
                  </a>
                </li>
                <li>
                  <a className="flex items-center" href="/inbox">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    <span>Inbox</span>
                  </a>
                </li>
                <li>
                  <a className="flex items-center" href="/tasks">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                    <span>Taskboard</span>
                  </a>
                </li>
                <li>
                  <a className="flex items-center" href="/settings">
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    <span>Settings</span>
                  </a>
                </li> */}
                <li>
                  <a className="flex items-center" href="/logout">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    <span>Log out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;