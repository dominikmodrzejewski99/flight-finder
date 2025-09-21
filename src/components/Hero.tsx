'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Users, 
  ArrowRight,
  Zap,
  TrendingDown,
  Globe,
  Plane,
  Clock,
  Euro,
  ExternalLink
} from 'lucide-react';
import AirportAutocomplete from './AirportAutocomplete';
import type { Airport } from '@/lib/airports';

type FlightDestinationItem = {
  type: 'flight-destination';
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price?: { total?: string };
  links?: { flightDates?: string; flightOffers?: string };
};

type AmadeusFlightDestinationsResponse = {
  data: FlightDestinationItem[];
};

export default function Hero() {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: 1,
    tripType: 'round-trip'
  });

  const [selectedAirports, setSelectedAirports] = useState({
    from: null as Airport | null,
    to: null as Airport | null
  });

  const [results, setResults] = useState<FlightDestinationItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = [
    { label: 'Happy Travelers', value: '2.4M+', icon: Users },
    { label: 'Money Saved', value: '$847M', icon: TrendingDown },
    { label: 'Destinations', value: '1,200+', icon: Globe },
    { label: 'Avg. Search Time', value: '0.8s', icon: Zap }
  ];

  const handleSearch = async () => {
    setError(null);
    setResults(null);
    
    // Sprawdź czy mamy wybrane lotniska/miasta
    if (!searchData.from) {
      setError('Please select departure city');
      return;
    }

    try {
      setLoading(true);
      
      // Dla flight-destinations API potrzebujemy tylko origin (punkt wyjścia)
      const params = new URLSearchParams({
        origin: searchData.from // Używamy kodu IATA
      });
      
      // Dodaj opcjonalne parametry
      if (searchData.departure) {
        // Dla flight-destinations możemy ustawić zakres dat
        const departureDate = new Date(searchData.departure);
        const endDate = new Date(departureDate);
        endDate.setMonth(endDate.getMonth() + 2); // 2 miesiące do przodu
        
        params.set('departureDate', `${searchData.departure},${endDate.toISOString().split('T')[0]}`);
      }
      
      if (searchData.tripType) {
        params.set('oneWay', searchData.tripType === 'one-way' ? 'true' : 'false');
      }
      
      // Dodaj duration (1-15 dni) - typowy zakres dla urlopów
      params.set('duration', '1,15');
      params.set('viewBy', 'DURATION');
      
      console.log('🚀 Searching with params:', params.toString());
      
      const res = await fetch(`/api/shopping/flight-dates?${params.toString()}`, { 
        cache: 'no-store' 
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const json = (await res.json()) as AmadeusFlightDestinationsResponse;
      console.log('✅ Search results:', json);
      
      let filteredResults = Array.isArray(json?.data) ? json.data : [];
      
      // Jeśli użytkownik wybrał konkretną destynację (to), filtruj wyniki
      if (searchData.to && selectedAirports.to) {
        filteredResults = filteredResults.filter(flight => 
          flight.destination === searchData.to
        );
        
        if (filteredResults.length === 0 && json?.data?.length > 0) {
          setError(`No direct flights found from ${selectedAirports.from?.name} to ${selectedAirports.to?.name}. Showing all destinations from ${selectedAirports.from?.name}.`);
          filteredResults = json.data;
        }
      }
      
      setResults(filteredResults);
      
      if (filteredResults.length === 0) {
        setError('No flights found for selected criteria');
      }
      
    } catch (err: any) {
      console.error('❌ Search error:', err);
      
      // Specjalna wiadomość dla błędu 1797 (brak danych)
      if (err.message.includes('No response found') || err.message.includes('1797')) {
        setError(`No flights available from ${selectedAirports.from?.name || searchData.from}. Try Madrid or Barcelona for demo purposes (test API has limited data).`);
      } else {
        setError(err.message || 'Service unavailable');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2"></div>
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Find Your Perfect Flight
          </motion.h1>
          
          <motion.p
            className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover incredible flight deals with our AI-powered search engine. 
            Compare millions of flights and save up to 60% on your next trip.
          </motion.p>

          {/* Search Form */}
          <motion.div
            className="backdrop-blur-md bg-white/90 rounded-2xl p-6 shadow-xl border border-white/30 max-w-5xl mx-auto mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Trip Type Toggle */}
            <div className="flex space-x-4 mb-6">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  searchData.tripType === 'round-trip' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
                onClick={() => setSearchData({...searchData, tripType: 'round-trip'})}
              >
                Round Trip
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  searchData.tripType === 'one-way' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
                onClick={() => setSearchData({...searchData, tripType: 'one-way'})}
              >
                One Way
              </button>
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <AirportAutocomplete
                label="From"
                placeholder="Search departure city..."
                value={searchData.from}
                onChange={(value, airport) => {
                  setSearchData({...searchData, from: value});
                  setSelectedAirports({...selectedAirports, from: airport || null});
                }}
              />

              <AirportAutocomplete
                label="To (Optional)"
                placeholder="Search destination city..."
                value={searchData.to}
                onChange={(value, airport) => {
                  setSearchData({...searchData, to: value});
                  setSelectedAirports({...selectedAirports, to: airport || null});
                }}
              />

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full px-4 py-3 pl-10 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                    value={searchData.departure}
                    onChange={(e) => setSearchData({...searchData, departure: e.target.value})}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {searchData.tripType === 'round-trip' ? 'Return' : 'Passengers'}
                </label>
                {searchData.tripType === 'round-trip' ? (
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      className="w-full px-4 py-3 pl-10 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                      value={searchData.return}
                      onChange={(e) => setSearchData({...searchData, return: e.target.value})}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      className="w-full px-4 py-3 pl-10 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                      value={searchData.passengers}
                      onChange={(e) => setSearchData({...searchData, passengers: parseInt(e.target.value)})}
                    >
                      <option value={1}>1 Passenger</option>
                      <option value={2}>2 Passengers</option>
                      <option value={3}>3 Passengers</option>
                      <option value={4}>4 Passengers</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {searchData.tripType === 'round-trip' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      className="w-full px-4 py-3 pl-10 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                      value={searchData.passengers}
                      onChange={(e) => setSearchData({...searchData, passengers: parseInt(e.target.value)})}
                    >
                      <option value={1}>1 Passenger</option>
                      <option value={2}>2 Passengers</option>
                      <option value={3}>3 Passengers</option>
                      <option value={4}>4 Passengers</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Search Button */}
            <button 
              className="w-full inline-flex items-center justify-center px-6 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group"
              onClick={handleSearch}
              disabled={loading}
            >
              <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {loading ? 'Searching…' : 'Search Flights'}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Results / Error */}
            <div className="mt-8 text-left">
              {error && (
                <div className="text-red-600 text-sm mb-4">{error}</div>
              )}

              {Array.isArray(results) && results.length > 0 && (
                <div>
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="text-sm text-blue-700">
                        <strong>{results.length}</strong> flight{results.length !== 1 ? 's' : ''} found
                        {selectedAirports.to ? (
                          <span> from <strong>{selectedAirports.from?.name}</strong> to <strong>{selectedAirports.to?.name}</strong></span>
                        ) : (
                          <span> from <strong>{selectedAirports.from?.name || searchData.from}</strong></span>
                        )}
                      </div>
                      {selectedAirports.to && (
                        <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          Direct flights only
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2 -mr-2">
                    {results.map((item, idx) => (
                      <div key={idx} className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        {/* Gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        
                        <div className="p-6">
                          {/* Header with route */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                                <Plane className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-lg font-bold text-gray-900">
                                  {item.origin} → {item.destination}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">
                                  {item.type.replace('-', ' ')}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Travel dates */}
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">Travel Dates</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">Departure:</span>
                                <span className="text-indigo-600 font-medium">
                                  {new Date(item.departureDate).toLocaleDateString('en-GB', { 
                                    weekday: 'short', 
                                    day: 'numeric', 
                                    month: 'short' 
                                  })}
                                </span>
                              </div>
                              {item.returnDate && (
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="font-medium">Return:</span>
                                  <span className="text-purple-600 font-medium">
                                    {new Date(item.returnDate).toLocaleDateString('en-GB', { 
                                      weekday: 'short', 
                                      day: 'numeric', 
                                      month: 'short' 
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Duration info */}
                          {item.returnDate && (
                            <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {Math.ceil((new Date(item.returnDate).getTime() - new Date(item.departureDate).getTime()) / (1000 * 60 * 60 * 24))} days
                              </span>
                            </div>
                          )}

                          {/* Price and CTA */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              <Euro className="w-5 h-5 text-green-600" />
                              <div>
                                <div className="text-2xl font-bold text-green-600">
                                  {item.price?.total ? `€${item.price.total}` : 'Available'}
                                </div>
                                <div className="text-xs text-gray-500">per person</div>
                              </div>
                            </div>
                            
                            {item.links?.flightOffers && (
                              <button className="group/btn flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                                <span className="text-sm font-medium">Book</span>
                                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/20 group-hover:to-purple-50/20 transition-all duration-300 pointer-events-none rounded-2xl"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(results) && results.length === 0 && !loading && !error && (
                <div className="text-sm text-gray-600">No results</div>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
