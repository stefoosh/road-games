import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

import * as ol from "ol";
import Overlay from "ol/Overlay";

import { fromLonLat } from "ol/proj";
import "./Map.css";
import MapContext from "./MapContext";
import { SportingEvent } from "../Api/propTypes";

const Map = ({ children, zoom, center, sportingEvents }) => {
  const consoleDebug = (message) => console.debug(`Map: ${message}`);

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

  const overlayHash = (overlays) => {
    let sum = 0.0;
    overlays.forEach((overlay) => {
      sum += parseFloat(overlay.getPosition()[0]) + parseFloat(overlay.getPosition()[1]);
    });
    return sum;
  };

  useEffect(() => {
    if (map) {
      const oldHash = overlayHash(map.getOverlays());
      const newOverlays = [];

      sportingEvents.forEach((sportingEvent) => {
        const marker = new Overlay({
          position: fromLonLat(sportingEvent.lonLat),
          positioning: "center-center",
          element: document.getElementById(sportingEvent.markerId),
          stopEvent: false,
        });
        newOverlays.push(marker);

        const label = new Overlay({
          position: fromLonLat(sportingEvent.lonLat),
          element: document.getElementById(sportingEvent.labelId),
        });
        newOverlays.push(label);
      });

      const newHash = overlayHash(newOverlays);

      if (oldHash === 0) {
        consoleDebug("First render");
      } else if (oldHash === newHash) {
        consoleDebug("These overlays are the same");
      } else {
        consoleDebug("Change of overlays");
        map.getOverlays().clear();
      }
      newOverlays.forEach((newOverlay) => {
        map.addOverlay(newOverlay);
      });
    } else {
      consoleDebug("Rendering");
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
