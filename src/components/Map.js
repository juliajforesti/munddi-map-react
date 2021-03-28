import React, { useEffect, useState, useCallback } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import munddiApi from "../apis/munddi.config";
import { Slide } from "react-awesome-reveal";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import Search from "./Search";
import List from "./List";
import { CgDetailsMore, CgClose } from "react-icons/cg";

const Map = () => {
  const [map, setMap] = useState(null);
  const [points, setPoints] = useState([]);
  const [toggleSearch, setToggleSearch] = useState(true);
  const [searchResult, setSearchResult] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [position, setPosition] = useState({
    lat: -23.53974278720173,
    lng: -46.72131030304516,
  });
  const [bounds, setBounds] = useState({
    _northEast: {
      lat: -21,
      lng: -43,
    },
    _southWest: {
      lat: -25,
      lng: -49,
    },
  });

  // toggle search icon click
  const handleToggle = () => setToggleSearch(!toggleSearch);

  // filter search
  const filterSearch = (input) => {
    const filtered = points.filter((point) =>
      point.name.toLowerCase().includes(input.toLowerCase())
    );
    setSearchResult([...filtered]);
  };

  // setting boundaries and position to map current position
  const onMove = useCallback(() => {
    setPosition(map.getCenter());
    setBounds(map.getBounds());
  }, [map]);

  useEffect(() => {
    if (map) {
      map.on("move", onMove);
      return () => {
        map.off("move", onMove);
      };
    }
  }, [map, onMove]);

  // fetching data from munddi endpoint
  // first fetch
  useEffect(() => {
    (async function () {
      try {
        const response = await munddiApi.get(
          `/pdvs?ne_lat=-21&ne_lng=-43&sw_lat=-25&sw_lng=-49`
        );
        console.log(response.data);
        setPoints([...response.data.data]);
        setSearchResult([...response.data.data]);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  // updating result with view boundaries
  useEffect(() => {
    (async function () {
      try {
        const response = await munddiApi.get(
          `/pdvs?ne_lat=${bounds._northEast.lat}&ne_lng=${bounds._northEast.lng}&sw_lat=${bounds._southWest.lat}&sw_lng=${bounds._southWest.lng}`
        );
        console.log(response.data);
        setSearchResult([...response.data.data]);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [bounds]);

  return (
    <>
      <div className="main-page">
        <div className="menu-container">
          {toggleSearch ? (
            <CgDetailsMore
              size="3em"
              onClick={handleToggle}
              className="menu-icon"
            />
          ) : (
            <Slide className="menu-box" damping={0.2} direction="left">
              <div className="menu">
                <div className="search-container">
                  <CgClose size="2em" onClick={handleToggle} color="white" />
                  <Search
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    filterSearch={filterSearch}
                  />
                </div>
                <List
                  points={searchResult}
                  map={map}
                  setPosition={setPosition}
                />
              </div>
            </Slide>
          )}
        </div>

        <div className="map-container">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={8}
            whenCreated={setMap}
            scrollWheelZoom={false}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {searchResult.map((point) => (
              <Marker position={[point.lat, point.lng]}>
                <Popup>
                  <h5>{point.name} </h5>
                  <p>{point.street}</p>
                  <p>
                    {point.city} / {point.uf}
                  </p>
                </Popup>
              </Marker>
            ))}
            <ZoomControl position="bottomright" />
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default Map;
