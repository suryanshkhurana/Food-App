import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import { Loader2, ShoppingCart, Plus, Minus } from "lucide-react";
import api from "../services/api";
export default function Product({ searchTerm }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { cartItems, addToCart, incrementItem, decrementItem } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products");
        if (response.data.success && response.data.menuItems) {
          const itemsArray = Object.values(response.data.menuItems);
          setMenuItems(itemsArray);
        } else {
          setError("Failed to load products");
        }
      } catch (error) {
        setError("Error fetching products. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredItems = menuItems.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">⚠️</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const quantity = cartItems[item.itemID]?.quantity || 0;

          return (
            <div
              key={item.itemID}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
            >
              <div className="aspect-square bg-gray-50 overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                  alt={item.itemName}
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">
                  {item.itemName}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {item.description || "Delicious and freshly prepared"}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-indigo-600">
                    ₹{item.price}
                  </span>

                  {quantity === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-indigo-50 rounded-lg px-3 py-1">
                      <button
                        onClick={() => decrementItem(item.itemID)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => incrementItem(item.itemID)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}