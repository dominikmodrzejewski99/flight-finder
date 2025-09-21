export interface Airport {
  code: string;     // IATA kod (MAD)
  name: string;     // Nazwa miasta (Madrid)
  country: string;  // Kraj (Spain)
  airport?: string; // Pełna nazwa lotniska (optional)
}

// Baza najpopularniejszych lotnisk świata z kodami IATA
// ✅ = Verfied working with test API, ⚠️ = Limited data in test API
export const airports: Airport[] = [
  // Verified working cities (test API has full data)
  { code: 'MAD', name: 'Madrid', country: 'Spain ✅', airport: 'Adolfo Suárez Madrid–Barajas' },
  { code: 'BCN', name: 'Barcelona', country: 'Spain ✅', airport: 'Barcelona-El Prat' },
  
  // Other European cities (may have limited data in test API)
  { code: 'LIS', name: 'Lisbon', country: 'Portugal ⚠️', airport: 'Humberto Delgado Airport' },
  { code: 'LHR', name: 'London', country: 'UK ⚠️', airport: 'Heathrow Airport' },
  { code: 'LGW', name: 'London Gatwick', country: 'UK ⚠️', airport: 'Gatwick Airport' },
  { code: 'STN', name: 'London Stansted', country: 'UK', airport: 'Stansted Airport' },
  { code: 'CDG', name: 'Paris', country: 'France', airport: 'Charles de Gaulle' },
  { code: 'ORY', name: 'Paris Orly', country: 'France', airport: 'Orly Airport' },
  { code: 'FCO', name: 'Rome', country: 'Italy', airport: 'Leonardo da Vinci-Fiumicino' },
  { code: 'CIA', name: 'Rome Ciampino', country: 'Italy', airport: 'Ciampino Airport' },
  { code: 'MXP', name: 'Milan', country: 'Italy', airport: 'Milan Malpensa' },
  { code: 'LIN', name: 'Milan Linate', country: 'Italy', airport: 'Linate Airport' },
  { code: 'FRA', name: 'Frankfurt', country: 'Germany', airport: 'Frankfurt Airport' },
  { code: 'MUC', name: 'Munich', country: 'Germany', airport: 'Munich Airport' },
  { code: 'BER', name: 'Berlin', country: 'Germany', airport: 'Berlin Brandenburg' },
  { code: 'AMS', name: 'Amsterdam', country: 'Netherlands', airport: 'Schiphol Airport' },
  { code: 'ZUR', name: 'Zurich', country: 'Switzerland', airport: 'Zurich Airport' },
  { code: 'GVA', name: 'Geneva', country: 'Switzerland', airport: 'Geneva Airport' },
  { code: 'VIE', name: 'Vienna', country: 'Austria', airport: 'Vienna International' },
  { code: 'BRU', name: 'Brussels', country: 'Belgium', airport: 'Brussels Airport' },
  { code: 'CPH', name: 'Copenhagen', country: 'Denmark', airport: 'Copenhagen Airport' },
  { code: 'OSL', name: 'Oslo', country: 'Norway', airport: 'Oslo Gardermoen' },
  { code: 'ARN', name: 'Stockholm', country: 'Sweden', airport: 'Stockholm Arlanda' },
  { code: 'HEL', name: 'Helsinki', country: 'Finland', airport: 'Helsinki Airport' },
  
  // Polska (limited data in test API)
  { code: 'WAW', name: 'Warsaw', country: 'Poland ⚠️', airport: 'Chopin Airport' },
  { code: 'KRK', name: 'Krakow', country: 'Poland ⚠️', airport: 'John Paul II International' },
  { code: 'GDN', name: 'Gdansk', country: 'Poland ⚠️', airport: 'Lech Wałęsa Airport' },
  { code: 'WRO', name: 'Wroclaw', country: 'Poland', airport: 'Copernicus Airport' },
  { code: 'POZ', name: 'Poznan', country: 'Poland', airport: 'Ławica Airport' },
  
  // USA (limited data in test API)  
  { code: 'NYC', name: 'New York', country: 'USA ⚠️', airport: 'All NYC Airports' },
  { code: 'JFK', name: 'New York JFK', country: 'USA ⚠️', airport: 'John F. Kennedy International' },
  { code: 'LGA', name: 'New York LaGuardia', country: 'USA', airport: 'LaGuardia Airport' },
  { code: 'EWR', name: 'Newark', country: 'USA', airport: 'Newark Liberty International' },
  { code: 'LAX', name: 'Los Angeles', country: 'USA', airport: 'Los Angeles International' },
  { code: 'SFO', name: 'San Francisco', country: 'USA', airport: 'San Francisco International' },
  { code: 'MIA', name: 'Miami', country: 'USA', airport: 'Miami International' },
  { code: 'ORD', name: 'Chicago', country: 'USA', airport: 'O\'Hare International' },
  { code: 'DFW', name: 'Dallas', country: 'USA', airport: 'Dallas/Fort Worth International' },
  { code: 'ATL', name: 'Atlanta', country: 'USA', airport: 'Hartsfield-Jackson Atlanta International' },
  { code: 'BOS', name: 'Boston', country: 'USA', airport: 'Logan International' },
  { code: 'SEA', name: 'Seattle', country: 'USA', airport: 'Seattle-Tacoma International' },
  { code: 'LAS', name: 'Las Vegas', country: 'USA', airport: 'McCarran International' },
  
  // Inne popularne destynacje
  { code: 'DXB', name: 'Dubai', country: 'UAE', airport: 'Dubai International' },
  { code: 'DOH', name: 'Doha', country: 'Qatar', airport: 'Hamad International' },
  { code: 'IST', name: 'Istanbul', country: 'Turkey', airport: 'Istanbul Airport' },
  { code: 'CAI', name: 'Cairo', country: 'Egypt', airport: 'Cairo International' },
  { code: 'CMN', name: 'Casablanca', country: 'Morocco', airport: 'Mohammed V International' },
  { code: 'RAK', name: 'Marrakech', country: 'Morocco', airport: 'Menara Airport' },
  { code: 'TUN', name: 'Tunis', country: 'Tunisia', airport: 'Tunis-Carthage International' },
  
  // Azja
  { code: 'NRT', name: 'Tokyo', country: 'Japan', airport: 'Narita International' },
  { code: 'ICN', name: 'Seoul', country: 'South Korea', airport: 'Incheon International' },
  { code: 'PEK', name: 'Beijing', country: 'China', airport: 'Beijing Capital International' },
  { code: 'PVG', name: 'Shanghai', country: 'China', airport: 'Pudong International' },
  { code: 'SIN', name: 'Singapore', country: 'Singapore', airport: 'Changi Airport' },
  { code: 'BKK', name: 'Bangkok', country: 'Thailand', airport: 'Suvarnabhumi Airport' },
  { code: 'KUL', name: 'Kuala Lumpur', country: 'Malaysia', airport: 'Kuala Lumpur International' },
  
  // Australia
  { code: 'SYD', name: 'Sydney', country: 'Australia', airport: 'Kingsford Smith Airport' },
  { code: 'MEL', name: 'Melbourne', country: 'Australia', airport: 'Melbourne Airport' },
  
  // Afryka
  { code: 'JNB', name: 'Johannesburg', country: 'South Africa', airport: 'OR Tambo International' },
  { code: 'CPT', name: 'Cape Town', country: 'South Africa', airport: 'Cape Town International' },
  
  // Ameryka Południowa
  { code: 'GRU', name: 'São Paulo', country: 'Brazil', airport: 'Guarulhos International' },
  { code: 'GIG', name: 'Rio de Janeiro', country: 'Brazil', airport: 'Galeão International' },
  { code: 'EZE', name: 'Buenos Aires', country: 'Argentina', airport: 'Ezeiza International' },
  { code: 'SCL', name: 'Santiago', country: 'Chile', airport: 'Arturo Merino Benítez International' },
  
  // Wyspy popularne
  { code: 'PMI', name: 'Palma', country: 'Spain', airport: 'Palma de Mallorca Airport' },
  { code: 'IBZ', name: 'Ibiza', country: 'Spain', airport: 'Ibiza Airport' },
  { code: 'LPA', name: 'Las Palmas', country: 'Spain', airport: 'Gran Canaria Airport' },
  { code: 'TFS', name: 'Tenerife', country: 'Spain', airport: 'Tenerife South Airport' },
  { code: 'ACE', name: 'Lanzarote', country: 'Spain', airport: 'César Manrique-Lanzarote Airport' },
  { code: 'FUE', name: 'Fuerteventura', country: 'Spain', airport: 'Fuerteventura Airport' },
  { code: 'HER', name: 'Heraklion', country: 'Greece', airport: 'Heraklion Airport' },
  { code: 'ATH', name: 'Athens', country: 'Greece', airport: 'Eleftherios Venizelos International' },
  { code: 'SKG', name: 'Thessaloniki', country: 'Greece', airport: 'Macedonia Airport' },
  { code: 'RHO', name: 'Rhodes', country: 'Greece', airport: 'Rhodes International' },
  { code: 'CFU', name: 'Corfu', country: 'Greece', airport: 'Ioannis Kapodistrias International' },
];

// Funkcja wyszukiwania lotnisk
export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 1) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return airports
    .filter(airport => {
      const nameMatch = airport.name.toLowerCase().includes(searchTerm);
      const codeMatch = airport.code.toLowerCase().includes(searchTerm);
      const countryMatch = airport.country.toLowerCase().includes(searchTerm);
      const airportMatch = airport.airport?.toLowerCase().includes(searchTerm);
      
      return nameMatch || codeMatch || countryMatch || airportMatch;
    })
    .sort((a, b) => {
      // Priorytetyzuj dokładne dopasowania kodu
      const aCodeExact = a.code.toLowerCase() === searchTerm;
      const bCodeExact = b.code.toLowerCase() === searchTerm;
      
      if (aCodeExact && !bCodeExact) return -1;
      if (!aCodeExact && bCodeExact) return 1;
      
      // Priorytetyzuj dopasowania na początku nazwy
      const aNameStartsWith = a.name.toLowerCase().startsWith(searchTerm);
      const bNameStartsWith = b.name.toLowerCase().startsWith(searchTerm);
      
      if (aNameStartsWith && !bNameStartsWith) return -1;
      if (!aNameStartsWith && bNameStartsWith) return 1;
      
      // Sortuj alfabetycznie
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10); // Maksymalnie 10 wyników
}

// Funkcja znajdowania lotniska po kodzie
export function findAirportByCode(code: string): Airport | undefined {
  return airports.find(airport => airport.code.toUpperCase() === code.toUpperCase());
}

// Funkcja formatująca wyświetlanie lotniska
export function formatAirport(airport: Airport): string {
  return `${airport.name} (${airport.code})`;
}

// Funkcja sprawdzająca czy string to kod IATA
export function isIATACode(input: string): boolean {
  return /^[A-Z]{3}$/.test(input.toUpperCase()) && !!findAirportByCode(input);
}
