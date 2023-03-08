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

    // TODO: including these dependencies causes the location overlays to not render after searching a country+state
    // }, [center, zoom]);
  }, []);

  useEffect(() => {
    if (!map) return;

    map.getView().setZoom(zoom);
  }, [map, zoom]);

  useEffect(() => {
    if (!map) return;

    map.getView().setCenter(center);
  }, [center, map]);

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
        const lonLat = [sportingEvent.location.longitude, sportingEvent.location.latitude];

        const marker = new Overlay({
          position: fromLonLat(lonLat),
          positioning: "center-center",
          element: document.getElementById(sportingEvent.markerId),
          stopEvent: false,
        });
        newOverlays.push(marker);

        const label = new Overlay({
          position: fromLonLat(lonLat),
          element: document.getElementById(sportingEvent.labelId),
        });
        newOverlays.push(label);
      });

      const newHash = overlayHash(newOverlays);

      if (oldHash === 0) {
        console.debug("First render");
      } else if (oldHash === newHash) {
        console.debug("These overlays are the same");
      } else {
        console.debug("Change of overlays");
        map.getOverlays().clear();
      }
      newOverlays.forEach((newOverlay) => {
        map.addOverlay(newOverlay);
      });
    } else {
      console.debug("Rendering");
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
