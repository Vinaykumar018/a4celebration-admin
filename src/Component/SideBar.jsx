import React, { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import './sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignCenter,faAngleRight,faExpand  } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <div className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <SidebarHeader 
          collapsed={collapsed} 
          toggleCollapse={toggleCollapse} 
        />
        <SidebarMenu collapsed={collapsed} />
      </div>
      <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>        
          <div className="toggle-sidebar">
            <button className="status_toggle middle sidebar-toggle">
              <FontAwesomeIcon icon={faAlignCenter} />
            </button>
          </div>
      </div>
    </>
  );
}

export default Sidebar;