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
  const [range, setRange] = useState(3);
  const [rangeId, setRangeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialRangeLoaded, setInitialRangeLoaded] = useState(false);

  useEffect(() => {
    fetchCurrentRange();
  }, []);

  const fetchCurrentRange = async () => {
    try {
      setLoading(true);
      const response = await getPanditRange();
        if (response.data['0']) {
        if (response.data['0'].range) {
          setRange(response.data['0'].range);
          setRangeId(response.data['0']._id);
        }
        setInitialRangeLoaded(true);
      }
    } catch (error) {
      toast.error('Failed to fetch current range');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRangeUpdate = async () => {
    if (!range || isNaN(range)) {
      toast.error('Please enter a valid distance');
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (rangeId) {
        // Only update if range exists
        response = await updatePanditRange(rangeId, range);
        toast.success('Range updated successfully');
        setRange(response.data.range);
      } else {
        toast.error('No existing range found to update');
      }
    } catch (error) {
      toast.error('Failed to update range');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <ToastContainer/>
      <div className="container default-dashboard gap-4 mb-4">
        <div className="grid grid-cols-12 gap-4 widget-grid">
          {/* Welcome Card with Clock */}
          <div className="col-span-4 xxl:col-span-6 sm:col-span-12">
            <div className="card profile-box h-full">
              <div className="card-body flex flex-col h-full">
                <div className="flex media-wrapper justify-between">
                  <div className="grow">
                    <div className="greeting-user">
                      <h2 className="font-semibold">Welcome Vaidic Sanskar!</h2>
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

          {/* Metrics Widgets */}
          <div className="col-span-5 xxl:col-span-6 xl:col-span-12">
            <div className="grid grid-cols-12 gap-4 h-full">
              {/* New Orders */}
              <div className="col-span-6 sm:col-span-12">
                <div className="card widget-1 h-full">
                  <div className="card-body h-full">
                    <div className="widget-content">
                      <div className="widget-round secondary">
                        <div className="bg-round">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-dark" size="lg" />

                        </div>
                      </div>
                      <div>
                        <h4><span className="counter">3,243</span></h4>
                        <span className="f-light">Pooja Booking</span>
                      </div>
                    </div>
                    <div className="font-success font-medium">
                      <i className="bookmark-search me-1" data-feather="trending-up"></i>
                      <span className="txt-success">+12.5%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customers */}
              <div className="col-span-6 sm:col-span-12">
                <div className="card widget-1 h-full">
                  <div className="card-body h-full">
                    <div className="widget-content">
                      <div className="widget-round success">
                        <div className="bg-round">
                        <FontAwesomeIcon icon={faUsers} className="text-dark" size="lg" />

                        </div>
                      </div>
                      <div>
                        <h4><span className="counter">15.07k</span></h4>
                        <span className="f-light">Total Order</span>
                      </div>
                    </div>
                    <div className="font-success font-medium">
                      <i className="bookmark-search me-1" data-feather="trending-up"></i>
                      <span className="txt-success">+9.23%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Resolved */}
              <div className="col-span-6 sm:col-span-12">
                <div className="card widget-1 h-full">
                  <div className="card-body h-full">
                    <div className="widget-content">
                      <div className="widget-round warning">
                        <div className="bg-round">
                        <FontAwesomeIcon icon={faChartLine} className="text-dark" size="lg" />

                        </div>
                      </div>
                      <div>
                        <h4><span className="counter">57B</span></h4>
                        <span className="f-light">Total User</span>
                      </div>
                    </div>
                    <div className="font-success font-medium">
                      <i className="bookmark-search me-1" data-feather="trending-up"></i>
                      <span className="txt-success">+10%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Today */}
              <div className="col-span-6 sm:col-span-12">
                <div className="card widget-1 h-full">
                  <div className="card-body h-full">
                    <div className="widget-content">
                      <div className="widget-round primary">
                        <div className="bg-round">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-dark" size="lg" />

                        </div>
                      </div>
                      <div>
                        <h4><span className="counter">11.61k</span></h4>
                        <span className="f-light">Customer</span>
                      </div>
                    </div>
                    <div className="font-success font-medium">
                      <i className="bookmark-search me-1" data-feather="trending-up"></i>
                      <span className="txt-success">+2.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pandit Request Range */}
          <div className="col-span-3 xxl:col-span-4 xl:col-span-6 sm:col-span-12">
          <div className="card shadow-lg h-full">
            <div className="card-header p-3">
              <h5 className="text-uppercase text-center">PANDIT REQUEST RANGE</h5>
            </div>
            <div className="card-body flex flex-col h-full">
              <div className="mb-4">
                <h5 className="form-label fw-bold">Current Range: {range} km</h5>
                {initialRangeLoaded && !rangeId && (
                  <div className="alert alert-warning">
                    No range configuration found. Please contact admin to set initial range.
                  </div>
                )}
                <label className="form-label fw-bold mt-4">Distance (in km)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Enter distance" 
                  value={range}
                  onChange={(e) => setRange(parseInt(e.target.value) || 0)}
                  min="1"
                  disabled={!rangeId} // Disable input if no range exists
                />
              </div>
              <div className="text-center mt-auto">
                <button 
                  className="btn btn-success text-white btn-md px-4"
                  onClick={handleRangeUpdate}
                  disabled={loading || !rangeId} // Disable button if no range exists
                >
                  {loading ? 'Processing...' : 'UPDATE RANGE'}
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className="grid grid-cols-12 gap-4 widget-grid mt-5 mb-5">
          <div className="col-span-4">
            <CommissionSettings />
          </div>

          {/* Target Audience Settings */}
          <div className="col-span-4">
            <TargetAudienceSettings />
          </div>
          
          <div className="col-span-4 grid grid-cols-12 gap-4">
            {/* Total Categories */}
            <div className="col-span-12 sm:col-span-6">
              <div className="card h-full">
                <div className="card-body">
                  <h4 className="text-lg font-semibold">Total Categories</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold">10</span>
                    <span className="text-sm text-gray-500">0%</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm">1234 Booking Count</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Range */}
            <div className="col-span-12 sm:col-span-6">
              <div className="card h-full">
                <div className="card-body">
                  <h4 className="text-lg font-semibold">Location Range</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold">50km</span>
                    <span className="text-sm text-gray-500">10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="col-span-12 sm:col-span-6">
              <div className="card h-full">
                <div className="card-body">
                  <h4 className="text-lg font-semibold">Pending Orders</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold">78</span>
                    <span className="text-sm text-gray-500">16%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 widget-grid mt-5 mb-5">
          <div className="col-span-6 xl:col-span-6 md:col-span-12 ord-xl-4 ord-md-7 box-ord-4 ord-custom-6">
            <NewUserTable />
          </div>
          
          <div className="col-span-6 xxl:col-span-8 lg:col-span-12 ord-xl-6 ord-md-8 box-ord-6 box-col-8e ord-custom-7">
            <NewVendorTable />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Dashboard;