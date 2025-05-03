import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByID } from '../../Services/userApiService';
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
} from 'react-icons/fa';
import GetTable from '../../Component/GetTable';

const UserView = () => {
  const { id } = useParams();
  const [userProfileData, setUserProfileData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserByID(id);
      setUserProfileData(data.data);
    };
    fetchData();
  }, [id]);

  if (!userProfileData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const bookingData = [
    {
      id: 1,
      bookingName: 'ShengGuoang',
      bookingCategory: 'ShengGuoang',
      price: '2024',
    },
    {
      id: 2,
      bookingName: 'HuanJiang Guotong',
      bookingCategory: 'HuanJiang Guotong',
      price: '2025',
    },
    {
      id: 3,
      bookingName: 'HuizhongXin Zhejiang',
      bookingCategory: 'HuizhongXin Zhejiang',
      price: '2026',
    },
    {
      id: 4,
      bookingName: 'Xiaoxi Zhai',
      bookingCategory: 'Xiaoxi Zhai',
      price: '2027',
    },
  ];

  const bookingColumns = [
    {
      name: 'Name',
      selector: (row) => row.bookingName,
      sortable: true,
    },
    {
      name: 'Number',
      selector: (row) => row.bookingCategory,
      sortable: true,
    },
    {
      name: 'Description',
      selector: (row) => row.price,
      sortable: true,
    },
  ];

  return (
    <div className="container-fluid mb-2">
      <div className="card">
        <div className="card-header pb-2 pt-4 card-border">
          <div className="common-flex justify-between items-center">
            <h4 className="text-left text-primary mb-0">User Profile</h4>
          </div>
        </div>

        <div className="card-body">
          {/* Top Section - User Profile and Personal Info */}
          <div className="common-flex flex-wrap gap-6 mb-6">
            {/* User Profile Section - Centered */}
            <div className="flex  bg-white rounded-lg shadow p-5">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <img
                    src={
                      userProfileData?.image ||
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/813px-Unknown_person.jpg'
                    }
                    alt="User Profile"
                    className="rounded-full border object-cover mx-auto"
                    style={{ height: '100px', width: '100px' }}
                  />
                </div>

                <h5 className="font-semibold text-lg mb-2">
                  {userProfileData?.username}
                </h5>
                
                <div className="space-y-2 mb-4">
                  <p className="flex items-center justify-center text-gray-700">
                    <FaPhone className="mr-2 text-gray-500" />
                    {userProfileData?.mobile}
                  </p>
                  <p className="flex items-center justify-center text-gray-700">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    {userProfileData?.email}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-4">
                  <div className="common-flex flex-col items-center">
                    <span className="font-medium mb-1">Status</span>
                    <span
                      className={`px-2 py-1 badge rounded-pill cursor-pointer  text-sm font-medium ${
                        userProfileData?.status === 'active'
                          ? 'bg-success  text-white'
                          : 'bg-danger text-white'
                      }`}
                    >
                      {userProfileData?.status}
                    </span>
                  </div>
                  <div className="common-flex flex-col items-center">
                    <span className="font-medium mb-1">Approved</span>
                    <span
                      className={`px-2 py-1 badge rounded-pill cursor-pointer text-sm font-medium ${
                        userProfileData?.approved
                            ? 'bg-success  text-white'
                          : 'bg-danger text-white'
                      }`}
                    >
                      {userProfileData?.approved ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="flex-1  bg-white rounded-lg shadow p-5">
              <div className="mb-4">
                <h5 className="font-semibold text-lg mb-3">
                  <FaUser className="inline mr-2 text-blue-500" />
                  Personal Information
                </h5>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="mr-3 mt-1">
                      <FaTransgender className="text-gray-500" />
                    </span>
                    <div className="flex">
                      <p className="text-sm font-medium text-gray-500">Gender:&nbsp;</p>
                      <p className="text-gray-900">{userProfileData?.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 mt-1">
                      <FaBirthdayCake className="text-gray-500" />
                    </span>
                    <div className="flex">
                      <p className="text-sm font-medium text-gray-500">Date of Birth:&nbsp;</p>
                      <p className="text-gray-900">{userProfileData?.dob?.split('T')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 mt-1">
                      <FaIdCard className="text-gray-500" />
                    </span>
                    <div className="flex">
                      <p className="text-sm font-medium text-gray-500">Aadhar No:&nbsp;</p>
                      <p className="text-gray-900">{userProfileData?.aadhar_no}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 mt-1">
                      <FaPhone className="text-gray-500" />
                    </span>
                    <div className="flex">
                      <p className="text-sm font-medium text-gray-500">Alternate No:&nbsp;</p>
                      <p className="text-gray-900">{userProfileData?.alternate_no}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h5 className="font-semibold text-lg mb-4">
                <FaMapMarkerAlt className="inline mr-2 text-blue-500" />
                Address Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex items-start">
                  <span className="mr-3 mt-1">
                    <FaMapMarkerAlt className="text-gray-500" />
                  </span>
                  <div className="flex">
                    <p className="text-sm font-medium text-gray-500">Address:&nbsp;</p>
                    <p className="text-gray-900">{userProfileData?.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 mt-1">
                    <FaMapMarkerAlt className="text-gray-500" />
                  </span>
                  <div className="flex">
                    <p className="text-sm font-medium text-gray-500">Landmark:&nbsp;</p>
                    <p className="text-gray-900">{userProfileData?.landmark}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 mt-1">
                    <FaCity className="text-gray-500" />
                  </span>
                  <div className="flex">
                    <p className="text-sm font-medium text-gray-500">City:&nbsp;</p>
                    <p className="text-gray-900">{userProfileData?.city}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 mt-1">
                    <FaGlobe className="text-gray-500" />
                  </span>
                  <div className="flex">
                    <p className="text-sm font-medium text-gray-500">State:&nbsp;</p>
                    <p className="text-gray-900">{userProfileData?.state}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 mt-1">
                    <FaGlobe className="text-gray-500" />
                  </span>
                  <div className="flex">
                    <p className="text-sm font-medium text-gray-500">Country:&nbsp;</p>
                    <p className="text-gray-900">{userProfileData?.country}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 mt-1">
                    <FaMapPin className="text-gray-500" />
                  </span>
                  <div className="flex">
                    <p className="text-sm font-medium text-gray-500">Pincode:&nbsp;</p>
                    <p className="text-gray-900">{userProfileData?.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details Section */}
          <div className="bg-white rounded-lg  p-5">
            <h5 className="font-semibold text-lg mb-4 pb-4">
              <FaMoneyBillAlt className="inline mr-2 text-blue-500" />
              Booking Details
            </h5>
            <GetTable columns={bookingColumns} data={bookingData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;