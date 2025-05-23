"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const municipiosBages = [
    "Manresa",
    "Sant Vicenç de Castellet",
    "Sant Joan de Vilatorrada",
    "Sallent",
    "Navàs",
    "Artés",
    "Santpedor",
    "Cardona",
    "Avinyó",
    "Castellbell i el Vilar",
    "Balsareny",
    "Callús",
    "Monistrol de Montserrat",
    "Suria",
    "Moià",
    "Navarcles",
    "Pont de Vilomara i Rocafort",
    "Marganell",
    "Sant Fruitós de Bages",
    "Gaià",
    "Gironella",
    "Castellnou de Bages",
    "Rajadell",
    "Talamanca",
    "Aguilar de Segarra",
    "Fonollosa",
    "Mura",
    "El Bruc",
    "Calders",
    "Santa Maria d'Oló"
  ];
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Espanya",
    latitude: "",
    longitude: "",
    bedrooms: "",
    bathrooms: "",
    area_sq_meters: "",
    property_type_id: "1",
    construction_year: "",
    has_pool: false,
    has_garden: false,
    has_garage: false,
    has_elevator: false,
    energy_certificate: "",
    status: ""
  });

  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({ username: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [currentView, setCurrentView] = useState("properties");
  const [bookings, setBookings] = useState([]);
  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
    is_admin: false
  });
  const [propertiesList, setPropertiesList] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  // Clean up object URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  // Check authentication on mount and fetch bookings if authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const payload = parseJwt(token);
      if (payload && payload.admin) {
        setUserRole("admin");
      } else {
        setUserRole("user");
      }
      fetchBookings();
      fetchProperties();
    }
  }, []);

  const fetchProperties = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/properties/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener las propiedades");
      }

      const data = await res.json();
      setPropertiesList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPropertyDetails = async (id) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/properties/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener los detalles de la propiedad");
      }

      const data = await res.json();
      setSelectedProperty(data);
      setFormData({
        title: data.title,
        description: data.description,
        price: data.price,
        address: data.address,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area_sq_meters: data.area_sq_meters,
        property_type_id: data.property_type_id.toString(),
        construction_year: data.construction_year,
        has_pool: data.has_pool,
        has_garden: data.has_garden,
        has_garage: data.has_garage,
        has_elevator: data.has_elevator,
        energy_certificate: data.energy_certificate,
      });
      setIsEditing(true);
      setCurrentView("editProperty");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Convert numeric fields
      formDataToSend.set('price', parseFloat(formData.price));
      formDataToSend.set('bedrooms', parseInt(formData.bedrooms));
      formDataToSend.set('bathrooms', parseInt(formData.bathrooms));
      formDataToSend.set('area_sq_meters', parseInt(formData.area_sq_meters));
      formDataToSend.set('property_type_id', parseInt(formData.property_type_id));
      
      if (formData.construction_year) {
        formDataToSend.set('construction_year', parseInt(formData.construction_year));
      }
      if (formData.latitude) {
        formDataToSend.set('latitude', parseFloat(formData.latitude));
      }
      if (formData.longitude) {
        formDataToSend.set('longitude', parseFloat(formData.longitude));
      }

      // Append all images if there are new ones
      if (images.length > 0) {
        images.forEach((image) => {
          formDataToSend.append('files', image);
        });
      }

      const res = await fetch(`http://localhost:8000/properties/${selectedProperty.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error al actualizar la propiedad");
      }

      setSuccessMessage("Propietat actualizada amb exit!");
      fetchProperties();
      setCurrentView("properties");
      setIsEditing(false);
      setSelectedProperty(null);
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/bookings/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error amb les reserves");
      }

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(`http://localhost:8000/bookings/${bookingId}/${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error en l'acció");
      }

      setSuccessMessage(`Reserva ${action}ed amb exit!!`);
      fetchBookings(); // Refresh the bookings list
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const url = authMode === "login" ? "login" : "register";
      const body = authMode === "login"
        ? new URLSearchParams({
            username: authData.username,  
            password: authData.password
          })
        : JSON.stringify({
            username: authData.username,
            password: authData.password
          });

      const headers = authMode === "login"
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : { "Content-Type": "application/json" };

        const res = await fetch(`http://localhost:8000/auth/${url}`, {
        method: "POST",
        headers,
        body,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error d'autenticació");
      }

      if (authMode === "login") {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        setIsAuthenticated(true);
        const payload = parseJwt(data.access_token);
        if (payload && payload.admin) {
          setUserRole("admin");
        } else {
          setUserRole("user");
        }
        fetchBookings();
        fetchProperties();
      } else {
        setSuccessMessage("Registre exitós! Si us plau, inicia sessió.");
        setAuthMode("login");
        setAuthData({ username: "", password: "" });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentView("properties");
    setIsEditing(false);
    setSelectedProperty(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.price || 
        !formData.address || !formData.city || !formData.bedrooms || 
        !formData.bathrooms || !formData.area_sq_meters) {
      setError("Si us plau, omple tots els camps obligatoris");
      return false;
    }
    if (!isEditing && images.length === 0) {
      setError("Si us plau, afegeix almenys una imatge");
      return false;
    }
    return true;
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Convert numeric fields
      formDataToSend.set('price', parseFloat(formData.price));
      formDataToSend.set('bedrooms', parseInt(formData.bedrooms));
      formDataToSend.set('bathrooms', parseInt(formData.bathrooms));
      formDataToSend.set('area_sq_meters', parseInt(formData.area_sq_meters));
      formDataToSend.set('property_type_id', parseInt(formData.property_type_id));
      
      if (formData.construction_year) {
        formDataToSend.set('construction_year', parseInt(formData.construction_year));
      }
      if (formData.latitude) {
        formDataToSend.set('latitude', parseFloat(formData.latitude));
      }
      if (formData.longitude) {
        formDataToSend.set('longitude', parseFloat(formData.longitude));
      }

      // Append default values
      formDataToSend.append('is_featured', 'false');
      formDataToSend.append('status', 'available');

      // Append all images
      images.forEach((image) => {
        formDataToSend.append('files', image);
      });

      const res = await fetch("http://localhost:8000/properties/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error en enviar la propietat");
      }

      const data = await res.json();
      setSuccessMessage(`Propietat creada amb èxit! ID: ${data.property_id}`);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "Espanya",
        latitude: "",
        longitude: "",
        bedrooms: "",
        bathrooms: "",
        area_sq_meters: "",
        property_type_id: "1",
        construction_year: "",
        has_pool: false,
        has_garden: false,
        has_garage: false,
        has_elevator: false,
        energy_certificate: "",
      });
      setImages([]);
      setImagePreviews([]);
      fetchProperties();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
  
    try {
      const token = localStorage.getItem("token");
  
      const payload = {
        username: newUserData.username,
        password: newUserData.password,
        admin: newUserData.is_admin,
      };
  
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error en crear l'usuari");
      }
  
      setSuccessMessage("Usuari creat amb èxit!");
      setNewUserData({
        username: "",
        password: "",
        is_admin: false,
      });
      setCurrentView("properties");
    } catch (err) {
      setError("Error creant l'usuari");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Espanya",
      latitude: "",
      longitude: "",
      bedrooms: "",
      bathrooms: "",
      area_sq_meters: "",
      property_type_id: "1",
      construction_year: "",
      has_pool: false,
      has_garden: false,
      has_garage: false,
      has_elevator: false,
      energy_certificate: "",
    });
    setImages([]);
    setImagePreviews([]);
    setIsEditing(false);
    setSelectedProperty(null);
  };

  const handleDeleteProperty = async (id) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const res = await fetch(`http://localhost:8000/properties/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error al eliminar la propietat");
      }

      setSuccessMessage("Propietat eliminada amb exit!");
      fetchProperties();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-4 mt-10">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {authMode === "login" ? "Accés d'Administrador" : "Registre"}
        </h1>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4 text-center">{successMessage}</div>}
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="text"
            placeholder="Nom d'usuari"
            value={authData.username}
            onChange={(e) =>
              setAuthData({ ...authData, username: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Contrasenya"
            value={authData.password}
            onChange={(e) =>
              setAuthData({ ...authData, password: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading
              ? authMode === "login"
                ? "Iniciant sessió..."
                : "Registrant..."
              : authMode === "login"
              ? "Iniciar Sessió"
              : "Registrar-se"}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            className="text-blue-600 underline"
          >
            {authMode === "login"
              ? "Necessites registrar-te?"
              : "Ja tens un compte? Inicia sessió"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panell d'Administració</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView("bookings")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Les meves visites
          </button>
          
          {userRole === "admin" && (
            <>
              <button
                onClick={() => {
                  setCurrentView("properties");
                  resetForm();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Gestió de Propietats
              </button>
              <button
                onClick={() => setCurrentView("createUser")}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Crear Usuari
              </button>
            </>
          )}
          
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Tancar Sessió
          </button>
        </div>
      </div>
      
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4 text-center">{successMessage}</div>}
      
      {currentView === "createUser" && userRole === "admin" ? (
        <form onSubmit={handleCreateUser} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Crear Nou Usuari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom d'usuari"
              value={newUserData.username}
              onChange={(e) => setNewUserData({...newUserData, username: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Contrasenya"
              value={newUserData.password}
              onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
              className="border p-2 rounded"
              minLength={7}
              required
            />
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newUserData.is_admin}
              onChange={(e) => setNewUserData({...newUserData, is_admin: e.target.checked})}
              className="border p-2 rounded"
            />
            <span>Administrador</span>
          </label>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? "Creant usuari..." : "Crear Usuari"}
          </button>
        </form>
      ) : currentView === "bookings" ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Les meves visites</h2>
          
          {isLoading ? (
            <div className="text-center">Carregant reserves...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center">No tens cap reserva</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border p-4 rounded-lg shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-bold">Reserva #{booking.id}</h3>
                      <p>Data de reserva: {new Date(booking.booking_date).toLocaleDateString()}</p>
                      <p>Estat: {booking.status}</p>
                    </div>
                    <div>
                      <p>Client: {booking.customer_name}</p>
                      <p>Telèfon: {booking.customer_phone}</p>
                      {booking.agent_id && <p>Agent ID: {booking.agent_id}</p>}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleBookingAction(booking.id, "confirm")}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                              disabled={isLoading}
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleBookingAction(booking.id, "cancel")}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                              disabled={isLoading}
                            >
                              Cancel·lar
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleBookingAction(booking.id, "cancel")}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            disabled={isLoading}
                          >
                            Cancel·lar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : currentView === "editProperty" ? (
        <form onSubmit={handleUpdateProperty} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Editar Propietat</h2>
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Títol"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Preu"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="border p-2 rounded"
              required
            />
          </div>

          <textarea
            placeholder="Descripció"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border p-2 rounded"
            rows={4}
            required
          />

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Imatges de la propietat</label>
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded">
                <span>Seleccionar imatges</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {images.length > 0 ? `${images.length} imatges seleccionades` : "Cap imatge nova seleccionada"}
              </span>
            </div>
            
            {selectedProperty?.images && selectedProperty.images.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Imatges actuals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedProperty.images.map((image, index) => (
                    <div key={index} className="relative h-32">
                      <img
                        src={image.image_url}
                        alt={`Imatge actual ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Noves imatges</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative h-32">
                      <img
                        src={preview}
                        alt={`Previsualització ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Adreça"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <select
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="border p-2 rounded"
              required
            >
              <option value="">Selecciona una ciutat</option>
              {municipiosBages.map((municipio) => (
                <option key={municipio} value={municipio}>
                  {municipio}
                </option>
              ))}
            </select>
            <select
  value={formData.status}
  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
  className="border p-2 rounded"
  required
>
  <option value="">Selecciona un estat</option>
  <option value="sold">Vendida</option>
  <option value="cancelled">Cancelada</option>
</select>

            <input
              type="text"
              placeholder="Província"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Codi Postal"
              value={formData.postal_code}
              onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="País"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Any de Construcció"
              value={formData.construction_year}
              onChange={(e) => setFormData({...formData, construction_year: e.target.value})}
              className="border p-2 rounded"
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              step="0.000001"
              placeholder="Latitud"
              value={formData.latitude}
              onChange={(e) => setFormData({...formData, latitude: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="number"
              step="0.000001"
              placeholder="Longitud"
              value={formData.longitude}
              onChange={(e) => setFormData({...formData, longitude: e.target.value})}
              className="border p-2 rounded"
            />
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Habitacions"
              value={formData.bedrooms}
              onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Banys"
              value={formData.bathrooms}
              onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Àrea (m²)"
              value={formData.area_sq_meters}
              onChange={(e) => setFormData({...formData, area_sq_meters: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <select
              value={formData.property_type_id}
              onChange={(e) => setFormData({...formData, property_type_id: e.target.value})}
              className="border p-2 rounded"
            >
              <option value="1">Casa</option>
              <option value="2">Apartament</option>
              <option value="3">Xalet</option>
              <option value="4">Terreny</option>
            </select>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.has_pool}
                onChange={(e) => setFormData({...formData, has_pool: e.target.checked})}
                className="border p-2 rounded"
              />
              <span>Té piscina</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.has_garden}
                onChange={(e) => setFormData({...formData, has_garden: e.target.checked})}
                className="border p-2 rounded"
              />
              <span>Té jardí</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.has_garage}
                onChange={(e) => setFormData({...formData, has_garage: e.target.checked})}
                className="border p-2 rounded"
              />
              <span>Té garatge</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.has_elevator}
                onChange={(e) => setFormData({...formData, has_elevator: e.target.checked})}
                className="border p-2 rounded"
              />
              <span>Té ascensor</span>
            </label>
          </div>

          {/* Energy Certificate */}
          <select
            value={formData.energy_certificate}
            onChange={(e) => setFormData({...formData, energy_certificate: e.target.value})}
            className="border p-2 rounded w-full md:w-1/2"
          >
            <option value="">Selecciona Certificat Energètic</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
          </select>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? "Actualitzant..." : "Actualitzar Propietat"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView("properties");
                resetForm();
              }}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Cancel·lar
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Llistat de Propietats</h2>
            <button
              onClick={() => {
                setCurrentView("properties");
                resetForm();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Afegir Nova Propietat
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center">Carregant propietats...</div>
          ) : propertiesList.length === 0 ? (
            <div className="text-center">No hi ha propietats</div>

            ) : (
              <div className="space-y-4">
              {propertiesList.map((property) => (
              <div key={property.id} className="border p-4 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center">
              {property.primary_image_url && (
              <img src={property.primary_image_url} alt={property.title} className="w-20 h-20 object-cover rounded" />
              )}
              </div>
              <div>
              <h3 className="font-bold">{property.title}</h3>
              <p>{property.address}, {property.city}</p>
              <p>{property.price} €</p>
              </div>
              <div>
              <p>{property.bedrooms} hab. | {property.bathrooms} baños</p>
              <p>{property.m2} m²</p>
              </div>
              <div className="flex items-center space-x-2">
              <button
              onClick={() => fetchPropertyDetails(property.id)}
              className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
              disabled={isLoading}
              >
              Editar
              </button>
              <button
              onClick={() => handleDeleteProperty(property.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              disabled={isLoading}
              >
              Eliminar
              </button>
              </div>
              </div>
              </div>
              ))}
              </div>
              )}
                    {/* Property Form (shown when not editing a specific property) */}
      {!isEditing && (
        <form onSubmit={handlePropertySubmit} className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold mb-4">Afegir Nova Propietat</h2>
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Títol"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Preu"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="border p-2 rounded"
              required
            />
          </div>

          <textarea
            placeholder="Descripció"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border p-2 rounded"
            rows={4}
            required
          />

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Imatges de la propietat</label>
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded">
                <span>Seleccionar imatges</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {images.length > 0 ? `${images.length} imatges seleccionades` : "Cap imatge seleccionada"}
              </span>
            </div>
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative h-32">
                    <img
                      src={preview}
                      alt={`Previsualització ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Adreça"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <select
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="border p-2 rounded"
              required
            >
              <option value="">Selecciona una ciutat</option>
              {municipiosBages.map((municipio) => (
                <option key={municipio} value={municipio}>
                  {municipio}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Província"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Codi Postal"
              value={formData.postal_code}
              onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="País"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Any de Construcció"
              value={formData.construction_year}
              onChange={(e) => setFormData({...formData, construction_year: e.target.value})}
              className="border p-2 rounded"
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              step="0.000001"
              placeholder="Latitud"
              value={formData.latitude}
              onChange={(e) => setFormData({...formData, latitude: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="number"
              step="0.000001"
              placeholder="Longitud"
              value={formData.longitude}
              onChange={(e) => setFormData({...formData, longitude: e.target.value})}
              className="border p-2 rounded"
            />
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Habitacions"
              value={formData.bedrooms}
              onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Banys"
              value={formData.bathrooms}
              onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Àrea (m²)"
              value={formData.area_sq_meters}
              onChange={(e) => setFormData({...formData, area_sq_meters: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <select
              value={formData.property_type_id}
              onChange={(e) => setFormData({...formData, property_type_id: e.target.value})}
              className="border p-2 rounded"
            >
              <option value="1">Casa</option>
              <option value="2">Apartament</option>
              <option value="3">Xalet</option>
              <option value="4">Terreny</option>
            </select>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.has_pool}
                onChange={(e) => setFormData({...formData, has_pool: e.target.checked})}
                className="border p-2 rounded"
              />
              <span>Té piscina</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.has_garden}
                onChange={(e) => setFormData({...formData, has_garden: e.target.checked})}
                className="border p-2 rounded"
              />
              <span>Té jardí</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.has_garage}
                onChange={(e) => setFormData({...formData, has_garage: e.target.checked})}
                className="border p-2 rounded"
              />
              <span>Té garatge</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.has_elevator}
                onChange={(e) => setFormData({...formData, has_elevator: e.target.checked})}
                className="border p-2 rounded"
              />
              <span>Té ascensor</span>
            </label>
          </div>

          {/* Energy Certificate */}
          <select
            value={formData.energy_certificate}
            onChange={(e) => setFormData({...formData, energy_certificate: e.target.value})}
            className="border p-2 rounded w-full md:w-1/2"
          >
            <option value="">Selecciona Certificat Energètic</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? "Enviant..." : "Enviar Propietat"}
          </button>
        </form>
      )}
    </div>
  )}
</div>
         );
        }