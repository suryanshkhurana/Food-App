import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCartStore } from "../store/cartStore"

export default function Product({ searchTerm }) {
  const [menuItems, setMenuItems] = useState([]);
  const { cartItems, addToCart, incrementItem, decrementItem } = useCartStore();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/products")
      .then((response) => {
        if (response.data.success && response.data.menuItems) {
          const rawItems = response.data.menuItems;
          const itemsArray = Object.values(rawItems);
          setMenuItems(itemsArray);
        } else {
          console.error("Invalid response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);  

  const filteredItems = menuItems.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 flex justify-center gap-6 p-4 w-[80%]">
      {filteredItems.map((item) => {
        const quantity = cartItems[item.itemID]?.quantity || 0;

        return (
          <div
            key={item.itemID}
            className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
          >
            <div className="w-full h-44 bg-gray-100 overflow-hidden">
              <img
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.itemName}
              />
            </div>

            <div className="flex flex-col p-4 flex-grow">
              <p className="text-gray-800 font-semibold text-lg truncate">{item.itemName}</p>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {item.description || "No description available."}
              </p>

              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-indigo-600 font-bold text-base">
                  ₹{item.price || "99"}
                </span>

                {quantity === 0 ? (
                  <button
                    className="bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-md text-sm font-medium border border-indigo-300 hover:bg-indigo-200 transition"
                    onClick={() => addToCart(item)}
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center bg-indigo-100 rounded-md px-2 py-1 gap-2">
                    <button
                      onClick={() => decrementItem(item.itemID)}
                      className="text-indigo-700 hover:text-indigo-900 text-lg font-bold px-2"
                    >
                      −
                    </button>
                    <span className="min-w-[24px] text-center text-sm font-medium text-gray-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => incrementItem(item.itemID)}
                      className="text-indigo-700 hover:text-indigo-900 text-lg font-bold px-2"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {filteredItems.length === 0 && (
        <p className="text-gray-500 text-center col-span-full">
          No items found.
        </p>
      )}
    </div>
  );
}
