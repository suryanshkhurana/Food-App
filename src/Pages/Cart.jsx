import React, { useState } from "react";
import { useCartStore } from "../store/cartStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useAuthStore } from "../store/authStore";
import { QRCodeSVG } from 'qrcode.react';
import {  Wallet, QrCode, Loader2 } from 'lucide-react';
import api from "../services/api";

export default function Cart() {
  const { cartItems, incrementItem, decrementItem, clearCart } = useCartStore();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const items = Object.values(cartItems);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = total * 0.02;
  const finalAmount = (total + tax).toFixed(2);
  const upiId = import.meta.env.VITE_UPI_ID;
const name = import.meta.env.VITE_UPI_NAME;
const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${finalAmount}&cu=INR`;


  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please enter delivery address");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        "/orders",
        {
          address,
          items: items.map(({ itemID, itemName, price, quantity, image }) => ({
            itemID, itemName, price, quantity, image
          })),
          paymentMethod
        },
        { withCredentials: true }
      );

      const order = response.data.order;
      const userEmail = user?.email || "fallback@example.com";
      
      // Email template HTML
      const itemsHTML = order.items
        .map(item => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee">${item.itemName}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee">₹${item.price}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee">₹${item.price * item.quantity}</td>
          </tr>
        `).join('');

      const templateParams = {
        order_id: order._id,
        email: userEmail,
        address: order.address,
        total: order.totalAmount.toFixed(2),
        tax: ((order.totalAmount / 1.02) * 0.02).toFixed(2),
        items_html: itemsHTML,
        payment_method: paymentMethod
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      clearCart();
      setAddress("");
      navigate("/billing", { state: { order } });
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-gray-600">
        <div className="w-24 h-24 mb-4 text-gray-400">🛒</div>
        <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500">Add some delicious items to get started!</p>
      </div>
    );
  }

  const PaymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <QrCode className="w-5 h-5" />,
      description: 'Pay using any UPI app'
    },
    
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Wallet className="w-5 h-5" />,
      description: 'Pay when you receive'
    }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 py-16 max-w-7xl w-full px-6 mx-auto">
      <div className="flex-1">
        <h1 className="text-3xl font-medium mb-8">
          Shopping Cart <span className="text-sm text-indigo-500">({items.length} Items)</span>
        </h1>

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.itemID} 
                 className="flex gap-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                <img 
                  className="w-full h-full object-cover"
                  src={item.image || "https://via.placeholder.com/100"} 
                  alt={item.itemName}
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.itemName}</h3>
                <p className="text-gray-500 text-sm mt-1">₹{item.price} each</p>
                
                <div className="flex items-center mt-4 gap-4">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => decrementItem(item.itemID)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 border-x">{item.quantity}</span>
                    <button
                      onClick={() => incrementItem(item.itemID)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={clearCart}
          className="mt-6 text-red-500 font-medium hover:text-red-600"
        >
          Clear Cart
        </button>
      </div>

      <div className="md:w-[400px] w-full">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-medium mb-6">Order Summary</h2>
          
          <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (2%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-200 my-4"></div>
            <div className="flex justify-between text-lg font-medium text-gray-900">
              <span>Total</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
              placeholder="Enter your complete delivery address"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="space-y-3">
              {PaymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-3 border rounded-lg cursor-pointer transition-colors
                    ${paymentMethod === method.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setShowQR(e.target.value === 'upi');
                    }}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {method.icon}
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {showQR && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="mb-4 font-medium">Scan QR to pay ₹{finalAmount}</p>
              <div className="bg-white p-4 inline-block rounded-lg">
                <QRCodeSVG value={upiUrl} size={200} />
              </div>
              <button
                onClick={() => setPaymentConfirmed(true)}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Confirm Payment
              </button>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={loading || (paymentMethod === 'upi' && !paymentConfirmed)}
            className={`w-full mt-6 py-3 rounded-md text-white font-medium transition-colors
              ${loading || (paymentMethod === 'upi' && !paymentConfirmed)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </span>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}