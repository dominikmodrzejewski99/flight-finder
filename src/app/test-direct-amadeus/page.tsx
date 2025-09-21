'use client';

import { useState } from 'react';

export default function TestDirectAmadeusPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test bezpośredniego wywołania Amadeus API (NIE BĘDZIE DZIAŁAĆ)
  const testDirectAmadeus = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚀 Próba bezpośredniego wywołania Amadeus API...');
      
      // To jest próba bezpośredniego wywołania Amadeus API
      const directUrl = 'https://test.api.amadeus.com/v1/shopping/flight-dates?origin=WAR&destination=KRA&departureDate=2025-09-21&viewBy=DURATION&duration=3';
      
      console.log('📍 Direct URL:', directUrl);
      
      // To nie będzie działać przez CORS i brak tokenów
      const response = await fetch(directUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('✅ Bezpośrednie wywołanie udane:', data);
      setResult(data);
    } catch (err: any) {
      console.error('❌ Błąd bezpośredniego wywołania:', err);
      setError(`Błąd CORS/Authorization: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test przez nasz proxy endpoint
  const testProxyEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚀 Wywołanie przez proxy endpoint...');
      
      const proxyUrl = '/api/shopping/flight-dates?origin=WAR&destination=KRA&departureDate=2025-09-21&viewBy=DURATION&duration=3';
      console.log('📍 Proxy URL:', proxyUrl);
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      console.log('✅ Proxy wywołanie udane:', data);
      setResult(data);
    } catch (err: any) {
      console.error('❌ Błąd proxy wywołania:', err);
      setError(`Błąd proxy: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🧪 Test Direct Amadeus vs Proxy</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-800">
            ❌ Bezpośrednie wywołanie Amadeus API
          </h2>
          <p className="text-sm text-red-600 mb-4">
            To NIE BĘDZIE DZIAŁAĆ przez CORS i brak autoryzacji!
          </p>
          <button
            onClick={testDirectAmadeus}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
          >
            {loading ? 'Testowanie...' : 'Test Direct API'}
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            ✅ Przez Proxy Endpoint
          </h2>
          <p className="text-sm text-green-600 mb-4">
            To powinno działać - używa Next.js API route jako proxy.
          </p>
          <button
            onClick={testProxyEndpoint}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
          >
            {loading ? 'Testowanie...' : 'Test Proxy API'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">Błąd:</h3>
          <pre className="text-sm text-red-600 whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {result && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Wynik:</h3>
          <pre className="text-sm bg-white p-4 rounded border overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-4">💡 Wyjaśnienie:</h3>
        <div className="space-y-3 text-sm text-blue-700">
          <p>
            <strong>Dlaczego bezpośrednie wywołanie nie działa:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>CORS</strong> - Amadeus API blokuje requesty z przeglądarki</li>
            <li><strong>Authorization</strong> - Nie można bezpiecznie przechowywać API keys w frontendzie</li>
            <li><strong>OAuth2</strong> - Token musi być pobrany po stronie serwera</li>
          </ul>
          
          <p className="mt-4">
            <strong>Rozwiązanie:</strong> Używamy Next.js API route jako proxy - wywołujesz <code>/api/shopping/flight-dates</code> 
            a to przekierowuje requesty do Amadeus API z właściwą autoryzacją.
          </p>
        </div>
      </div>
    </div>
  );
}
