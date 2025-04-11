import React, { useState } from "react";
import { useCartStore } from "../store/cartStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cartItems, incrementItem, decrementItem, clearCart } = useCartStore();
  const [address, setAddress] = useState("");
  const navigate = useNavigate();


  const items = Object.values(cartItems);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        <h2 className="text-xl font-semibold mb-2">Your Cart is Empty 🛒</h2>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/orders", {
        address,
        items: items.map(({ itemID, itemName, price, quantity }) => ({ itemID, itemName, price, quantity })),
      }, {
        withCredentials: true
      });
  
      clearCart();
      setAddress("");
  
      navigate("/billing", { state: { order: response.data.order } });
  
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      {/* Left - Cart Items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart <span className="text-sm text-indigo-500">{items.length} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {items.map((item) => (
          <div key={item.itemID} className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base font-medium pt-3">
            <div className="flex items-center md:gap-6 gap-3">
              <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                <img className="max-w-full h-full object-cover" src={item.image || "https://via.placeholder.com/100"} alt={item.itemName} />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{item.itemName}</p>
                <p className="text-gray-500 text-sm">₹{item.price} each</p>
                <div className="flex items-center mt-1 gap-2">
                  <p>Qty:</p>
                  <select
                    className="outline-none border border-gray-300 px-1 py-0.5"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQty = Number(e.target.value);
                      if (newQty > item.quantity) {
                        incrementItem(item.itemID);
                      } else {
                        decrementItem(item.itemID);
                      }
                    }}
                  >
                    {Array(5).fill('').map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <p className="text-center">₹{item.price * item.quantity}</p>
            <button
              onClick={() => decrementItem(item.itemID)}
              className="cursor-pointer mx-auto text-red-500"
              title="Remove one item"
            >
              🗑
            </button>
          </div>
        ))}

        <button onClick={clearCart} className="mt-8 text-red-500 font-medium hover:underline">
          Clear Cart
        </button>
      </div>

      {/* Right - Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span><span>₹{total}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span><span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span><span>₹{(total * 0.02).toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span><span>₹{(total * 1.02).toFixed(2)}</span>
          </p>
        </div>

        <div className="mb-6">
  <label className="block text-sm font-medium mb-1">Delivery Address</label>
  <textarea
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    className="w-full border border-gray-300 rounded p-2 outline-none resize-none"
    rows="3"
    placeholder="Enter your address"
  />
</div>

<button
  onClick={handlePlaceOrder}
  className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
>
  Place Order
</button>
      </div>
    </div>
  );
}
