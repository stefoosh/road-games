import React, { useEffect, useState } from "react";

import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

import { API } from "./Api/config";
import { Location, SportingEvent } from "./Api/propTypes";
import DateSelectorInput from "./Features/DateSelectorInput";
import FullScreenControl from "./Features/FullScreenControl";
import PopOverlay from "./Features/PopOverlay";
import RadioModeButton from "./Features/RadioModeButton";
import SearchableDataList from "./Features/SearchableDataList";
import TileLayer from "./Features/TileLayer";
import {
  currentYearMonthDay,
  initialMapZoom,
  kansasCoordinates,
  radioDateRangeId,
  radioSingleDateId,
  selectACountry,
  selectAState,
  welcomeMessage,
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
  toUtcString,
} from "./Utils/runtime";
import { Tab, Table, Tabs } from "react-bootstrap";

const App = () => {
  const [mapCenter, setMapCenter] = useState(kansasCoordinates);
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
    // eslint-disable-next-line no-unused-vars
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

  const [checkBoxen, setCheckBoxen] = useState({
    MLB: true,
    NHL: true,
  });
  const handleCheckBoxChange = (event) => {
    event.persist();
    setCheckBoxen((prevState) => ({
      ...prevState,
      [event.target.name]: !prevState[event.target.name],
    }));
    // validateDates().then();
  };

  const instantiateSportingEvents = (response) => {
    return response.map((element) => {
      return new SportingEvent(
        element.StadiumID,
        element.sport,
        new Location(
          element.location.StadiumID,
          element.location.Name,
          element.location.City,
          element.location.State,
          element.location.Country,
          element.location.GeoLat,
          element.location.GeoLong,
          element.location.Capacity
        ),
        element.Status,
        element.Day,
        element.DateTime,
        element.DateTimeUTC,
        element.Updated,
        element.AwayTeam,
        element.HomeTeam
      );
    });
  };

  const [groupedResults, setGroupedResults] = useState({});
  const [mainAlert, setMainAlert] = useState(new MainAlert("primary", welcomeMessage));
  const validateDates = async () => {
    // console.debug(`start ${startDate}`);
    // console.debug(`end ${endDate}`);

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

    Object.entries(checkBoxen).forEach(([sportName, isChecked]) => {
      if (isChecked) {
        fetchUri(API.gamesUri(sportName.toLowerCase(), startDate, endDate))
          .then((response) => {
            setGroupedResults((prevState) => ({
              ...prevState,
              [sportName]: instantiateSportingEvents(response),
            }));
          })
          .catch((error) => {
            setMainAlert(new MainAlert("danger", `Error=${error}', see browser console.`));
          });
      } else {
        setGroupedResults((prevState) => ({
          ...prevState,
          [sportName]: [],
        }));
      }
    });
  };

  const [sportingEvents, setSportingEvents] = useState([]);
  useEffect(() => {
    if (Object.keys(groupedResults)) {
      setSportingEvents(Object.values(groupedResults).flat());
    }
  }, [groupedResults]);

  const [countries, setCountries] = useState(undefined);
  const [countriesPlaceholder, setCountriesPlaceholder] = useState("Fetching countries...");
  useEffect(() => {
    // TODO: this is still fetching twice upon initial page load
    if (countries === undefined) {
      fetchUri(API.countriesUri)
        .then((response) => {
          setCountries(response);
          setCountriesPlaceholder(selectACountry);
        })
        .catch((error) =>
          setMainAlert(new MainAlert("danger", `Error='${error}' ${API.countriesBase}, see browser console.`))
        );
    }
  }, []);

  const handleCountryBlur = (event) => {
    setStates(undefined);
    document.getElementById("datalist-states-id").value = "";

    const userCountryInput = event.target.value;
    // console.debug(`userCountryInput=${userCountryInput}`);
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
        userCountryInput === "" ? selectACountry : `${selectACountry} invalid input '${userCountryInput}'`;
      setMainAlert(new MainAlert("warning", message));
    }
  };

  const [states, setStates] = useState(undefined);
  const [statesPlaceholder, setStatesPlaceholder] = useState("States or Provinces");

  const handleStatesBlur = (event) => {
    const userStateInput = event.target.value;
    // console.debug(`userStateInput=${userStateInput}`);

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
    } else if (sportingEvents.length === 0) {
      console.info(welcomeMessage);
    } else {
      setMainAlert(new MainAlert("dark", `Found no ${betweenDatesMessage}`));
    }
  }, [endDate, sportingEvents, startDate]);

  return (
    <>
      <div className="container-fluid input-group-text m-1">
        <RadioModeButton
          id={radioSingleDateId}
          checked={monoSearchMode}
          onchange={handleDateRadioChange}
          labelClassName={monoSearchMode ? "btn btn-outline-success" : "btn btn-outline-danger"}
          labelValue="Single Day"
        />
        <RadioModeButton
          id={radioDateRangeId}
          checked={!monoSearchMode}
          onchange={handleDateRadioChange}
          labelClassName={!monoSearchMode ? "btn btn-outline-success" : "btn btn-outline-danger"}
          labelValue="Date Range"
        />
        <DateSelectorInput name="start-date-input" value={startDate} onChange={handleStartDateInputChange} />
        {!monoSearchMode && (
          <DateSelectorInput name="end-date-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        )}
        <button type="button" className="form-control btn btn-primary" onClick={() => validateDates()}>
          Search
        </button>
      </div>
      <div className="container-fluid input-group-text m-1">
        {Object.entries(checkBoxen).map(([sportName, isChecked]) => {
          return (
            <Form.Check
              inline
              id={sportName}
              key={sportName}
              label={sportName}
              name={sportName}
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckBoxChange}
            />
          );
        })}
        <Form.Check inline disabled label="NBA" name="group1" type="checkbox" id="check3" />
        <Form.Check inline disabled label="NFL" name="group1" type="checkbox" id="check3" />
        <Form.Check inline disabled label="Soccer" name="group1" type="checkbox" id="check3" />
        <SearchableDataList
          inputId="datalist-country-id"
          dataListId="datalist-country-options"
          placeholder={countriesPlaceholder}
          disabled={countries === undefined}
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
        {/*<hr />*/}
        {/*{JSON.stringify(sportingEvents, null, 2)}*/}

        <Alert className="form-control" key="main-alert" variant={mainAlert.variant}>
          {mainAlert.body}
        </Alert>
      </div>

      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
        {Object.entries(groupedResults).map(([sportName, results]) => {
          return (
            <Tab
              key={sportName}
              eventKey={sportName}
              title={sportName + "(" + results.length + ")"}
              disabled={results.length === 0}
            >
              <div className="container-fluid m-1">
                <Table striped size="sm">
                  <thead>
                    <tr>
                      <th>Sport</th>
                      <th>Away Team</th>
                      <th>Home Team</th>
                      {/*<th>Day</th>*/}
                      <th>Time</th>
                      <th>UTC</th>
                      <th>Venue</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Country</th>
                      {/*<th>Status (Last Updated)</th>*/}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((sportingEvent) => {
                      return (
                        <tr key={sportingEvent.key}>
                          <td>{sportingEvent.sport.toUpperCase()}</td>
                          <td>{sportingEvent.awayTeam}</td>
                          <td>{sportingEvent.homeTeam}</td>
                          {/*<td>{sportingEvent.day}</td>*/}
                          <td>{toUtcString(sportingEvent.dateTime)}</td>
                          <td>{toUtcString(sportingEvent.dateTimeUtc)}</td>
                          <td>{sportingEvent.location.name}</td>
                          <td>{sportingEvent.location.city}</td>
                          <td>{sportingEvent.location.state}</td>
                          <td>{sportingEvent.location.country}</td>
                          {/*<td>*/}
                          {/*  {sportingEvent.status}*/}
                          {/*  <br />({sportingEvent.updated})*/}
                          {/*</td>*/}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Tab>
          );
        })}
      </Tabs>
    </>
  );
};

export default App;
