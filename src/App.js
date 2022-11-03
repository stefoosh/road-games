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

  const currentYearMonthDay = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(currentYearMonthDay);
  const [endDate, setEndDate] = useState(currentYearMonthDay);

  const handleDateRadioChange = (event, source) => {
    setMonoMode(source === radioOne);

    if (source === radioOne) {
      setStartDate(currentYearMonthDay);
      setEndDate(currentYearMonthDay);
    }
    if (source === radioTwo) {
      const result = new Date(startDate);
      result.setDate(result.getDate() + 1);
      setEndDate(result.toISOString().split("T")[0]);
    }
  };

  const handleStartDateInputChange = (event) => {
    if (monoMode) {
      setEndDate(event.target.value);
    }
    setStartDate(event.target.value);
  };

  class MainAlert {
    constructor(variant, body) {
      this.variant = variant;
      this.body = body;
    }
  }
  const [mainAlert, setMainAlert] = useState(new MainAlert("primary", "Welcome to Road Games"));

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

  const dateIsInThePast = (date) => {
    return new Date(date).getTime() < new Date(currentYearMonthDay).getTime();
  };

  const searchDateRange = () => {
    consoleDebug(`start ${startDate}`);
    consoleDebug(`end ${endDate}`);
    const prefix = `Start ${!monoMode ? "and end" : ""} date must be`;
    if (startDate === "" || endDate === "" || startDate === undefined || endDate === undefined) {
      setMainAlert(new MainAlert("warning", `${prefix} defined`));
      return;
    }
    if (dateIsInThePast(startDate) || dateIsInThePast(endDate)) {
      setMainAlert(new MainAlert("warning", `${prefix} today or in the future`));
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

  const convertMDYtoHumanFormat = (mdy) => {
    return new Date(mdy).toDateString();
  };

  useEffect(() => {
    const eventPluralization = sportingEvents.length === 1 ? "event" : "events";
    const start = convertMDYtoHumanFormat(startDate);
    const end = convertMDYtoHumanFormat(endDate);

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
          id="radio-single-day-outlined-id"
          autoComplete="off"
          checked={monoMode}
          onChange={(e) => handleDateRadioChange(e, radioOne)}
        />
        <label
          className={monoMode ? "btn btn-outline-success" : "btn btn-outline-danger"}
          htmlFor="radio-single-day-outlined-id"
        >
          Single Day
        </label>
        <input
          type="radio"
          className="btn-check"
          name="options-outlined"
          id="radio-date-range-outlined-id"
          autoComplete="off"
          checked={!monoMode}
          onChange={(e) => handleDateRadioChange(e, radioTwo)}
        />

        <label
          className={!monoMode ? "btn btn-outline-success" : "btn btn-outline-danger"}
          htmlFor="radio-date-range-outlined-id"
        >
          Date Range
        </label>

        <br />

        <DateSelectorInput
          name="start-date-input"
          placeholder={!monoMode ? "Between" : ""}
          value={startDate}
          onChange={handleStartDateInputChange}
        />
        {!monoMode && (
          <DateSelectorInput
            name="end-date-input"
            placeholder="and"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        )}
        <button type="button" className="form-control btn btn-primary" onClick={() => searchDateRange()}>
          Search
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
