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

  const [monoMode, setMonoMode] = useState(true);
  const radioOne = "radioOne";
  const radioTwo = "radioTwo";
  const handleDateRadioChange = (event, source) => {
    setMonoMode(source === radioOne);
  };

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
    <>
      <div className="container-fluid">
        <label htmlFor="exampleDataList" className="form-label">
          Starting Point
        </label>
        <input
          className="form-control"
          list="datalistOptions"
          id="exampleDataList"
          placeholder="Select a country..."
          onBlur={(e) => console.debug(e.target.value)}
        />
        <datalist id="datalistOptions">
          <option value="San Francisco">🌉SF</option>
          <option value="New York">NY</option>
          <option value="Seattle">SEA</option>
          <option value="Los Angeles">LA</option>
          <option value="Chicago">CHI</option>
        </datalist>

        <input
          type="radio"
          className="btn-check"
          name="options-outlined"
          id="success-outlined"
          autoComplete="off"
          checked={monoMode}
          onChange={(e) => handleDateRadioChange(e, radioOne)}
        />
        <label className="btn btn-outline-success" htmlFor="success-outlined">
          Single Day
        </label>
        <input
          type="radio"
          className="btn-check"
          name="options-outlined"
          id="danger-outlined"
          autoComplete="off"
          checked={!monoMode}
          onChange={(e) => handleDateRadioChange(e, radioTwo)}
        />
        <label className="btn btn-outline-danger" htmlFor="danger-outlined">
          Date Range
        </label>

        <br />

        <DateSelectorInput
          name="startDate"
          placeholder={!monoMode ? "Between" : ""}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        {!monoMode && (
          <DateSelectorInput
            name="endDate"
            placeholder="and"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        )}
        <button type="button" className="form-control btn btn-primary" onClick={() => searchDateRange()}>
          Search
        </button>
        <button
          type="button"
          className="form-control btn btn-primary"
          onClick={() => resetToToday()}
          disabled={startDate === endDate}
        >
          Reset to Today
        </button>
        <Alert className="form-control" key="main-alert" variant={mainAlert.variant}>
          {mainAlert.body}
        </Alert>
      </div>
      <div>
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
    </>
  );
};

export default App;
