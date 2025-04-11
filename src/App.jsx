import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home";
import Cart from "./Pages/Cart";
import Navbar from "./Components/Navbar";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Billing from "./Pages/Billing";
import OrderHistory from "./Pages/OrderHistory";
function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/billing" element={<Billing />} />
        <Route path="/orders" element={<OrderHistory/>}/>

      </Routes>
    </Router>
  );
}

export default App;
