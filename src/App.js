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
import RadioModeButton from "./Features/RadioModeButton";
import { fetchUri } from "./Utils/fetching";
import SearchableDataList from "./Features/SearchableDataList";

const App = () => {
  const munich = [11.582, 48.1351];
  const [mapCenter, setMapCenter] = useState(munich);
  const [mapZoom, setMapZoom] = useState(4.5);

  const [monoMode, setMonoMode] = useState(true);

  const currentYearMonthDay = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(currentYearMonthDay);
  const [endDate, setEndDate] = useState(currentYearMonthDay);
  const radioSingleDateId = "radio-single-day-id";
  const radioDateRangeId = "radio-date-range-id";

  const handleStartDateInputChange = (event) => {
    if (monoMode) {
      setEndDate(event.target.value);
    }
    setStartDate(event.target.value);
  };

  const handleDateRadioChange = (event) => {
    const { name, value } = event.target;
    // console.debug(`${name}=${value}`);
    // console.debug(`Setting monoMode=${monoMode}`);

    setMonoMode(name === radioSingleDateId);

    if (name === radioSingleDateId) {
      setStartDate(currentYearMonthDay);
      setEndDate(currentYearMonthDay);
    }
    if (name === radioDateRangeId) {
      const result = new Date(startDate);
      result.setDate(result.getDate() + 1);
      setEndDate(result.toISOString().split("T")[0]);
    }
  };

  const [sportingEvents, setSportingEvents] = useState([]);

  const dateIsInThePast = (date) => {
    return new Date(date).getTime() < new Date(currentYearMonthDay).getTime();
  };

  const convertMDYtoHumanFormat = (mdy) => {
    return new Date(mdy).toDateString();
  };

  class MainAlert {
    constructor(variant, body) {
      this.variant = variant;
      this.body = body;
    }
  }

  const [mainAlert, setMainAlert] = useState(new MainAlert("primary", "Welcome to Road Games"));

  const validateDates = () => {
    console.debug(`start ${startDate}`);
    console.debug(`end ${endDate}`);
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
  };

  class API {
    static scheme = process.env.NODE_ENV === "production" ? "https" : "http";
    static fqdn =
      process.env.NODE_ENV === "production" ? "road-games-api-prod-hella-jr-39q261.mo2.mogenius.io" : "0.0.0.0:8080";
    static url = `${API.scheme}://${API.fqdn}`;

    static countriesBase = "/regional/countries";
    static countriesUri = API.url + API.countriesBase;

    static statesBase = (countryName) => {
      return `/regional/states?country_name=${countryName}`;
    };
    static statesUri = (countryName) => {
      return API.url + API.statesBase(countryName);
    };

    constructor() {
      // const windowLocationHostname = window.location.hostname;
    }
  }

  const [countries, setCountries] = useState(undefined);
  const [countriesPlaceholder, setCountriesPlaceholder] = useState("Fetching countries...");
  const [states, setStates] = useState(undefined);
  const [statesPlaceholder, setStatesPlaceholder] = useState("States or Provinces");

  const selectACountry = "Select a country...";

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

  const regionSpecificZoom = (userCountry) => {
    if (userCountry.region === "Europe") {
      setMapZoom(7);
    } else if (userCountry.subregion === "North America") {
      setMapZoom(5);
    } else if (userCountry.subregion === "South America") {
      setMapZoom(5);
    } else if (userCountry.name === "Australia") {
      setMapZoom(5);
    }
  };

  const handleCountryBlur = (event) => {
    setStates(undefined);
    document.getElementById("datalist-states-id").value = "";

    const userCountryInput = event.target.value;
    console.debug(`userCountryInput=${userCountryInput}`);
    const userCountry = countries.find((country) => country.name === userCountryInput);

    if (userCountry) {
      const newMapCenter = [userCountry.longitude, userCountry.latitude];
      console.debug(`newMapCenter=${newMapCenter}`);
      setMapCenter(newMapCenter);
      regionSpecificZoom(userCountry);
      setMainAlert(new MainAlert("info", `${userCountry.emoji} ${userCountry.name}`));

      fetchUri(API.statesUri(userCountry.name))
        .then((states) => {
          setStates(states);
          setStatesPlaceholder("Select a state/province/region...");
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

  const handleStatesBlur = (event) => {
    const { name, value } = event.target;
    console.debug(`${name}=${value}`);
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
            disabled={states === undefined}
            options={states ? states.map((state) => <option key={state.id} value={state.name} />) : ""}
          />
        </div>
        <div className="container-fluid input-group-text m-1">
          <RadioModeButton
            id={radioSingleDateId}
            checked={monoMode}
            onchange={handleDateRadioChange}
            labelClassName={monoMode ? "btn btn-outline-success" : "btn btn-outline-danger"}
            labelValue="Single Day"
          />
          <DateSelectorInput name="start-date-input" value={startDate} onChange={handleStartDateInputChange} />
          {!monoMode && (
            <DateSelectorInput name="end-date-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          )}
          <RadioModeButton
            id={radioDateRangeId}
            checked={!monoMode}
            onchange={handleDateRadioChange}
            labelClassName={!monoMode ? "btn btn-outline-success" : "btn btn-outline-danger"}
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
