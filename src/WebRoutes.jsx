import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';
import Login from './Pages/Authentication/Login';

import CreateCategories from './Pages/Categories/create-categories';
import GetCategories from './Pages/Categories/get-categories';
import UpdateCategories from './Pages/Categories/update-categories';
import CreateDecorations from './Pages/decorations/create-decorations';
import GetDecorations from './Pages/decorations/get-decorations';
import UpdateDecorations from './Pages/decorations/update-decorations';
import Orders from './Pages/orders/Orders';
import CreateGifts from './Pages/giftings/create-gift';
import GetGifts from './Pages/giftings/get-all-gifts';
import UpdateGifts from './Pages/giftings/update-gift';
import DecorationOrders from './Pages/decoration-orders/DecorationOrders';
import GiftOrders from './Pages/gifting-orders/GiftOrders';
import GetEvents from './Pages/event-management/get-events';
import CreateEvents from './Pages/event-management/create-event';
import UpdateEvents from './Pages/event-management/update-events';
import AllCustomizedRequests from './Pages/customized-event/all-customized-requests';

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
       <Route path="/decoration/orders" element={<DecorationOrders></DecorationOrders>}/>



       <Route path="/create/create-gift" element={
        <CreateGifts></CreateGifts>
       }/>
        <Route path="/get/get-gifts" element={<GetGifts></GetGifts>}/>
      <Route path="/update/update-gift-list/:id" element={<UpdateGifts></UpdateGifts>}/>
       <Route path="/gift/orders" element={<GiftOrders/>}/>


        <Route path="/orders" element={<Orders/>}/>

        <Route path="/get/get-events" element={<GetEvents></GetEvents>}/>
        <Route path="/create/create-event" element={
        <CreateEvents></CreateEvents>
       }/>
      <Route path="/event/update-event-list/:id" element={<UpdateEvents></UpdateEvents>}/>
       <Route path="/event/requests" element={<GiftOrders/>}/>


       <Route path='/get/get-custom-events' element={<UpdateEvents></UpdateEvents>}/>
  <Route path="/event/get-custom-requests" element={<AllCustomizedRequests/>}/>
  <Route path="/event/get-custom-requests/:id" element={<AllCustomizedRequests/>}/>
  <Route path="/event/get-custom-requests/update/:id" element={<AllCustomizedRequests/>}/>



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