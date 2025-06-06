import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const UserDeliveryStatusPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`https://backend-5za1.onrender.com/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order data.");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-gray-400 text-center mt-6">Loading order status...</p>;
  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;
  if (!order) return <p className="text-yellow-400 text-center mt-6">Order not found.</p>;

  const { user, status } = order;
  const { name, phone, address, lat, lng } = user || {};

  return (
    <div className="max-w-3xl mx-auto p-6 bg-zinc-900 text-white rounded-lg shadow-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Status</h1>
      <p><strong>Status:</strong> {status}</p>
      {name && <p><strong>Recipient:</strong> {name}</p>}
      {phone && <p><strong>Phone:</strong> {phone}</p>}
      {address && <p><strong>Address:</strong> {address}</p>}

      {lat && lng ? (
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%", borderRadius: "12px", marginTop: "1rem" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[lat, lng]}>
            <Popup>Delivery Location</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p className="mt-4 text-orange-400">No delivery location available.</p>
      )}
    </div>
  );
};

export default UserDeliveryStatusPage;
