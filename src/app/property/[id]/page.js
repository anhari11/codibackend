// app/property/[id]/page.js
"use client";
import log from 'loglevel';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';

export default function PropertyDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const phoneNumber = '34640757315';
  const message = 'Hola, estic interessat en la propietat';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:8000/properties/${id}`);
        if (!response.ok) throw new Error('Property not found');
        const data = await response.json();
        setProperty(data);
        console.log("Property loaded:", data); // Log the data directly
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProperty();
  }, [id]);

  const handleNextImage = () => {
    setImageLoaded(false);
    setActiveImage((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = () => {
    setImageLoaded(false);
    setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleClick = () => {

    const query = new URLSearchParams(property).toString();
  
 
    
  
    router.push(`/visita?propertyId=${property.id}&agentId=${property.created_by}`);

  };
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
    <div className="relative h-screen w-full flex overflow-hidden bg-gray-100">
      {/* Left side - Blurred background and main image */}
      <div className="relative h-full w-4/5 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gray-800">
            <Image
              src={property.images[activeImage].image_url}
              alt="Blurred Background"
              fill
              className="object-cover blur-xl scale-110"
              quality={30}
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative h-full w-full flex items-center justify-center p-8 z-10">
          <div className="relative w-full h-4/5 max-w-4xl">
            <Image
              src={property.images[activeImage].image_url}
              alt={`Property image ${activeImage + 1}`}
              fill
              className={`object-contain transition-opacity duration-700 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoadingComplete={() => setImageLoaded(true)}
              priority
              quality={100}
            />
          </div>
        </div>

        {/* Navigation arrows */}
        {property.images.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 z-20 transform -translate-y-1/2 flex items-center justify-center text-white hover:text-gray-200 transition-colors backdrop-blur-md bg-white/10 rounded-full p-3 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 z-20 transform -translate-y-1/2 flex items-center justify-center text-white hover:text-gray-200 transition-colors backdrop-blur-md bg-white/10 rounded-full p-3 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}

        {/* Back button with X icon */}
        <button 
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-20 flex items-center text-white hover:text-gray-200 transition-colors backdrop-blur-md bg-white/10 rounded-full p-3 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Thumbnail selector */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-4 z-20">
          {property.images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setImageLoaded(false);
                setActiveImage(index);
              }}
              className={`relative h-12 w-12 rounded-full overflow-hidden transition-all ${activeImage === index ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
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

      {/* Right side - Property details */}
      <div className="w-1/3 h-full bg-white overflow-y-auto">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
          <div className="font-bold text-gray-600 mb-4">205.000 €</div>

          <div className="flex items-center text-gray-600 mb-3">
            <span>📍 {property.address}, {property.city}</span>
          </div>

          <div className="text-gray-500 mb-6">
            <span>⏰ Publicat {formatDistanceToNow(new Date(property.created_at), { addSuffix: true, locale: ca })}</span>
          </div>

          <div className="w-full bg-gray-200 h-[2px]" />

          <div className="grid grid-cols-2 gap-4 mb-4 mt-3">
            <div>
              <div className="text-gray-500 text-sm">Dormitoris</div>
              <div className="text-xl font-semibold">🛏️ {property.bedrooms}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Lavabos</div>
              <div className="text-xl font-semibold">🛁 {property.bathrooms}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Metres quadrats</div>
              <div className="flex items-center">
                <Image width={30} height={30} src="/m2.png" alt="Area icon" />
                <div className="ml-2 text-xl font-semibold">{property.area_sq_meters} m2</div>
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Any construcció</div>
              <div className="text-xl font-semibold">🏗️ {property.construction_year || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Certificat energètic</div>
              <div className="text-xl font-semibold">⚡ {property.energy_certificate || 'N/A'}</div>
            </div>
            <div></div>
          </div>

          <div className="my-2 bg-gray-200 w-full h-[2px]" />

          {property.description && (
            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-2">Descripció</h3>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
          )}

          <div style={{marginTop:'5%'}} className="my-2 bg-gray-200 w-full h-[2px]" />
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 truncate">📅 Reserva una visita</h2>
                <p className="text-sm text-gray-500">Tria el teu dia ideal i deixa les teves dades.</p>
              </div>
            </div>

            {property && (

            <button    onClick={handleClick} style={{backgroundColor:'#0966ff'}} className="w-full flex items-center justify-center text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition">
              <span>Programar una visita</span>
              <Image
                src="/agendar.png"
                alt="Agendar"
                width={20}
                height={20}
                className="ml-2"
              />
            </button>
            )}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <button style={{fontWeight:'bold', marginTop:10}} className="w-full bg-[#28d464] text-white py-3 rounded-lg font-medium transition-colors shadow-md flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escriu-nos al WhatsApp
            </button>

            </a>
          </div>
        </div>
      </div>
    </div>
  );
}