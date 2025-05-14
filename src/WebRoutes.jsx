import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';
import Login from './Pages/Authentication/Login';
import ParamarshCategory from './Pages/Paramarsh/ParamarshCategory';
import ParamarshRequest from './Pages/Paramarsh/ParamarshRequest';
import User from './Pages/User/User';
import UserEdit from './Pages/User/UserEdit';
import AddUser from './Pages/User/AddUser';
import Pandit from './Pages/Pandit/Pandit';

import BhajanCategory from './Pages/BhajanMandal/BhajanCategory';
import BrahmanBhoj from './Pages/BrahmanBhoj/BrahmanBhoj';
import ProductCategory from './Pages/ECommerce/ProductCategory';
import StoryCategory from './Pages/Story/StoryCategory';

import AddBhajanMandal from './Pages/BhajanMandal/AddBhajanMandal';
import MandaliList from './Pages/BhajanMandal/MandaliList';
import BhajanMandaliEdit from './Pages/BhajanMandal/BhajanMandaliEdit';
import MandaliBooking from './Pages/BhajanMandal/MandaliBooking';
import ProductList from './Pages/ECommerce/ProductList';
import OrderList from './Pages/ECommerce/OrderList';
import UserView from './Pages/User/UserView';
import PanditProfileData from './Pages/Pandit/PanditProfileData';
import AddPandit from './Pages/Pandit/AddPandit';
import UpdatePandit from './Pages/Pandit/UpdatePandit';
import UserBookingList from './Pages/User/UserBookingList';
import ProductAdd from './Pages/ECommerce/ProductAdd';
import EditProduct from './Pages/ECommerce/EditProduct';
import SingleOderDetails from './Pages/ECommerce/SingleOderDetails';
import Story from './Pages/Story/Story';
import ViewStory from './Pages/Story/ViewStory';
import EditStory from './Pages/Story/EditStory';
import AddStory from './Pages/Story/AddStory';
import SliderCategoryList from './Pages/Slider/SliderCategoryList';
import Slider from './Pages/Slider/Slider';
import Kundali from './Pages/Kundali/Kundali';
import KundaliMatching from './Pages/Kundali/KundaliMatching';
import CreateCategories from './Pages/Categories/create-categories';
import GetCategories from './Pages/Categories/get-categories';
import UpdateCategories from './Pages/Categories/update-categories';
import CreateDecorations from './Pages/decorations/create-decorations';
import GetDecorations from './Pages/decorations/get-decorations';
import UpdateDecorations from './Pages/decorations/update-decorations';
import Orders from './Pages/orders/Orders';

function WebRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/" element={<Dashboard/>} />


      
      <Route path="/create/create-category" element={<CreateCategories/>}/>
      <Route path="/get/get-category-list" element={<GetCategories/>}/>
      <Route path="/update/update-category-list/:id" element={<UpdateCategories/>}/>



      <Route path="/create/create-decoration" element={<CreateDecorations/>}/>
      <Route path="/get/get-decoration" element={<GetDecorations/>}/>
      <Route path="/update/update-product-list/:id" element={<UpdateDecorations/>}/>



       <Route path="/orders" element={<Orders/>}/>



      {/* <Route path="/paramarsh/category" element={<ParamarshCategory/>}/>
      <Route path="/paramarsh/paramarsh-request" element={<ParamarshRequest/>}/>
      <Route path="/user" element={<User/>}/>
      <Route path="/user/update-user/:id" element={<UserEdit/>}/>
      <Route path="/user/add-user" element={<AddUser/>}/>
      <Route path="/user/:id" element={<UserView/>}/>
      <Route path="/user/bookings/:id" element={<UserBookingList/>}/>
      <Route path="/pandit" element={<Pandit/>}/>
      <Route path="/pandit/:id" element={<PanditProfileData/>}/>
      <Route path="/pandit/update-pandit/:id" element={<UpdatePandit/>}/>
      <Route path="/pandit/add-pandit" element={<AddPandit/>}/>
     
      <Route path="/pooja/add-pooja" element={<AddPooja/>}/>
      <Route path="/pooja/edit-pooja/:id" element={<EditPooja/>}/> */}
     
    
      {/* <Route path="/bhajan-mandal/edit/:id" element={<BhajanMandaliEdit/>}/>
      <Route path="/bhajan/add-mandali" element={<AddBhajanMandal/>}/>
      <Route path="/bhajan/mandali" element={<MandaliList/>}/>
      <Route path="/bhajan/bhajan-booking" element={<MandaliBooking/>}/>
      <Route path="/e-commerce/product" element={<ProductList/>}/>
      <Route path="/e-commerce/order" element={<OrderList/>}/>
      <Route path="/product/update-product/:id" element={<EditProduct/>}/>
      <Route path="/order-details/:id" element={<SingleOderDetails/>}/>
      <Route path="/story/view/:id" element={<ViewStory/>}/>
      <Route path="/story/edit/:id" element={<EditStory/>}/>
      <Route path="/story/add-story" element={<AddStory/>}/>
      <Route path="/slider/slider-category" element={<SliderCategoryList/>}/>
      <Route path="/slider/slider" element={<Slider/>}/>
      <Route path="/kundali/kundali-making" element={<Kundali/>}/>
      <Route path="/kundali/kundali-matching" element={<KundaliMatching/>}/>
      <Route path="/bhajan/bhajan-category" element={<BhajanCategory/>}/>
      <Route path="brahman-bhoj/request" element={<BrahmanBhoj/>}/>
      <Route path="/e-commerce/product-category" element={<ProductCategory/>}/>
      <Route path="/e-commerce/add-product" element={<ProductAdd/>}/>
      <Route path='/story/story-category' element={<StoryCategory/>}/>
      <Route path='/story' element={<Story/>}/> */}
      {/* Add more protected routes here */}
    </Routes>
  );
}

export default WebRoutes;