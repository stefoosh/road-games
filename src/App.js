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
  const consoleDebug = (message) => console.debug(`App: ${message}`);

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
      setSportingEvents([new SportingEvent(1, [0.1276, 51.5072], "LondonPremiere", "Spurs")]);
    } else if (startDate === currentYearMonthDay && endDate === "2022-11-08") {
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
    consoleDebug(`start ${startDate}`);
    consoleDebug(`end ${endDate}`);
    if (startDate === "" || endDate === "" || startDate === undefined || endDate === undefined) {
      setMainAlert(new MainAlert("warning", "Both start date and end date must be defined"));
      return;
    }
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      setMainAlert(new MainAlert("warning", "Start date must be before end date"));
      return;
    }
    mockFetch();
  };

  useEffect(() => {
    searchDateRange();
  }, []);

  const convertYmdToHumanFormat = (yyyymmdd) => {
    return new Date(yyyymmdd).toDateString();
  };

  useEffect(() => {
    const eventPluralization = sportingEvents.length === 1 ? "event" : "events";
    const start = convertYmdToHumanFormat(startDate);
    const end = convertYmdToHumanFormat(endDate);

    let betweenDatesMessage = `sporting ${eventPluralization} between ${start} and ${end}`;
    if (startDate === endDate) {
      if (startDate === currentYearMonthDay) {
        betweenDatesMessage = `sporting ${eventPluralization} today`;
      } else {
        betweenDatesMessage = `sporting ${eventPluralization} on ${start}`;
      }
    }

    if (sportingEvents.length > 0) {
      setMainAlert(new MainAlert("success", `Found ${sportingEvents.length} ${betweenDatesMessage}`));
    } else {
      setMainAlert(new MainAlert("secondary", `Found no ${betweenDatesMessage}`));
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
      {sportingEvents &&
        sportingEvents.length > 0 &&
        sportingEvents.map((sportingEvent) => {
          // consoleDebug(sportingEvent);
          return <PopOverlay key={sportingEvent.key} sportingEvent={sportingEvent} />;
        })}
      <hr />
    </div>
  );
};

export default App;
