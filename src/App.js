import React, { useEffect, useState } from "react";

import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

import Alert from "react-bootstrap/Alert";

import Map from "./Map/Map";
import TileLayer from "./Features/TileLayer";
import FullScreenControl from "./Features/FullScreenControl";
import PopOverlay from "./Features/PopOverlay";
import DateSelectorInput from "./Features/DateSelectorInput";
import { SportingEvent } from "./Api/propTypes";

const App = () => {
  class MainAlert {
    constructor(variant, body) {
      this.variant = variant;
      this.body = body;
    }
  }
  const [mainAlert, setMainAlert] = useState(new MainAlert("primary", "Welcome to Road Games"));

  const currentYearMonthDay = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(currentYearMonthDay);
  const [endDate, setEndDate] = useState(currentYearMonthDay);

  const resetToToday = () => {
    setStartDate(currentYearMonthDay);
    setEndDate(currentYearMonthDay);
  };

  const [sportingEvents, setSportingEvents] = useState([]);

  const mockFetch = () => {
    if (startDate === currentYearMonthDay && endDate === currentYearMonthDay) {
      console.debug("Today was searched");
      setSportingEvents([new SportingEvent(1, [0.1276, 51.5072], "LondonPremiere", "Spurs")]);
    } else if (startDate === currentYearMonthDay && endDate === "2022-11-08") {
      console.debug("B's b-day was searched");
      const mockApi = [
        new SportingEvent(696969, [16.3725, 48.208889], "Vienna Action", "I am content"),
        new SportingEvent(123, [8.80777, 53.07516], "Bremen Fußball", "Herkunft"),
      ];
      setSportingEvents(mockApi);
    } else {
      setSportingEvents([]);
    }
  };

  const searchDateRange = () => {
    console.debug("startDate", startDate);
    console.debug("endDate", endDate);
    if (startDate === "" || endDate === "") {
      setMainAlert(new MainAlert("warning", "Both start date and end date must be defined."));
      return;
    }
    mockFetch();
  };

  useEffect(() => {
    searchDateRange();
  }, []);

  useEffect(() => {
    const betweenDates = `sporting events between ${startDate} and ${endDate}`;
    if (sportingEvents.length > 0) {
      setMainAlert(new MainAlert("success", `Found ${sportingEvents.length} ${betweenDates}`));
    } else {
      setMainAlert(new MainAlert("secondary", `Found zero ${betweenDates}`));
    }
  }, [sportingEvents]);

  const munster = [7.62571, 51.96236];
  const [center, setCenter] = useState(munster);
  const [zoom, setZoom] = useState(5);

  return (
    <div>
      <DateSelectorInput
        name="startDate"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <DateSelectorInput
        name="endDate"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button type="submit" className="btn btn-primary mb-3" onClick={() => searchDateRange()}>
        Search
      </button>
      <button type="submit" className="btn btn-primary mb-3" onClick={() => resetToToday()}>
        Reset to Today
      </button>
      <Alert key="main-alert" variant={mainAlert.variant}>
        {mainAlert.body}
      </Alert>
      <Map center={fromLonLat(center)} zoom={zoom} sportingEvents={sportingEvents}>
        <TileLayer source={new OSM()} zIndex={0} />
        <FullScreenControl />
      </Map>
      {sportingEvents ? (
        sportingEvents.length > 0 ? (
          sportingEvents.map((sportingEvent) => {
            // console.debug(sportingEvent);
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
