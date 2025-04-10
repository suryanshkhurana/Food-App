import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "./store/cartStore";

export default function Navbar({ setSearchTerm }) {
  const [open, setOpen] = React.useState(false);
  const { cartItems } = useCartStore();

  const cartCount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <nav className="flex items-center justify-between px-3 md:px-16 lg:px-24 xl:px-30 border-b border-gray-300 bg-white relative transition-all">
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
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
            <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Login Button */}
        <button className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
          Login
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden"
      >
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
      </button>

      {/* Mobile Menu Links */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
      >
        <Link to="/" className="block">
          Home
        </Link>
        <Link to="/about" className="block">
          About
        </Link>
        <Link to="/contact" className="block">
          Contact
        </Link>
        <Link to="/cart" className="block text-indigo-500 font-medium">
          Cart ({cartCount})
        </Link>
        <button className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
          Login
        </button>
      </div>
    </nav>
  );
}
