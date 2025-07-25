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
import Users from './Pages/Users/Users';
import OrderDetails from './Pages/orders/OrderDetails';
import GetCustomizedRequest from './Pages/customized-event/get-customized-request';
import ViewDecorations from './Pages/decorations/view-decorations';
import GiftPreview from './Pages/giftings/view-gift';
import EventPreview from './Pages/event-management/view-events';
import CategoryPreview from './Pages/Categories/view-categories';
import Transaction from './Pages/Transaction/Transaction';
import Coupons from './Pages/Coupons/Coupons';
import Contact from './Pages/Contact/Contact';

function WebRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/" element={<Dashboard/>} />


      
      <Route path="/create/create-category" element={<CreateCategories/>}/>
      <Route path="/get/get-category-list" element={<GetCategories/>}/>
      <Route path="/view/view-category-list/:id" element={<CategoryPreview></CategoryPreview>}/>
      <Route path="/update/update-category-list/:id" element={<UpdateCategories/>}/>



      <Route path="/create/create-decoration" element={<CreateDecorations/>}/>
      <Route path="/get/get-decoration" element={<GetDecorations/>}/>
      <Route path="/view/view-decoration-list/:id" element={<ViewDecorations></ViewDecorations>}/>
      <Route path="/update/update-product-list/:id" element={<UpdateDecorations/>}/>
       <Route path="/decoration/orders" element={<DecorationOrders></DecorationOrders>}/>



       <Route path="/create/create-gift" element={
        <CreateGifts></CreateGifts>
       }/>
        <Route path="/get/get-gifts" element={<GetGifts></GetGifts>}/>
      <Route path="/update/update-gift-list/:id" element={<UpdateGifts></UpdateGifts>}/>
        <Route path="/view/view-gift-list/:id" element={<GiftPreview></GiftPreview>}/>
       <Route path="/gift/orders" element={<GiftOrders/>}/>


        <Route path="/orders" element={<Orders/>}/>
         <Route path="/orders/:orderID" element={<OrderDetails/>}/>

        <Route path="/get/get-events" element={<GetEvents></GetEvents>}/>
        <Route path="/create/create-event" element={
        <CreateEvents></CreateEvents>
       }/>
       <Route path="/view/view-event-list/:id" element={<EventPreview></EventPreview>}/>
      <Route path="/event/update-event-list/:id" element={<UpdateEvents></UpdateEvents>}/>
       <Route path="/event/requests" element={<GiftOrders/>}/>


       <Route path='/get/get-custom-events' element={<UpdateEvents></UpdateEvents>}/>
  <Route path="/event/get-custom-requests" element={<AllCustomizedRequests/>}/>
  <Route path="/event/get-custom-requests/:id" element={<GetCustomizedRequest></GetCustomizedRequest>}/>
  <Route path="/event/get-custom-requests/update/:id" element={<AllCustomizedRequests/>}/>

   <Route path="/users" element={<Users></Users>}/>

<Route path="/coupons" element={<Coupons/>}/>
   <Route path="/transactions" element={<Transaction/>}/>
   <Route path="/contacts" element={<Contact></Contact>}/>




     
    </Routes>
  );
}

export default WebRoutes;