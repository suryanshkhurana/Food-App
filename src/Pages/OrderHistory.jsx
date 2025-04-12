import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";

const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders", {
      withCredentials: true,
    })
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-4">Loading order history...</p>;
  }

  if (orders.length === 0) {
    return <p className="p-4">No past orders found.</p>;
  }

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Your Order History</h2>
      {orders.map((order, index) => (
        <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
          <div className="flex gap-5">
            <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
            <div>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col justify-center">
                  <p className="font-medium">
                    {item.itemName}{" "}
                    <span className={`text-indigo-500 ${item.quantity < 2 && "hidden"}`}>
                      x {item.quantity}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm">
            <p className="font-medium mb-1">{order.address || "N/A"}</p>
          </div>

          <p className="font-medium text-base my-auto text-black/70">₹{order.totalAmount}</p>

          <div className="flex flex-col text-sm">
            <p>Method: {order.paymentMethod || "COD"}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Payment: Paid</p>
          </div>
        </div>
      ))}
    </div>
  );
}
