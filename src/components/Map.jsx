import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import Flag from "./Flag";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useLocalCities } from "../contexts/LocalCitiesContext.jsx";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";

export default function Map() {
  const { cities } = useLocalCities();
  const [mapPosition, setMapPosition] = useState([20.5937, 78.9629]);

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );
  useEffect(
    function () {
      // console.log(geolocationPosition);
      if (
        geolocationPosition &&
        geolocationPosition.lat &&
        geolocationPosition.lng
      ) {
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
      }
    },
    [geolocationPosition]
  );
  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "...Loading" : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        {cities.map((city) => (
          <Marker
            position={[city?.position.lat, city?.position.lng]}
            key={city.id}
          >
            <Popup>
              <span style={{ maxHeight: "2.8rem", height: "2.8rem" }}>
                <Flag countryCode={city.countryCode} />
              </span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        {/* <ChangeCenter position={[mapLat || 20.5937, mapLng || 78.9629]} /> */}
        <ChangeCenter position={mapPosition} />

        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
