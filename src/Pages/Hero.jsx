import React from 'react';
import { ArrowRight, Clock, Star, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-yellow-500/30 -z-10" />
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2850&q=80"
          alt="Food Background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20 -z-10"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Delicious Food,
              <span className="text-orange-500"> Delivered Fast</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Experience the finest local restaurants delivered right to your doorstep.
              Fresh, fast, and always delicious.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors inline-flex items-center gap-2">
                Order Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors"
              >
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </div>

      
      </div>
  );
}