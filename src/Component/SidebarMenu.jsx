import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt,
  faComments,
  faAngleRight,
  faAngleDown,
  faUser,
  faCog,
  faSignOutAlt,
  faQuestionCircle,
  faBookOpen,
  faInfoCircle,
  faFileContract,
  faUserShield,
  faUserTie,
  faHandsPraying,
  faCalendarCheck,
  faMusic,
  faUtensils,
  faStarOfDavid,
  faShoppingBag,
  faSlidersH,
} from '@fortawesome/free-solid-svg-icons';

function SidebarMenu({ collapsed }) {
  const [activeMenus, setActiveMenus] = useState([]);

  const toggleMenu = (menuId) => {
    if (activeMenus.includes(menuId)) {
      setActiveMenus(activeMenus.filter(id => id !== menuId));
    } else {
      setActiveMenus([...activeMenus, menuId]);
    }
  };

  const menuSections = [
    {
      id: 'pinned',
      items: [
        {
          id: 'dashboards',
          title: 'Dashboards',
          icon: faTachometerAlt,
          path: '/dashboard'
        },
        {
          id: 'user',
          title: 'User',
          icon: faUser,
          path: '/user'
        },
        {
          id: 'pandit',
          title: 'Pandit',
          icon: faUserTie,
          path: '/pandit'
        },
        {
          id: 'services',
          title: 'Services',
        },
        {
          id: 'Category',
          title: 'Category',
          icon: faHandsPraying,
          subItems: [
            { title: 'All Categories', path: "/get/get-category-list" },
            { title: 'Add Categories', path: '/create/create-category' },
            
          ]
        },

        {
          id: 'Decoration',
          title: 'Decorations',
          icon: faHandsPraying,
          subItems: [
            { title: 'All Decorations', path: '/get/get-decoration' },
            { title: 'Add Decorations', path: "/create/create-decoration" },
            
          ]
        }
        // {
        //   id: 'bhavya-ayojan',
        //   title: 'Bhavya Ayojan',
        //   icon: faCalendarCheck,
        //   subItems: [
        //     { title: 'Category', path: '#' },
        //     { title: 'Add Ayojan', path: '#' },
        //     { title: 'Booking', path: '#' },
        //   ]
        // },
        // {
        //   id: 'bhajan-mandal',
        //   title: 'Bhajan Mandal',
        //   icon: faMusic,
        //   subItems: [
        //     { title: 'Category', path: '/bhajan/bhajan-category' },
        //     { title: 'Add Mandali', path: '/bhajan/add-mandali' },
        //     { title: 'Mandali', path: '/bhajan/mandali' },
        //     { title: 'Booking', path: '/bhajan/bhajan-booking' },
        //   ]
        // },
        // {
        //   id: 'brahman-bhoj',
        //   title: 'Brahman Bhoj',
        //   icon: faUtensils,
        //   path: '/brahman-bhoj/request'
        // },
        // {
        //   id: 'virtual-services',
        //   title: 'Virtual Services',
        // },
        // {
        //   id:'paramarsh',
        //   title:'Paramarsh',
        //   icon:faComments,
        //   subItems:[
        //     { title:'Paramarsh category',path:'/paramarsh/category'},
        //     { title:'Paramarsh Request',path:'/paramarsh/paramarsh-request'}
        //   ]
        // },
        // {
        //   id:'kundali',
        //   title:'Kundali',
        //   icon:faStarOfDavid,
        //   subItems:[
        //     { title:'Kunadali Matching',path:'/kundali/kundali-matching'},
        //     { title:'Kunadali Making',path:'/kundali/kundali-making'}
        //   ]
        // },
        // {
        //   id: 'ecommerce-section',
        //   title: 'Ecommerce',
        // },
        // {
        //   id: 'ecommerce',
        //   title: 'E Commerce',
        //   icon: faShoppingBag,
        //   subItems: [
        //     { title: 'Product Category', path: '/e-commerce/product-category' },
        //     { title: 'Product', path: '/e-commerce/product' },
        //     { title: 'Order', path:'/e-commerce/order'},
        //   ]
        // },
        // {
        //   id: 'story',
        //   title: 'Stroy',
        //   icon: faBookOpen,
        //   subItems: [
        //     { title: 'Story Category', path: '/story/story-category' },
        //     { title: 'Story', path: '/story' }
        //   ]
        // },
        // {
        //   id: 'slider',
        //   title: 'Slider',
        //   icon :faSlidersH,
        //   subItems : [
        //     {title:'Slider Category', path:'/slider/slider-category'},
        //     {title:'Slider', path:'/slider/slider'},
        //   ]
        // },
        // {
        //   id:'enqueries',
        //   title : 'Enqueries',
        //   icon:faQuestionCircle,
        //   path:'/enqueries'
        // },
        // {
        //   id:'about-us',
        //   title : 'About Us',
        //   icon:faInfoCircle,
        //   path:'/about-us'
        // },
        // {
        //   id:'terms-and-conditions',
        //   title : 'Terms & Conditions',
        //   icon:faFileContract,
        //   path:'/terms-and-conditions'
        // },
        // {
        //   id:'privacy-and-policy',
        //   title : 'Privacy & Policy',
        //   icon:faUserShield,
        //   path:'/privacy-and-policy'
        // },
        // {
        //   id:'settings',
        //   title : 'Settings',
        //   icon:faCog,
        //   path:'/settings'
        // },
        // {
        //   id:'logout',
        //   title : 'Logout',
        //   icon:faSignOutAlt,
        //   path:'/logout'
        // },
      ]
    },
  ];

  const renderMenuItem = (item, level = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = activeMenus.includes(item.id);

    return (
      <li 
        key={item.id} 
        className={`sidebar-item ${hasSubItems ? 'has-submenu' : ''} ${isActive ? 'active' : ''}`}
      >
        {item.path && !hasSubItems ? (
          <a 
            className="sidebar-link" 
            href={item.path}
          >
            {item.icon && (
              <FontAwesomeIcon 
                icon={item.icon} 
                className={`sidebar-icon ${level > 0 ? 'submenu-icon' : ''}`} 
              />
            )}
            {!collapsed && (
              <>
                <span className="sidebar-text">
                  {item.title}
                </span>
              </>
            )}
          </a>
        ) : (
          <div 
            className="sidebar-link"
            onClick={() => hasSubItems ? toggleMenu(item.id) : null}
          >
            {item.icon && (
              <FontAwesomeIcon 
                icon={item.icon} 
                className={`sidebar-icon ${level > 0 ? 'submenu-icon' : ''}`} 
              />
            )}
            {!collapsed && (
              <>
                <span className="sidebar-text">
                  {item.title}
                </span>
                {hasSubItems && (
                  <FontAwesomeIcon 
                    icon={isActive ? faAngleDown : faAngleRight} 
                    className="dropdown-icon"
                  />
                )}
              </>
            )}
          </div>
        )}

        {hasSubItems && !collapsed && (
          <ul className={`submenu ${isActive ? 'open' : ''}`}>
            {item.subItems.map((subItem) => (
              <li key={subItem.title} className="submenu-item">
                <a href={subItem.path} className="submenu-link">
                  {subItem.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="sidebar-menu">
      <nav>
        {menuSections.map((section) => (
          <div key={section.id} className="menu-section mt-5">
            {!collapsed && section.title && (
              <div className="section-title">{section.title}</div>
            )}
            <ul className="menu-items">
              {section.items.map((item) => renderMenuItem(item))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default SidebarMenu;