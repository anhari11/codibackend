'use client'
import { useState, useEffect } from 'react'
import { FaSearch, FaBed } from 'react-icons/fa'
import { IoChevronDown } from 'react-icons/io5'
import Image from 'next/image'

const BAGES_CITIES = [
  "Manresa",
  "Sant Fruitós de Bages",
  "Sant Joan de Vilatorrada",
  "Santpedor",
  "Sallent",
  "Navarcles",
  "Avinyó",
  "Moià",
  "Fonollosa",
  "Castellfollit del Boix",
  "Rajadell",
  "Aguilar de Segarra",
  "Callús",
  "Sant Mateu de Bages",
  "El Pont de Vilomara i Rocafort",
  "Marganell"
];

export default function SearchBar({
  onSearch,
  onPriceChange,
  onBedroomsChange,
  initialSearchTerm = '',
  initialPriceRange = [0, 1000000],
  initialBedrooms = 'any',
  bedroomOptions = []
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [minPrice, setMinPrice] = useState(initialPriceRange[0]);
  const [maxPrice, setMaxPrice] = useState(initialPriceRange[1]);
  const [selectedBedrooms, setSelectedBedrooms] = useState(initialBedrooms);
  const [showBedroomDropdown, setShowBedroomDropdown] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = BAGES_CITIES.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCitySuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearchSubmit = () => {
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handlePriceUpdate = () => {
    const min = minPrice || 0;
    const max = maxPrice || 1000000;
    onPriceChange(min, max);
  };

  const handleBedroomSelect = (value) => {
    setSelectedBedrooms(value);
    setShowBedroomDropdown(false);
    onBedroomsChange(value);
  };

  const handleCitySelect = (city) => {
    setSearchTerm(city);
    setShowSuggestions(false);
  };

  return (
    <div>
      {/* Mobile version */}
      <div className="flex flex-col sm:hidden gap-2 w-full">
        {/* Search bar with city suggestions */}
        <div className="relative">
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Escriu una ciutat de Bages"
              className="flex-1 bg-transparent outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
          </div>
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {citySuggestions.map((city, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleCitySelect(city)}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <button 
              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg w-full"
              onClick={() => setShowBedroomDropdown(!showBedroomDropdown)}
            >
              <div className="flex items-center">
                <FaBed className="mr-2 text-gray-500" size={14} />
                <span className="text-sm font-medium">
                  {bedroomOptions.find(b => b.value === selectedBedrooms)?.label || 'Habitacions'}
                </span>
              </div>
              <IoChevronDown className="text-gray-500" />
            </button>
            {showBedroomDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                {bedroomOptions.map(option => (
                  <div
                    key={option.value}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleBedroomSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded-lg col-span-2">
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Mín"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  onBlur={handlePriceUpdate}
                  className="w-full bg-transparent outline-none text-sm border-b border-gray-300 pb-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Màx"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  onBlur={handlePriceUpdate}
                  className="w-full bg-transparent outline-none text-sm border-b border-gray-300 pb-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <span className="text-gray-500 text-sm">€</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button className="flex items-center justify-center border border-gray-300 p-3 rounded-lg flex-1">
            <Image 
              src="/filtre.png" 
              alt="Filtros" 
              width={18} 
              height={18}
            />
            <span className="ml-2 text-sm font-medium">Més Filtres</span>
            <IoChevronDown className="text-black text-lg ml-1 sm:ml-2" />
          </button>
          <button 
            className="flex-1 bg-[#fdcb42] hover:bg-[#f8c030] py-3 rounded-lg flex items-center justify-center"
            onClick={handleSearchSubmit}
          >
            <FaSearch className="text-black" />
          </button>
        </div>
      </div>

      {/* Desktop version */}
      <div className="hidden sm:flex flex-col sm:flex-row w-full">
        {/* 1. City search input with autocomplete */}
        <div className="relative flex-1">
          <div className="flex items-center bg-gray-100 hover:bg-gray-200 transition-colors p-2 sm:p-3 border-r border-white rounded-l-lg">
            <FaSearch className="text-black text-lg" />
            <input
              type="text"
              placeholder="Escriu una ciutat de Bages"
              className="ml-2 bg-transparent outline-none w-full text-sm sm:text-base placeholder-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
          </div>
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {citySuggestions.map((city, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCitySelect(city)}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Habitacions */}
        <div className="relative">
          <button 
            className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors p-2 sm:p-3 border-r border-white w-full"
            onClick={() => setShowBedroomDropdown(!showBedroomDropdown)}
          >
            <div className="flex items-center">
              <FaBed className="mr-2 text-black" />
              <span className="font-semibold text-black text-sm sm:text-base whitespace-nowrap">
                {bedroomOptions.find(b => b.value === selectedBedrooms)?.label || 'Habitacions'}
              </span>
            </div>
            <IoChevronDown className="text-black ml-2" />
          </button>
          {showBedroomDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {bedroomOptions.map(option => (
                <div
                  key={option.value}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleBedroomSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Preu */}
        <div className="flex items-center bg-gray-100 hover:bg-gray-200 transition-colors p-2 sm:p-3 border-r border-white">
          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="Mín"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              onBlur={handlePriceUpdate}
              className="w-12 sm:w-16 px-1 py-1 text-sm border-b border-gray-400 bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Màx"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              onBlur={handlePriceUpdate}
              className="w-12 sm:w-16 px-1 py-1 text-sm border-b border-gray-400 bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="ml-1 text-sm">€</span>
          </div>
        </div>

        {/* 4. Search button */}
        <button 
          className="flex items-center justify-center bg-[#fdcb42] hover:bg-[#f8c030] transition-colors p-3 sm:p-3"
          onClick={handleSearchSubmit}
        >
          <FaSearch className="text-black text-lg" />
        </button>

      
      </div>
    </div>
  );
}