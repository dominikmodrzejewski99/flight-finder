'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedDestinations from '@/components/FeaturedDestinations';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import NoSSR from '@/components/NoSSR';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <NoSSR>
        <Hero />
        <FeaturedDestinations />
        <Features />
      </NoSSR>
      <Footer />
    </div>
  );
}
