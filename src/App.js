import React, { useEffect, useState } from "react";

import { fromLonLat } from "ol/proj";
import * as olSource from "ol/source";

import "ol/ol.css";
import "./App.css";

import Map from "./Map/Map";
import TileLayer from "./Features/TileLayer";
import FullScreenControl from "./Features/FullScreenControl";
import { SportingEvent } from "./Api/propTypes";

import * as bootstrap from "bootstrap";
import PopOverlay from "./Features/PopOverlay";
window.bootstrap = bootstrap;

const App = () => {
  const layerSource = new olSource.OSM();
  const munster = [7.62571, 51.96236];
  const [center, setCenter] = useState(munster);
  const [zoom, setZoom] = useState(5);

  const sportingEvents = [
    new SportingEvent(696969, [16.3725, 48.208889], "Vienna Action", "I am content"),
    new SportingEvent(123, [8.80777, 53.07516], "Bremen Fußball", "Herkunft"),
  ];

  const currentYearMonthDay = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(currentYearMonthDay);
  const [endDate, setEndDate] = useState(currentYearMonthDay);

  const searchDateRange = () => {
    console.debug("StartDate", startDate);
    console.debug("EndDate", endDate);
  };

  return (
    <div>
      <label htmlFor="startdate">Lower Bound</label>
      <input
        type="date"
        name="startdate"
        placeholder="Start date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label htmlFor="enddate">Upper Bound</label>
      <input
        type="date"
        name="enddate"
        placeholder="End date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button type="submit" className="btn btn-primary mb-3" onClick={() => searchDateRange()}>
        Search
      </button>
      <Map center={fromLonLat(center)} zoom={zoom} sportingEvents={sportingEvents}>
        <TileLayer source={layerSource} zIndex={0} />
        <FullScreenControl />
      </Map>
      {sportingEvents ? (
        sportingEvents.length > 0 ? (
          sportingEvents.map((sportingEvent) => {
            console.debug(sportingEvent);
            return <PopOverlay key={sportingEvent.key} sportingEvent={sportingEvent} />;
          })
        ) : (
          <div>
            <p>No sporting events found</p>
          </div>
        )
      ) : (
        <div>
          <p>loading sporting events</p>
        </div>
      )}
      <hr />
    </div>
  );
};

export default App;
