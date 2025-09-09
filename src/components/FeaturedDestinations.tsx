'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function FeaturedDestinations() {
  const featuredDestinations = [
    { city: 'Paris', country: 'France', price: '€89', image: '🇫🇷', discount: '45% off' },
    { city: 'Barcelona', country: 'Spain', price: '€67', image: '🇪🇸', discount: '38% off' },
    { city: 'Rome', country: 'Italy', price: '€124', image: '🇮🇹', discount: '42% off' },
    { city: 'Amsterdam', country: 'Netherlands', price: '€156', image: '🇳🇱', discount: '35% off' },
    { city: 'Berlin', country: 'Germany', price: '€98', image: '🇩🇪', discount: '40% off' },
    { city: 'Prague', country: 'Czech Republic', price: '€76', image: '🇨🇿', discount: '48% off' }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-display gradient-text mb-4">Popular Destinations</h2>
          <p className="text-xl text-gray-600">Discover amazing places at unbeatable prices</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredDestinations.map((destination, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{destination.image}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{destination.city}</h3>
                      <p className="text-sm text-gray-600">{destination.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{destination.price}</div>
                    <div className="text-xs text-green-600 font-medium">{destination.discount}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Round trip</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
