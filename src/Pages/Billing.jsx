import React from "react";
import { useLocation } from "react-router-dom";

export default function Billing() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="p-4 text-center text-gray-600">
        <h2 className="text-xl font-semibold">No billing info available.</h2>
      </div>
    );
  }

  const { items, totalAmount, address, status, createdAt } = order;
  const tax = (totalAmount / 1.02) * 0.02;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-semibold mb-6 text-center text-green-600">Order Confirmed ✅</h1>

      <div className="mb-4">
        <p className="text-gray-600"><strong>Delivery Address:</strong> {address}</p>
        <p className="text-gray-600"><strong>Status:</strong> {status}</p>
        <p className="text-gray-600"><strong>Order Date:</strong> {new Date(createdAt).toLocaleString()}</p>
      </div>

      <table className="w-full text-left border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Item</th>
            <th className="p-2">Price</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.itemID}>
              <td className="p-2">{item.itemName}</td>
              <td className="p-2">₹{item.price}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-gray-700 space-y-1">
        <p><strong>Subtotal:</strong> ₹{(totalAmount - tax).toFixed(2)}</p>
        <p><strong>Tax (2%):</strong> ₹{tax.toFixed(2)}</p>
        <p className="text-lg font-semibold"><strong>Total:</strong> ₹{totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
}
