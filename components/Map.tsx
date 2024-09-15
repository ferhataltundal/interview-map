"use client";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Popup,
} from "react-leaflet";
import useMarkerStore from "@/zustand/marker";
import { useEffect } from "react";

const createIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path fill="${color}" stroke="black" stroke-width="2" d="M16 0C9 0 4 5 4 12c0 7 8 18 12 18s12-11 12-18C28 5 23 0 16 0z"/>
        <circle cx="16" cy="12" r="6" fill="white"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
};

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);

  return null;
};

const SavedLocationsMap = () => {
  const { savedLocations } = useMarkerStore();

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {savedLocations.map((location, index) => (
        <Marker
          key={index}
          icon={createIcon(location?.color)}
          position={[location.lat, location.lng] as LatLngExpression}
        >
          <Popup>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold">
                {location?.locationName}
              </span>
              <span className="text-xs">
                {location.lat?.toFixed(3)}, {location.lng?.toFixed(3)}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export function MapComponent() {
  const { marker, setMarker, savedLocations } = useMarkerStore();

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setMarker({
          ...marker,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    return null;
  };

  return savedLocations.length > 0 ? (
    <SavedLocationsMap />
  ) : (
    <MapContainer
      center={[marker?.lat ?? 0, marker?.lng ?? 0]}
      zoom={3}
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      <RecenterMap lat={marker.lat ?? 0} lng={marker.lng ?? 0} />
      {Boolean(marker.lat && marker.lng) && (
        <Marker
          position={{ lng: marker?.lng ?? 0, lat: marker?.lat ?? 0 }}
          icon={createIcon(marker?.color)}
        >
          <Popup>
            <div className="flex flex-col gap-1">
              <span className="text-xs">
                {marker.lat?.toFixed(3)}, {marker.lng?.toFixed(3)}
              </span>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
