import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPanditByID } from '../../Services/panditApiService';
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTransgender,
  FaBirthdayCake,
  FaIdCard,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaMapPin,
  FaMoneyBillAlt,
  FaBriefcase,
  FaUniversity,
  FaBook,
  FaInfoCircle,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaList,
  FaBox
} from 'react-icons/fa';
import GetTable from '../../Component/GetTable';

const PanditProfileData = () => {
  const IMGURL = 'https://a4celebration.com/api/uploads/panditImages/';
  const { id } = useParams();
  const [panditProfileData, setPanditProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPanditByID(id);
      setPanditProfileData(data.data);
    };
    fetchData();
  }, [id]);

  if (!panditProfileData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const bookingData = [
    {
      id: 1,
      bookingName: "Wedding Ceremony",
      bookingCategory: "Religious Event",
      price: "₹10,000",
      bookingItems: "Puja Samagri, Flowers, Prasad",
      bookingDay: "15th October 2023",
      bookingTime: "10:00 AM - 12:00 PM",
    },
    {
      id: 2,
      bookingName: "Housewarming Ceremony",
      bookingCategory: "Religious Event",
      price: "₹7,000",
      bookingItems: "Puja Samagri, Fruits, Prasad",
      bookingDay: "20th October 2023",
      bookingTime: "9:00 AM - 11:00 AM",
    },
    {
      id: 3,
      bookingName: "Baby Naming Ceremony",
      bookingCategory: "Cultural Event",
      price: "₹5,000",
      bookingItems: "Puja Samagri, Sweets, Prasad",
      bookingDay: "25th October 2023",
      bookingTime: "2:00 PM - 4:00 PM",
    },
  ];

  const bookingColumns = [
    {
      name: "Booking Name",
      selector: (row) => row.bookingName,
      sortable: true,
    },
    {
      name: "Booking Category",
      selector: (row) => row.bookingCategory,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Booking Items",
      selector: (row) => row.bookingItems,
      sortable: true,
    },
    {
      name: "Booking Day",
      selector: (row) => row.bookingDay,
      sortable: true,
    },
    {
      name: "Booking Time",
      selector: (row) => row.bookingTime,
      sortable: true,
    },
  ];

  return (
    <div className="container-fluid mb-2">
      <div className="card">
        <div className="card-header pb-2 pt-4 card-border">
          <div className="common-flex justify-between items-center">
            <h4 className="text-left text-primary mb-0">Pandit Profile</h4>
            <Link to={"/pandit/update-pandit/" + id} className='btn btn-info'>Edit</Link>
          </div>
        </div>

        <div className="card-body">
          {/* Top Section - Pandit Profile and Personal Info */}
          <div className="common-flex flex-wrap gap-6 mb-6">
            {/* Pandit Profile Section - Centered */}
            <div className="flex bg-white rounded-lg shadow p-5">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <img
                    src={IMGURL + panditProfileData?.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/813px-Unknown_person.jpg"}
                    alt="Pandit Profile"
                    className="rounded-full border object-cover mx-auto"
                    style={{ height: '100px', width: '100px' }}
                  />
                </div>

                <h5 className="font-semibold text-lg mb-2">
                  {panditProfileData?.username}
                </h5>

                <div className="space-y-2">
                  <p className="flex items-center justify-center text-gray-700">
                    <FaPhone className="mr-2 text-gray-500" />
                    {panditProfileData?.mobile}
                  </p>
                  <p className="flex items-center justify-center text-gray-700">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    {panditProfileData?.email}
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 mt-1">
                    <FaBook className="text-gray-500" />
                  </span>
                  <div className="flex">
                    <p className="text-sm font-medium text-gray-500">Skills:&nbsp;</p>
                    <p className="text-gray-900">{panditProfileData?.skills}</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-4">
                  <div className="common-flex flex-col items-center">
                    <span className="font-medium mb-1">Status</span>
                    <span
                      className={`px-2 py-1 badge rounded-pill cursor-pointer text-sm font-medium ${panditProfileData?.status === 'active'
                        ? 'bg-success text-white'
                        : 'bg-danger text-white'
                        }`}
                    >
                      {panditProfileData?.status}
                    </span>
                  </div>
                  <div className="common-flex flex-col items-center">
                    <span className="font-medium mb-1">Approved</span>
                    <span
                      className={`px-2 py-1 badge rounded-pill cursor-pointer text-sm font-medium ${panditProfileData?.approved
                        ? 'bg-success text-white'
                        : 'bg-danger text-white'
                        }`}
                    >
                      {panditProfileData?.approved ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="flex-1 bg-white rounded-lg shadow p-5">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'personal'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-500'
                    }`}
                  onClick={() => setActiveTab('personal')}
                >
                  <FaUser className="inline mr-1" /> Personal
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'address'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-500'
                    }`}
                  onClick={() => setActiveTab('address')}
                >
                  <FaMapMarkerAlt className="inline mr-1" /> Address
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'professional'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-500'
                    }`}
                  onClick={() => setActiveTab('professional')}
                >
                  <FaBriefcase className="inline mr-1" /> Professional
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'bank'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-500'
                    }`}
                  onClick={() => setActiveTab('bank')}
                >
                  <FaMoneyBillAlt className="inline mr-1" /> Bank
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'personal' && (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaTransgender className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Gender:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaBirthdayCake className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Date of Birth:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.dob?.split('T')[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaIdCard className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Aadhar No:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.aadhar_no || 'Not Provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaPhone className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Alternate No:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.alternate_no || 'Not Provided'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'address' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaMapMarkerAlt className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Address:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaCity className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">City:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.city}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaGlobe className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">State:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.state}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaGlobe className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Country:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.country}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaMapPin className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Pincode:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.pincode}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'professional' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaBook className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Skills:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.skills}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaUniversity className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Degree:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.degree}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaBriefcase className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Experience:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.experience} years</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaInfoCircle className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Type:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaInfoCircle className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Bio:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.bio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'bank' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaBuilding className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Bank Name:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.bank_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaIdCard className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Account Holder:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.acc_holder_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaMoneyBillAlt className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">Account Number:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.bank_ac_no}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaInfoCircle className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">IFSC Code:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.ifsc_code}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">
                        <FaIdCard className="text-gray-500" />
                      </span>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-500">PAN Card No:&nbsp;</p>
                        <p className="text-gray-900">{panditProfileData?.pancard_no}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Booking Table */}
          <div className="bg-white rounded-lg p-5">
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-primary mr-2" />
              <h5 className="text-primary mb-0">Booking Details</h5>
            </div>
            <GetTable
              columns={bookingColumns}
              data={bookingData}
              pagination={true}
              selectableRows={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanditProfileData;