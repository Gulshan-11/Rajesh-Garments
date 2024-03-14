import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home/index";
import Admin from "./components/Admin";
import Products from "./components/Products";
import ProductItemDetails from "./components/ProductItemDetails";
import Cart from "./components/Cart";
import Signup from "./components/SignupForm";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import MyDetails from "./components/MyDetails";
import MyOrders from "./components/MyOrders";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminAllProducts from "./components/AdminAllProducts";
import AddProduct from "./components/AddProduct";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<LoginForm/>} />
        <Route exact path="/signup" element={<Signup/>} />
        <Route exact path="/" element={<ProtectedRoute>
          <Home/>
        </ProtectedRoute>} />
        <Route exact path="/orders" element={<AdminProtectedRoute><Admin/></AdminProtectedRoute>} />
        <Route exact path="/admin/all-products" element={<AdminProtectedRoute><AdminAllProducts/></AdminProtectedRoute>} />
        <Route exact path="/add-product" element={<AdminProtectedRoute><AddProduct/></AdminProtectedRoute>} />
        <Route exact path="/products" element={<ProtectedRoute><Products/></ProtectedRoute>} />
        <Route exact path="/products/:id" element={<ProtectedRoute><ProductItemDetails/></ProtectedRoute>} />
        <Route exact path="/myorders" element={<ProtectedRoute><MyOrders/></ProtectedRoute>} />
        <Route exact path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>} /> // protected
        <Route exact path="/mydetails" element={<ProtectedRoute><MyDetails/></ProtectedRoute>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
