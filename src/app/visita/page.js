'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

export default function VisitaPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const agentId = searchParams.get('agentId');

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const phoneNumber = '34640757315';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  const timeOptions = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return alert('Data i hora requerides');

    const fullDate = new Date(
      `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`
    );

    const res = await fetch(`http://localhost:8000/bookings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: Number(propertyId),
        booking_date: fullDate.toISOString(),
        customer_name: name,
        customer_phone: phone,
        agent_id: Number(agentId),
      }),
    });

    if (res.ok) {
      alert('✅ Visita programada amb èxit');
    } else {
      alert('❌ Error en programar la visita');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex md:flex-row justify-between items-center w-full px-8 py-3 bg-white shadow-md">
        <div className="mb-4 md:mb-0 flex justify-start w-full md:w-auto">
          <Link href="/">
            <Image
              src="/logollarcatalana.png"
              alt="Logo Llar Catalana"
              width={150}
              height={50}
            />
          </Link>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-800 hover:text-blue-600">
            Inici
          </Link>
          <Link href="/properties" className="text-gray-800 hover:text-blue-600">
            Propietats
          </Link>
          <Link href="/contact" className="text-gray-800 hover:text-blue-600">
            Contacte
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-blue-600">
            Sobre Nosaltres
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto justify-center">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <button
              style={{ borderRadius: 7 }}
              className="flex items-center justify-center bg-[#28d464] px-10 py-2"
            >
              <Image src="/whats.png" alt="WhatsApp" width={30} height={30} />
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

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 space-y-6 transition"
        >
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-2">
            Programar una Visita
          </h2>
          <p className="text-center text-sm text-gray-500 mb-4">
            Selecciona una data, hora i completa les teves dades
          </p>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Data
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecciona una data"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                minDate={new Date()}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Hora
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una hora</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                placeholder="El teu nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Telèfon</label>
              <input
                type="tel"
                placeholder="Número de contacte"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold text-lg rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            Confirmar Visita
          </button>
        </form>
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
   
              📩  info@llarcatalana.com
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