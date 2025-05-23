"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import SearchBar from "../../components/SearchBar";
import Link from 'next/link';

// Cities in Bages region
const bagesCities = [
  "Manresa", "Sant Fruitós de Bages", "Sant Joan de Vilatorrada", 
  "Santpedor", "Sallent", "Navarcles", "Fonollosa", "Castellgalí",
  "Avinyó", "Moià", "Artés", "Rajadell", "Sant Mateu de Bages",
  "Callús", "Sant Vicenç de Castellet", "El Pont de Vilomara i Rocafort"
];

const regions = [
  { name: "Toda España", id: "all" },
  { name: "Bages", id: "bages" },
  { name: "Barcelona", id: "bcn" },
  { name: "Madrid", id: "mad" },
  { name: "Valencia", id: "val" }
];

const bedroomOptions = [
  { value: "any", label: "Qualsevol" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBedrooms, setSelectedBedrooms] = useState("any");
  const [showBedroomDropdown, setShowBedroomDropdown] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const propertiesPerPage = 20;

  const phoneNumber = '34640757315';
  const message = 'Hola, estic interessat en la propietat';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/properties");
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // Generate city suggestions based on input
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = bagesCities.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCitySuggestions(filtered);
      setShowCitySuggestions(filtered.length > 0);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  }, [searchTerm]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search by title, city, or address
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.city && property.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (property.address && property.address.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by price range
      const matchesPrice =
        property.price >= priceRange[0] && property.price <= priceRange[1];
      
      // Filter by region (Bages shows only Bages cities)
      const matchesRegion =
        selectedRegion === "all" ||
        (selectedRegion === "bages" && bagesCities.includes(property.city)) ||
        (property.city && property.city.toLowerCase().includes(
          regions.find((r) => r.id === selectedRegion)?.name.toLowerCase() || ""
        ));
      
      // Filter by number of bedrooms
      const matchesBedrooms = 
        selectedBedrooms === "any" ||
        property.bedrooms >= parseInt(selectedBedrooms);

      return matchesSearch && matchesPrice && matchesRegion && matchesBedrooms;
    });
  }, [properties, searchTerm, priceRange, selectedRegion, selectedBedrooms]);

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCitySuggestionClick = (city) => {
    setSearchTerm(city);
    setShowCitySuggestions(false);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
    setCurrentPage(1);
  };

  const handleBedroomsChange = (bedrooms) => {
    setSelectedBedrooms(bedrooms);
    setCurrentPage(1);
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 1000000]);
    setSelectedRegion("all");
    setSelectedBedrooms("any");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Navigation */}
      <nav className="flex md:flex-row justify-between items-center w-full px-8 py-3 bg-white shadow-md">
        <div className="mb-4 md:mb-0 flex justify-start w-full md:w-auto">
          <Image
            src="/logollarcatalana.png"
            alt="Logo Llar Catalana"
            width={150}
            height={50}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto justify-center">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <button
              style={{ borderRadius: 7 }}
              className="flex items-center justify-center bg-[#28d464] px-10 py-2"
            >
              <Image src="/whats.png" alt="Vender icon" width={30} height={30} />
              <span className="ml-2 text-sm md:text-base font-bold text-white">
                Chatega al WhatsApp
              </span>
            </button>
          </a>
          <button className="border border-gray-300 px-4 py-3 rounded-lg">
            <span className="text-sm md:text-base font-bold text-black">
              📞 +34 640757315
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row w-full px-8 py-8 bg-white">
        <section className="w-full lg:w-1/2 lg:pr-8">
          <h1 className="text-4xl lg:text-5xl font-semibold leading-tight">
            Inmobiliaria dedicada al Bages
          </h1>
          <h1 className="text-4xl lg:text-5xl font-semibold mb-4">
            i tota Catalunya
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mb-6">
            Experts en serveis immobiliaris a la zona del Bages i Catalunya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://meet.google.com/ikt-wtov-pdt" target="_blank" rel="noopener noreferrer">
              <button className="flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition">
                <span>Programar una consulta</span>
                <Image
                  src="/agendar.png"
                  alt="Agendar"
                  width={20}
                  height={20}
                  className="ml-2"
                />
              </button>
            </a>
            <button className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-100">
              Contactar
            </button>
          </div>
        </section>
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <Image
            src="/fotocasa.jpeg"
            alt="Casa ejemplo"
            width={600}
            height={400}
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Search */}
      <div className="w-full px-8">
        <SearchBar 
          onSearch={handleSearch}
          onPriceChange={handlePriceChange}
          onBedroomsChange={handleBedroomsChange}
          onRegionChange={handleRegionChange}
          initialSearchTerm={searchTerm}
          initialPriceRange={priceRange}
          initialBedrooms={selectedBedrooms}
          initialRegion={selectedRegion}
          regions={regions}
          bedroomOptions={bedroomOptions}
        />

        <button
          onClick={resetFilters}
          className="text-blue-600 hover:text-blue-800 text-sm mb-4"
        >
          Restablir filtres
        </button>
      </div>

      {/* Results */}
      <div className="w-full max-w-7xl px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            {filteredProperties.length}{" "}
            {filteredProperties.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">Cargando propiedades...</div>
        ) : currentProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProperties.map((property, idx) => (
              <Link 
                href={`/property/${property.id}`} 
                key={idx}
                passHref
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 border">
                  <div className="relative h-56 group overflow-hidden">
                    <Image
                      src={property.primary_image_url}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="100vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                      📍 {property.address}, {property.city}
                    </p>
                    <div className="flex gap-2 text-sm text-gray-700 mb-2">
                      <span className="px-2 py-1 bg-gray-100 rounded-md">
                        {property.area_sq_meters} m²
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-md">
                        {property.bathrooms} banys
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span style={{fontWeight:'bold', fontSize:22}}>
                        {property.price.toLocaleString()}€
                      </span>
                      <button className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition">
                        Veure detalls
                        <Image
                          src="/agendar.png"
                          alt="Agendar"
                          width={18}
                          height={18}
                          className="ml-2"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
            No s'han trobat immobles amb aquestes característiques
            </h3>
            <p className="mt-1 text-gray-500">
            Intenta ajustar els teus filtres de cerca.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Restablir filtres
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border disabled:opacity-50"
              >
                &lt;
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 rounded-md border ${currentPage === pageNum ? 'bg-blue-600 text-white' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border disabled:opacity-50"
              >
                &gt;
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-100 py-8 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/logollarcatalana.png"
              alt="Logo Llar Catalana"
              width={150}
              height={50}
            />
            <p className="mt-4 text-gray-600">
              Experts en serveis immobiliaris a la zona del Bages i Catalunya.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacte</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
         
              📍 C/ Example, 123, Manresa
              </li>
              <li className="flex items-center">
             
              📞 +34 640 757 315
              </li>
              <li className="flex items-center">
       
              📩 info@llarcatalana.com
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Horari</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Dilluns a Divendres: 9:00 - 19:00</li>
              <li>Dissabte: 10:00 - 14:00</li>
              <li>Diumenge: Tancat</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-gray-300 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Llar Catalana. Tots els drets reservats.</p>
        </div>
      </footer>
    </div>
  );
}