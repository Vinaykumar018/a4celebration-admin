import React,{useState,useEffect} from 'react';
import Clock from './Clock';
import CommissionSettings from './CommissionSettings';
import TargetAudienceSettings from './TargetAudienceSettings';
import NewUserTable from './NewUserTable';
import NewVendorTable from './NewVendorTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPanditRange, createPanditRange, updatePanditRange } from '../../Services/settingsService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUsers, 
  faChartLine, 
  faFileInvoiceDollar,
  faArrowUp,
  faBook,
  faMapMarkerAlt,
  faClock,
  faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  


 
  return (
    <>
    <ToastContainer/>
      <div className="container default-dashboard gap-4 mb-4">
        <div className="grid grid-cols-12 gap-4 widget-grid">
         <div className="col-span-12">
            <div className="card profile-box h-full">
              <div className="card-body flex flex-col h-full">
                <div className="flex media-wrapper justify-between">
                  <div className="grow">
                    <div className="greeting-user">
                      <h2 className="font-semibold">Welcome to a4-Celeberation Admin Panel</h2>
                      <p>Here's what's happening in your account today</p>
                      <div className="whatsnew-btn"></div>
                    </div>
                  </div>
                  <div>
                    <Clock />
                  </div>
                </div>
                <div className="cartoon mt-auto">
                  <img 
                    className="max-w-full h-auto" 
                    src="https://admin.pixelstrap.net/cuba_tailwind/assets/images/dashboard/cartoon.svg" 
                    alt="vector women with laptop" 
                  />
                </div>
              </div>
            </div>
          </div>
         
        </div>

      <div>
        <img src="https://static.vecteezy.com/system/resources/previews/035/823/164/non_2x/new-website-click-button-stay-tuned-level-sign-speech-bubble-banner-vector.jpg" alt="" />
      </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Dashboard;