import React from 'react';

function SidebarHeader() {
  return (
    <>
      <div className="logo-wrapper">
        <a href="index.html">
          <img className="" src="/src/assets/images/logo6.png" alt="Logo" style={{width: "100% !important",height: "50px"}}/>
          <img className="max-w-full h-auto for-dark" src="/src/assets/images/logo6.png" alt="Dark Logo"/>
        </a>
        <div className="back-btn">
        <i className='fas fa-faAngleLeft status_toggle middle sidebar-toggle'></i> 

        </div>
      </div>
      <div className="logo-icon-wrapper">
        <a href="index.html">
          <img className="max-w-full h-auto" src="../assets/images/logo6.png" alt="Icon Logo"/>
        </a>
      </div>
    </>
  );
}

export default SidebarHeader;