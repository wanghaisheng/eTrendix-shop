import React, { useEffect, useRef, useState } from "react";
import { mappls, mappls_plugin } from "mappls-web-maps";
import { Link } from "react-router-dom";
import RestAPIService from "../services/RestAPIService";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

interface PlacePickerPluginProps {
  map: any; // Adjust the type according to your mappls library typings
}

const PlacePickerPlugin: React.FC<PlacePickerPluginProps> = ({ map }) => {
  const placePickerRef = useRef<any>(null);

  useEffect(() => {
    if (map && placePickerRef.current) {
      map.removeLayer(placePickerRef.current); // Adjust based on the actual API provided by mappls
    }

    var options = {
      map: map,
      search: true,
      closeBtn: false,
      topText: "Click search icon to search 👉",
      pinHeight: -1000,
    };

    placePickerRef.current = mapplsPluginObject.placePicker(options);

    return () => {
      if (map && placePickerRef.current) {
        map.removeLayer(placePickerRef.current); // Adjust based on the actual API provided by mappls
      }
    };
  }, [map]);

  return null;
};

const Mappls = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [cords, setCords] = useState({ lat: "", lng: "" });
  const [error, setError] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (err: GeolocationPositionError) => {
            setError(err.message);
            alert("Geolocation error:" + err.message);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      const { req, cancel } = RestAPIService.mappls_oauth();

      req.then((response) => {
        const authKey = response.data;

        const loadObject = {
          map: true,
          plugins: ["search"],
        };

        mapplsClassObject.initialize(authKey, loadObject, () => {
          const mapObject = mapplsClassObject.Map({
            id: "map",
            properties: {
              draggable: true,
              zoom: 15,
              geolocation: true,
              fullscreenControl: true,
              rotateControl: true,
              zoomControl: true,
              clickableIcons: true,
              traffic: true,
            },
          });

          const markerObject = mapplsClassObject.Marker({
            map: mapObject,
            position: {
              lat: latitude!,
              lng: longitude!,
            },
            icon: "https://apis.mapmyindia.com/map_v3/1.png",
          });

          mapObject.on("load", () => {
            setIsMapLoaded(true);
            if (latitude !== null && longitude !== null) {
              mapObject.setCenter([longitude!, latitude!]);
              setCords({ lat: latitude.toString(), lng: longitude.toString() });
            }

            mapObject.addListener(
              "click",
              (data: { lngLat: { lat: any; lng: any } }) => {
                markerObject.setPosition(data.lngLat);
                setCords({
                  lat: data.lngLat.lat.toString(),
                  lng: data.lngLat.lng.toString(),
                });
              }
            );
          });

          mapRef.current = mapObject;
          markerRef.current = markerObject;
        });
      });

      return () => {
        if (mapRef.current) {
          mapRef.current.remove(); // Adjust based on the actual API provided by mappls
        }
        cancel();
      };
    } catch (error) {
      console.log(error);
    }
  }, [latitude, longitude]);

  return (
    <div>
      <div className="px-15 top-space section-b-space container-fluid">
        <div
          id="map"
          style={{ width: "100%", height: "90vh", display: "inline-block" }}
        >
          {isMapLoaded && <PlacePickerPlugin map={mapRef.current} />}
        </div>
        <div className="cart-bottom row">
          <div>
            <div className="left-content col-5">
              <a href="#" className="title-color">
                RESET
              </a>
            </div>
            <Link
              to={`/pincode-select?lat=${cords.lat}&lng=${cords.lng}`}
              className="btn btn-solid col-7 text-uppercase"
            >
              Confirm
            </Link>
          </div>
        </div>
        {error && <p>Error: {error}</p>}
      </div>
    </div>
  );
};

export default Mappls;
