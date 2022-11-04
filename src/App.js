import React, { useEffect, useState } from "react";

import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

import Alert from "react-bootstrap/Alert";

import { API } from "./Api/config";
import { SportingEvent } from "./Api/propTypes";
import DateSelectorInput from "./Features/DateSelectorInput";
import FullScreenControl from "./Features/FullScreenControl";
import PopOverlay from "./Features/PopOverlay";
import RadioModeButton from "./Features/RadioModeButton";
import SearchableDataList from "./Features/SearchableDataList";
import TileLayer from "./Features/TileLayer";
import {
  currentYearMonthDay,
  initialMapZoom,
  munichCoordinates,
  radioDateRangeId,
  radioSingleDateId,
  selectACountry,
  selectAState,
} from "./Utils/constants";
import Map from "./Map/Map";
import { fetchUri } from "./Utils/fetching";
import {
  addOneDay,
  convertMDYtoHumanFormat,
  dateIsInThePast,
  MainAlert,
  regionSpecificZoom,
  setMapCenterLog,
} from "./Utils/runtime";

const App = () => {
  const [mapCenter, setMapCenter] = useState(munichCoordinates);
  const [mapZoom, setMapZoom] = useState(initialMapZoom);

  const refreshMap = (latitude, longitude, countryObject) => {
    regionSpecificZoom(countryObject, setMapZoom);
    setMapCenterLog(latitude, longitude, setMapCenter);
  };

  const [monoSearchMode, setMonoSearchMode] = useState(true);
  const [startDate, setStartDate] = useState(currentYearMonthDay);
  const [endDate, setEndDate] = useState(currentYearMonthDay);

  const handleStartDateInputChange = (event) => {
    if (monoSearchMode) {
      setEndDate(event.target.value);
    }
    setStartDate(event.target.value);
  };

  const handleDateRadioChange = (event) => {
    const { name, value } = event.target;

    setMonoSearchMode(name === radioSingleDateId);

    if (name === radioSingleDateId) {
      setStartDate(currentYearMonthDay);
      setEndDate(currentYearMonthDay);
    }
    if (name === radioDateRangeId) {
      setEndDate(addOneDay(startDate));
    }
  };

  const [sportingEvents, setSportingEvents] = useState([]);
  const [mainAlert, setMainAlert] = useState(new MainAlert("primary", "Welcome to Road Games"));

  const validateDates = () => {
    console.debug(`start ${startDate}`);
    console.debug(`end ${endDate}`);

    const prefix = `Start ${!monoSearchMode ? "and end" : ""} date must be`;
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
  };

  const [countries, setCountries] = useState(undefined);
  const [countriesPlaceholder, setCountriesPlaceholder] = useState("Fetching countries...");

  useEffect(() => {
    fetchUri(API.countriesUri)
      .then((response) => {
        setCountries(response);
        setCountriesPlaceholder(selectACountry);
      })
      .catch((error) =>
        setMainAlert(new MainAlert("danger", `Error='${error}' ${API.countriesBase}, see browser console.`))
      );
  }, []);

  const handleCountryBlur = (event) => {
    setStates(undefined);
    document.getElementById("datalist-states-id").value = "";

    const userCountryInput = event.target.value;
    console.debug(`userCountryInput=${userCountryInput}`);
    const userCountry = countries.find((country) => country.name === userCountryInput);

    if (userCountry) {
      refreshMap(userCountry.longitude, userCountry.latitude, userCountry);
      setMainAlert(new MainAlert("info", `${userCountry.emoji} ${userCountry.name}`));

      fetchUri(API.statesUri(userCountry.name))
        .then((states) => {
          setStates(states);
          setStatesPlaceholder(states.length === 0 ? "No states found" : selectAState);
        })
        .catch((error) =>
          setMainAlert(
            new MainAlert("danger", `Error='${error}' ${API.statesBase(userCountry.name)}, see browser console.`)
          )
        );
    } else {
      setStates(undefined);
      const message =
        userCountryInput === "" ? selectACountry : `${selectACountry}  invalid input '${userCountryInput}'`;
      setMainAlert(new MainAlert("warning", message));
    }
  };

  const [states, setStates] = useState(undefined);
  const [statesPlaceholder, setStatesPlaceholder] = useState("States or Provinces");

  const handleStatesBlur = (event) => {
    const userStateInput = event.target.value;
    console.debug(`userStateInput=${userStateInput}`);

    const activeCountryName = document.getElementById("datalist-country-id").value;
    const countryObject = countries.find((country) => country.name === activeCountryName);
    const prefix = `${countryObject.emoji} ${countryObject.name}`;

    const stateObject = states.find((state) => state.name === userStateInput);
    if (stateObject) {
      refreshMap(stateObject.longitude, stateObject.latitude, countryObject);
      setMainAlert(new MainAlert("info", `${prefix} - ${userStateInput}`));
    } else {
      const message = userStateInput === "" ? selectAState : `invalid state input'${userStateInput}'`;
      setMainAlert(new MainAlert("warning", `${prefix} - ${message}`));
    }
  };

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

  useEffect(() => {
    const eventPluralization = sportingEvents.length === 1 ? "event" : "events";
    const start = convertMDYtoHumanFormat(startDate);
    const end = convertMDYtoHumanFormat(endDate);

    let betweenDatesMessage = `sporting ${eventPluralization} between ${start} and ${end}`;
    if (startDate === endDate) {
      startDate === currentYearMonthDay
        ? (betweenDatesMessage = `sporting ${eventPluralization} today`)
        : (betweenDatesMessage = `sporting ${eventPluralization} on ${start}`);
    }

    if (sportingEvents.length > 0) {
      setMainAlert(new MainAlert("success", `Found ${sportingEvents.length} ${betweenDatesMessage}`));
    } else {
      setMainAlert(new MainAlert("dark", `Found no ${betweenDatesMessage}`));
    }
  }, [sportingEvents]);

  return (
    <>
      <div className="container-fluid">
        <div className="container-fluid input-group-text m-1">
          <SearchableDataList
            inputId="datalist-country-id"
            dataListId="datalist-country-options"
            placeholder={countriesPlaceholder}
            disabled={false}
            onBlur={handleCountryBlur}
            options={
              countries &&
              countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.emoji} {country.iso2}
                </option>
              ))
            }
          />
          <SearchableDataList
            inputId="datalist-states-id"
            dataListId="datalist-states-options"
            placeholder={statesPlaceholder}
            onBlur={handleStatesBlur}
            disabled={states === undefined || (states && states.length === 0)}
            options={states ? states.map((state) => <option key={state.id} value={state.name} />) : ""}
          />
        </div>
        <div className="container-fluid input-group-text m-1">
          <RadioModeButton
            id={radioSingleDateId}
            checked={monoSearchMode}
            onchange={handleDateRadioChange}
            labelClassName={monoSearchMode ? "btn btn-outline-success" : "btn btn-outline-danger"}
            labelValue="Single Day"
          />
          <DateSelectorInput name="start-date-input" value={startDate} onChange={handleStartDateInputChange} />
          {!monoSearchMode && (
            <DateSelectorInput name="end-date-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          )}
          <RadioModeButton
            id={radioDateRangeId}
            checked={!monoSearchMode}
            onchange={handleDateRadioChange}
            labelClassName={!monoSearchMode ? "btn btn-outline-success" : "btn btn-outline-danger"}
            labelValue="Date Range"
          />
        </div>
        <button type="button" className="form-control btn btn-primary" onClick={() => validateDates()}>
          Search
        </button>
        <Alert className="form-control" key="main-alert" variant={mainAlert.variant}>
          {mainAlert.body}
        </Alert>
      </div>
      <div>
        <Map center={fromLonLat(mapCenter)} zoom={mapZoom} sportingEvents={sportingEvents}>
          <TileLayer source={new OSM()} zIndex={0} />
          <FullScreenControl />
        </Map>
        {sportingEvents &&
          sportingEvents.length > 0 &&
          sportingEvents.map((sportingEvent) => {
            // console.debug(sportingEvent);
            return <PopOverlay key={sportingEvent.key} sportingEvent={sportingEvent} />;
          })}
        <hr />
      </div>
    </>
  );
};

export default App;
