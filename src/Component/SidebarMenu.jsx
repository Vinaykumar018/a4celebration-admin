import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket,
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
  faLayerGroup,
  faRibbon,
  faGift,
  faCalendarAlt,
  faBoxOpen,
  faMagic,
  faUsers,
  faRupee,
  faMoneyBillTransfer,
  faContactCard
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
          id: 'Category',
          title: 'Category',
          icon: faLayerGroup,
          subItems: [
            { title: 'All Categories', path: "/get/get-category-list" },
            { title: 'Add Categories', path: '/create/create-category' },
          ]
        },
        {
          id: 'Decoration',
          title: 'Decorations',
          icon: faRibbon,
          subItems: [
            { title: 'All Decorations', path: '/get/get-decoration' },
            { title: 'Add Decorations', path: "/create/create-decoration" },
            { title: 'All Decoration Orders', path: "/decoration/orders" }
          ]
        },
        {
          id: 'Gifts',
          title: 'Giftings',
          icon: faGift,
          subItems: [
            { title: 'All Gifts', path: '/get/get-gifts' },
            { title: 'Add Gifts', path: "/create/create-gift" },
            { title: 'All Gift Orders', path: "/gift/orders" }
          ]
        },
        {
          id: 'Event Management',
          title: 'Event Management',
          icon: faCalendarAlt,
          subItems: [
            { title: 'All Events', path: '/get/get-events' },
            { title: 'Add Events', path: "/create/create-event" },
            { title: 'All Events Requests', path: "/event/requests" }
          ]
        },
        {
          id: 'Customized Events',
          title: 'Customized Event Requests',
          icon: faMagic,
          path: "/event/get-custom-requests"
          
        },
        {
          id: 'Orders',
          title: 'All Orders',
          icon: faBoxOpen,
          path: "/orders"
        },
        
        {
          id: 'Transactions',
          title: 'Transactions',
          icon: faMoneyBillTransfer,
          path: "/transactions"
        },
         {
          id: 'coupons',
          title: 'All Coupons',
          icon: faTicket,
          path: "/coupons"
        },
        {
          id: 'users',
          title: 'All Users',
          icon: faUsers,
          path: "/users"
        },
        {
          id: 'contacts',
          title: 'All Contact messages',
          icon: faContactCard,
          path: "/contacts"
        }
         
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