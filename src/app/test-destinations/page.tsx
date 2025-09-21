'use client';

import { useState } from 'react';

export default function TestFlightDatesPage() {
  // Form state
  const [origin, setOrigin] = useState('MAD');
  const [destination, setDestination] = useState('MUC');
  const [departureDate, setDepartureDate] = useState('');
  const [oneWay, setOneWay] = useState(false);
  const [duration, setDuration] = useState('');
  const [nonStop, setNonStop] = useState(false);
  const [maxPrice, setMaxPrice] = useState('200');
  const [viewBy, setViewBy] = useState<'DATE' | 'DURATION' | 'WEEK'>('DATE');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination) {
      setError('Origin and destination are required');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
      });
      
      if (departureDate) params.set('departureDate', departureDate);
      if (oneWay !== undefined) params.set('oneWay', String(oneWay));
      if (duration && !oneWay) params.set('duration', duration);
      if (nonStop !== undefined) params.set('nonStop', String(nonStop));
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (viewBy) params.set('viewBy', viewBy);

      const url = `/api/shopping/flight-dates?${params.toString()}`;
      console.log('🚀 Testing URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      setResult(data);
      console.log('✅ Success:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          ✈️ Test Flight Dates API
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Flight Search Parameters</h2>
          
          {/* Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin Airport Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MAD"
                maxLength={3}
                required
              />
              <p className="text-xs text-gray-500 mt-1">IATA code (e.g., MAD for Madrid)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Airport Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MUC"
                maxLength={3}
                required
              />
              <p className="text-xs text-gray-500 mt-1">IATA code (e.g., MUC for Munich)</p>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-1">ISO 8601 format (YYYY-MM-DD)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (EUR)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="200"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (days)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="7 or 2,8"
                disabled={oneWay}
              />
              <p className="text-xs text-gray-500 mt-1">Not used for one-way flights</p>
            </div>
          </div>

          {/* Checkboxes and Select */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <input
                id="oneWay"
                type="checkbox"
                checked={oneWay}
                onChange={(e) => {
                  setOneWay(e.target.checked);
                  if (e.target.checked) {
                    setDuration('');
                    setViewBy('DATE');
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="oneWay" className="text-sm font-medium text-gray-700">
                One-way flight
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="nonStop"
                type="checkbox"
                checked={nonStop}
                onChange={(e) => setNonStop(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="nonStop" className="text-sm font-medium text-gray-700">
                Non-stop flights only
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View By
              </label>
              <select
                value={viewBy}
                onChange={(e) => setViewBy(e.target.value as 'DATE' | 'DURATION' | 'WEEK')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DATE">DATE</option>
                <option value="DURATION">DURATION</option>
                <option value="WEEK">WEEK</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !origin || !destination}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? '🔄 Searching Flights...' : '🚀 Search Flight Dates'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h3 className="text-red-800 font-medium mb-2">❌ Error</h3>
            <pre className="text-red-700 text-sm">{error}</pre>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h3 className="text-green-800 font-medium mb-4">✅ Flight Dates Found</h3>
            <div className="text-sm text-green-700 mb-4">
              Found {result.data?.length || 0} flight dates
            </div>
            
            {/* Display first few results in a nice format */}
            {result.data && result.data.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-green-800 mb-2">Sample Results:</h4>
                <div className="space-y-2">
                  {result.data.slice(0, 3).map((flight: any, index: number) => (
                    <div key={index} className="bg-green-100 p-3 rounded text-sm">
                      <div className="font-medium">
                        {flight.origin} → {flight.destination}
                      </div>
                      <div className="text-green-600">
                        Departure: {flight.departureDate}
                        {flight.returnDate && ` | Return: ${flight.returnDate}`}
                      </div>
                      <div className="text-green-800 font-medium">
                        Price: €{flight.price?.total}
                      </div>
                    </div>
                  ))}
                  {result.data.length > 3 && (
                    <div className="text-xs text-green-600">
                      ... and {result.data.length - 3} more results
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <details className="cursor-pointer">
              <summary className="text-green-800 font-medium hover:text-green-900">
                📊 View Full API Response
              </summary>
              <pre className="mt-2 text-xs text-green-700 bg-green-100 p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
