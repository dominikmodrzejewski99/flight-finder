'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { searchAirports, findAirportByCode, formatAirport, isIATACode, type Airport } from '@/lib/airports';

interface AirportAutocompleteProps {
  value: string;
  onChange: (value: string, airport?: Airport) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function AirportAutocomplete({
  value,
  onChange,
  placeholder = "Search city or airport...",
  label,
  className = ""
}: AirportAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Synchronizuj z zewnętrzną wartością
  useEffect(() => {
    if (value !== searchQuery) {
      setSearchQuery(value);
      
      // Sprawdź czy to kod IATA
      if (isIATACode(value)) {
        const airport = findAirportByCode(value);
        if (airport) {
          setSelectedAirport(airport);
          setSearchQuery(formatAirport(airport));
        }
      }
    }
  }, [value]);

  // Aktualizuj sugestie na podstawie wyszukiwania
  useEffect(() => {
    if (searchQuery.length >= 1 && isOpen) {
      const results = searchAirports(searchQuery);
      setSuggestions(results);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }, [searchQuery, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedAirport(null);
    setIsOpen(true);
    
    // Przekaż raw query do rodzica
    onChange(query, undefined);
  };

  const handleSelectAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    setSearchQuery(formatAirport(airport));
    setIsOpen(false);
    setSelectedIndex(-1);
    
    // Przekaż kod lotniska do rodzica
    onChange(airport.code, airport);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedAirport(null);
    setIsOpen(false);
    onChange('', undefined);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectAirport(suggestions[selectedIndex]);
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay closing to allow clicking on suggestions
    setTimeout(() => {
      if (!listRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 pr-10 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
          autoComplete="off"
        />
        
        {(searchQuery || selectedAirport) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div 
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
        >
          {suggestions.map((airport, index) => (
            <button
              key={airport.code}
              type="button"
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'
              }`}
              onClick={() => handleSelectAirport(airport)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {airport.name} ({airport.code})
                  </div>
                  <div className="text-sm text-gray-500">
                    {airport.country}
                    {airport.airport && ` • ${airport.airport}`}
                  </div>
                </div>
                <div className="text-sm font-mono text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                  {airport.code}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Airport Info */}
      {selectedAirport && (
        <div className="mt-2 text-xs text-green-600 flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          Selected: {selectedAirport.name}, {selectedAirport.country} ({selectedAirport.code})
        </div>
      )}
    </div>
  );
}
