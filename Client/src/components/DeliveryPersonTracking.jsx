import DeliveryPerson from "../assets/DeliveryPerson.png";
import Location from "../assets/Location.png";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

const deliveryPersonIcon = new L.Icon({
  iconUrl: DeliveryPerson,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const locationIcon = new L.Icon({
  iconUrl: Location,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryPersonTracking = ({ data }) => {
  const deliveryPersonLat = data.deliveryPersonLocation.lat;
  const deliveryPersonlon = data.deliveryPersonLocation.lon;
  const customerLat = data.customerLocation.lat;
  const customerlon = data.customerLocation.lon;

  const path = [
    [deliveryPersonLat, deliveryPersonlon],
    [customerLat, customerlon],
  ];

  const center = [deliveryPersonLat, deliveryPersonlon];

  return (
    <div className="w-full h-100 mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer className={"w-full h-full"} center={center} zoom={16}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[deliveryPersonLat, deliveryPersonlon]}
          icon={deliveryPersonIcon}
        >
          <Popup>
            <div className="text-black">Delivery Person</div>
          </Popup>
        </Marker>

        <Marker position={[customerLat, customerlon]} icon={locationIcon}>
          <Popup>
            <div className="text-black">Customer</div>
          </Popup>
        </Marker>

        <Polyline positions={path} color="blue" weight={4} />
      </MapContainer>
    </div>
  );
};

export default DeliveryPersonTracking;
