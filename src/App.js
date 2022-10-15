import React, {useEffect, useState} from "react";
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector } from "./Source";
import { fromLonLat, get } from "ol/proj";
// import GeoJSON from "ol/format/GeoJSON";
import { Controls, FullScreenControl } from "./Controls";
// import FeatureStyles from "./Features/Styles";
import Form from "react-bootstrap/Form";

import mapConfig from "./config.json";
import "./App.css";

// const geojsonObject = mapConfig.geojsonObject;
// const geojsonObject2 = mapConfig.geojsonObject2;
const markersLonLat = [mapConfig.KauffmanStadium, mapConfig.BuschStadium, mapConfig.tulsa];

const addMarkers = (lonLatArray) => {
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: mapConfig.markerImage32,
    }),
  });
  let features = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle);
    return feature;
  });
  return features;
}

const App = () => {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(6);

  // const [showLayer1, setShowLayer1] = useState(true);
  // const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(true);

  const [features, setFeatures] = useState(addMarkers(markersLonLat));

  const currentYearMonthDay = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(currentYearMonthDay);
  const [endDate, setEndDate] = useState(currentYearMonthDay);

  const searchDateRange = () => {
    console.log("StartDate", startDate);
    console.log("EndDate", endDate);

  }

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
        <button type="submit" className="btn btn-primary mb-3" onClick={() => searchDateRange()}>Confirm identity</button>

      <Map center={fromLonLat(center)} zoom={zoom}>
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {/*{showLayer1 && (*/}
          {/*  <VectorLayer*/}
          {/*    source={vector({*/}
          {/*      features: new GeoJSON().readFeatures(geojsonObject, {*/}
          {/*        featureProjection: get("EPSG:3857"),*/}
          {/*      }),*/}
          {/*    })}*/}
          {/*    style={FeatureStyles.MultiPolygon}*/}
          {/*  />*/}
          {/*)}*/}
          {/*{showLayer2 && (*/}
          {/*  <VectorLayer*/}
          {/*    source={vector({*/}
          {/*      features: new GeoJSON().readFeatures(geojsonObject2, {*/}
          {/*        featureProjection: get("EPSG:3857"),*/}
          {/*      }),*/}
          {/*    })}*/}
          {/*    style={FeatureStyles.MultiPolygon}*/}
          {/*  />*/}
          {/*)}*/}
          {showMarker && <VectorLayer source={vector({ features })} />}
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>
      <div>
      {/*  <input*/}
      {/*    type="checkbox"*/}
      {/*    checked={showLayer1}*/}
      {/*    onChange={(event) => setShowLayer1(event.target.checked)}*/}
      {/*  />{" "}*/}
      {/*  Johnson County*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  <input*/}
      {/*    type="checkbox"*/}
      {/*    checked={showLayer2}*/}
      {/*    onChange={(event) => setShowLayer2(event.target.checked)}*/}
      {/*  />{" "}*/}
      {/*  Wyandotte County*/}
      </div>
      <hr />

          <input
              type="checkbox"
              checked={showMarker}
              onChange={(event) => setShowMarker(event.target.checked)}
          />{" "}
          Show markers
    </div>
  );
};

export default App;
