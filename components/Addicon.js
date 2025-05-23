'use client'

import { Plus } from 'lucide-react' // You can use any icon lib, this is from lucide

export default function AddIconButton() {
  return (
    <div className="w-12 h-12 bg-[#f4c033] rounded-lg flex items-center justify-center">
      <Plus className="text-black w-6 h-6 stroke-[3]" />
    </div>
  )
}




 {/* Amenities */}
 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
 <h3 className="text-xl font-semibold mb-4 text-gray-900">Amenities</h3>
 <ul className="space-y-3">
   {property.has_pool && (
     <li className="flex items-center space-x-3">
       <div className="bg-blue-100 p-2 rounded-lg">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
           <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
         </svg>
       </div>
       <span>Swimming Pool</span>
     </li>
   )}
   {property.has_garden && (
     <li className="flex items-center space-x-3">
       <div className="bg-green-100 p-2 rounded-lg">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
           <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
         </svg>
       </div>
       <span>Garden</span>
     </li>
   )}
   {property.has_garage && (
     <li className="flex items-center space-x-3">
       <div className="bg-purple-100 p-2 rounded-lg">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
           <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
           <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h1a1 1 0 001-1v-1h1a1 1 0 001-1v-1h1a1 1 0 001-1v-1h1a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
         </svg>
       </div>
       <span>Garage</span>
     </li>
   )}
   {property.has_elevator && (
     <li className="flex items-center space-x-3">
       <div className="bg-yellow-100 p-2 rounded-lg">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
         </svg>
       </div>
       <span>Elevator</span>
     </li>
   )}
 </ul>
</div>



// app/property/[id]/page.js
"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ca } from 'date-fns/locale';

export default function PropertyDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:8000/properties/${id}`);
        if (!response.ok) throw new Error('Property not found');
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-2xl font-medium text-gray-600">Loading property...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="text-red-500 text-xl font-medium mb-4">⚠️ {error}</div>
      <button 
        onClick={() => router.back()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to listings
      </button>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="text-2xl font-medium mb-4">Property not found</div>
      <button 
        onClick={() => router.push('/')}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Browse properties
      </button>
    </div>
  );

  return (
    <div style={{width:'100%'}} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to listings
      </button>

      {/* Property header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">205.000€</h1>
        <div className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{property.address}, {property.city}, {property.country}</span>
        </div>
      </div>

      {/* Main content row - All three sections in one row */}
      <div style={{width:'100%'}} className="flex ">
        {/* Left side - Image gallery (50% width) */}
        <div className="lg:w-[90%]">
          {/* Main image */}
          <div className="relative w-full h-100  overflow-hidden mb-4">
            <Image
              src={property.images[activeImage].image_url}
              alt={`Property image ${activeImage + 1}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Thumbnail grid */}
          <div className="grid grid-cols-4 gap-2">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative h-24  transition-all ${activeImage === index ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`}
              >
                <Image
                  src={image.image_url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Middle - Property details (25% width) */}
        <div style={{marginLeft:'2%'}} className="lg:w-[35%]">
          <h2 className="text-2xl font-bold truncate mb-4">{property.title}</h2>
          
          <div className="flex items-center text-gray-600 mb-4">
            
            <span>📍{property.address}, {property.city}</span>
          </div>
          
          <div className="text-gray-600 mb-6">
            <span>⏰ Publicat {formatDistanceToNow(new Date(property.created_at), { 
              addSuffix: true,
              locale: ca
            })}</span>
          </div>

          {/* Features grid */}
          <div style={{}} className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-500 text-sm">Habitacions</div>
              <div className="text-xl font-semibold">
                {property.bedrooms} <span className="text-base">🛏️</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-500 text-sm">Banys</div>
              <div className="text-xl font-semibold">
                {property.bathrooms} <span className="text-base">🚿</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-500 text-sm">Superfície</div>
              <div className="text-xl font-semibold">
                {property.area_sq_meters} m² <span className="text-base">📏</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-500 text-sm">Any construcció</div>
              <div className="text-xl font-semibold">
                {property.construction_year || 'N/A'} <span className="text-base">🏗️</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-500 text-sm">Certificat energètic</div>
              <div className="text-xl font-semibold">
                {property.energy_certificate || 'N/A'} <span className="text-base">⚡</span>
              </div>
            </div>
          </div>
        </div>


        <div style={{width:2, backgroundColor:'#efefef', marginLeft:20}} >

        </div>

        <div style={{marginLeft:20}} className="lg:w-[30%]">
          <div className="flex items-center gap-3 mb-4">
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 truncate">📅 Reserva una visita</h2>
              <p className="text-sm text-gray-500">Tria el teu dia ideal i deixa les teves dades.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div style={{}}>
                <label className="block text-sm text-gray-600 mb-1">Dia</label>
                <input type="date"
                       className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block px-4 py-3 shadow-sm transition" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Nom</label>
                <div className="relative">
                  <input type="text" placeholder="Nom"
                         className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition shadow-sm" />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M5.121 17.804A8.001 8.001 0 0112 4a8.001 8.001 0 016.879 13.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Número de telèfon</label>
              <div className="relative">
                <input type="tel" placeholder="+34 234 567 890"
                       className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition shadow-sm" />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
                       viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h1.28a1 1 0 01.948.684l1.21 3.637a1 1 0 01-.217.957l-1.708 1.708a11.042 11.042 0 005.292 5.292l1.708-1.708a1 1 0 01.957-.217l3.637 1.21a1 1 0 01.684.948V19a2 2 0 01-2 2h-.01C9.611 21 3 14.389 3 6.01V6a1 1 0 010-.01V5z" />
                  </svg>
                </div>
              </div>
            </div>

            <button style={{backgroundColor:'#0666fe', borderRadius:4}} className="w-full  text-white font-bold py-2 px-3  transition-all shadow-md mt-2">
              <span style={{color:'white'}}></span>Reserva ya ⚡
            </button>
          </div>
        </div>
      </div>

      {/* Property description and location */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Description */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </div>
        </div>

        {/* Right column - Location */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Location</h3>
            <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center text-gray-400">
              Map would go here
            </div>
            <div className="mt-4 space-y-2">
              <p className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {property.address}
              </p>
              <p className="text-gray-700 ml-7">{property.postal_code} {property.city}</p>
              <p className="text-gray-700 ml-7">{property.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}