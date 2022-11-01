import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

import * as ol from "ol";
import Overlay from "ol/Overlay";

import { fromLonLat } from "ol/proj";
import "./Map.css";
import MapContext from "./MapContext";
import { SportingEvent } from "../Api/propTypes";

const Map = ({ children, zoom, center, sportingEvents }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: [],
    };

    let mapObject = new ol.Map(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!map) return;

    map.getView().setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    if (!map) return;

    map.getView().setCenter(center);
  }, [center]);

  useEffect(() => {
    if (map) {
      // compare existing overlays with "future" overlays and don't clear b/c the Search button was clicked twice
      map.getOverlays().clear();

      sportingEvents.forEach((sportingEvent) => {
        const marker = new Overlay({
          position: fromLonLat(sportingEvent.lonLat),
          positioning: "center-center",
          element: document.getElementById(sportingEvent.markerId),
          stopEvent: false,
        });
        map.addOverlay(marker);

        const label = new Overlay({
          position: fromLonLat(sportingEvent.lonLat),
          element: document.getElementById(sportingEvent.labelId),
        });
        map.addOverlay(label);
      });
    } else {
      console.debug("Map: waiting for map to render");
    }
  }, [map, sportingEvents]);

  return (
    <MapContext.Provider value={{ map }}>
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
    </MapContext.Provider>
  );
};

Map.propTypes = {
  sportingEvents: PropTypes.arrayOf(SportingEvent.shape()).isRequired,
};
export default Map;
