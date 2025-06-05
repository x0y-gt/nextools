import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

export interface Location {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  /** Initial location for the map */
  initialLocation?: Location;
  /** Callback executed whenever a location is selected */
  onChange?: (location: Location) => void;
  /** Map height class */
  className?: string;
}

function ClickHandler({ onSelect }: { onSelect: (loc: Location) => void }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({
  initialLocation = { lat: 0, lng: 0 },
  onChange,
  className = "h-64 w-full",
}: LocationPickerProps) {
  const [position, setPosition] = useState<Location>(initialLocation);

  const handleSelect = (loc: Location) => {
    setPosition(loc);
    onChange?.(loc);
  };

  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={13}
      scrollWheelZoom={true}
      className={className}
    >
      <TileLayer
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[position.lat, position.lng]} />
      <ClickHandler onSelect={handleSelect} />
    </MapContainer>
  );
}
