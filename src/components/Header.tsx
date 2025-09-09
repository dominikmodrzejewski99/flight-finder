'use client';

import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative z-50 backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-bold gradient-text">FlightFinder</span>
          </motion.div>

          <motion.div
            className="hidden md:flex items-center space-x-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Deals</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Destinations</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Help</a>
            <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Sign In
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
