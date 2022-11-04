import { currentYearMonthDay, initialMapZoom } from "./constants";

export const addOneDay = (givenDay) => {
  const result = new Date(givenDay);
  result.setDate(result.getDate() + 1);
  return result.toISOString().split("T")[0];
};

export const dateIsInThePast = (date) => {
  return new Date(date).getTime() < new Date(currentYearMonthDay).getTime();
};

export const convertMDYtoHumanFormat = (mdy) => {
  return new Date(mdy).toDateString();
};

export const regionSpecificZoom = (userCountry, setMapZoom) => {
  switch (userCountry) {
    case userCountry.region === "Europe":
      setMapZoom(7);
      break;
  }

  if (userCountry.region === "Europe") {
    setMapZoom(7);
  } else if (userCountry.subregion === "North America") {
    setMapZoom(5);
  } else if (userCountry.subregion === "South America") {
    setMapZoom(5);
  } else if (userCountry.name === "Australia") {
    setMapZoom(5);
  } else {
    setMapZoom(initialMapZoom);
  }
};

export const setMapCenterLog = (longitude, latitude, setMapCenter) => {
  if (longitude === "" || longitude === undefined || longitude === null) {
    console.error(`longitude=${longitude}`);
    return;
  }
  if (latitude === "" || latitude === undefined || latitude === null) {
    console.error(`latitude=${latitude}`);
    return;
  }

  const coordinates = [longitude, latitude];
  console.debug(`centering=${coordinates}`);
  setMapCenter(coordinates);
};

export const MainAlert = class MainAlert {
  constructor(variant, body) {
    this.variant = variant;
    this.body = body;
  }
};
