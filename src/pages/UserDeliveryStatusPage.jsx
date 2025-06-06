import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const UserDeliveryStatusPage = () => {
  const { orderId } = useParams(); // get orderId from URL params
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Order ID missing");
      setLoading(false);
      return;
    }
    const fetchOrder = async () => {
      try {
        const res = await fetch(`https://backend-5za1.onrender.com/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order");
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

  if (loading) return <p>Loading order status...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="user-delivery-status-container">
      <h1>Delivery Status</h1>
      <p><strong>Status:</strong> {order.status}</p>

      {order.user.lat && order.user.lng ? (
        <MapContainer
          center={[order.user.lat, order.user.lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%", borderRadius: "12px", marginTop: "1rem" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[order.user.lat, order.user.lng]}>
            <Popup>Delivery Location</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>No delivery location available.</p>
      )}
    </div>
  );
};

export default UserDeliveryStatusPage;
