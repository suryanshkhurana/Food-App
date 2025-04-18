import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

export default function Navbar({ setSearchTerm }) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { cartItems } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  const cartCount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && open) {
        setOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
      setOpen(false);
    } else {
      // Handle logout error if needed
      console.error(result.error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchTerm(value); // Update the parent component's search term
  };

  // Handle form submission to prevent page refresh
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchValue);
    setOpen(false); // Close mobile menu after search
    // If you want to navigate to a specific search results page, you could do:
    // navigate(`/search?q=${encodeURIComponent(searchValue)}`);
  };

  // Close mobile menu after a menu item is clicked
  const handleMenuItemClick = () => {
    setOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-3 md:px-16 lg:px-24 xl:px-30 border-b border-gray-300 bg-white relative transition-all sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-xl font-bold text-red-500">FoodBite</span>
        <img
          className="h-20"
          src="https://media.istockphoto.com/id/1435983029/vector/food-delivery-logo-images.jpg?s=612x612&w=0&k=20&c=HXPxcjOxUiW4pMW1u9E0k2dJYQOU37a_0qZAy3so8fY="
          alt="FoodBite Logo"
        />
      </Link>

      <div className="hidden sm:flex items-center gap-8">
        <Link to="/">Home</Link>
        <Link to="/orders">Past Orders</Link>
        <Link to="/contact">Contact</Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <button type="submit" aria-label="Search" className="text-gray-500 hover:text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        {/* 🛒 Cart Icon */}
        <Link to="/cart" className="relative cursor-pointer">
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Conditional Login/Logout Button */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Hi, {user.fullname}</span>
            <button 
              onClick={handleLogout} 
              className="cursor-pointer px-8 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-full"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            width="21"
            height="15"
            viewBox="0 0 21 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="21" height="1.5" rx=".75" fill="#426287" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
            <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Links - Now with auto-close feature */}
      <div
        ref={mobileMenuRef}
        className={`${
          open ? "flex" : "hidden"
        } absolute top-full left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-3 px-5 text-sm md:hidden transition-all duration-300 ease-in-out`}
      >
        <Link to="/" className="block w-full py-2 hover:bg-gray-100 px-2 rounded" onClick={handleMenuItemClick}>
          Home
        </Link>
        <Link to="/orders" className="block w-full py-2 hover:bg-gray-100 px-2 rounded" onClick={handleMenuItemClick}>
          Past Orders
        </Link>
        <Link to="/contact" className="block w-full py-2 hover:bg-gray-100 px-2 rounded" onClick={handleMenuItemClick}>
          Contact
        </Link>
        
        {/* Improved Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2 border border-gray-300 px-3 rounded-full my-2">
          <input
            className="py-2 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <button type="submit" aria-label="Search" className="text-gray-500 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
        
        <Link to="/cart" className="block w-full py-2 hover:bg-gray-100 px-2 rounded text-indigo-500 font-medium flex items-center gap-2" onClick={handleMenuItemClick}>
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="text-xs text-white bg-indigo-500 w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        
        {/* Mobile Login/Logout Button */}
        {isAuthenticated ? (
          <div className="flex flex-col w-full gap-2">
            <span className="text-sm font-medium px-2">Hi, {user.fullname}</span>
            <button 
              onClick={handleLogout} 
              className="cursor-pointer px-6 py-2 mt-1 bg-red-500 hover:bg-red-600 transition text-white rounded-full text-sm w-full"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="cursor-pointer px-6 py-2 mt-1 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm w-full text-center" onClick={handleMenuItemClick}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}