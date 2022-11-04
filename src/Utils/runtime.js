import { currentYearMonthDay } from "./constants";

export const dateIsInThePast = (date) => {
  return new Date(date).getTime() < new Date(currentYearMonthDay).getTime();
};

export const convertMDYtoHumanFormat = (mdy) => {
  return new Date(mdy).toDateString();
};

export const regionSpecificZoom = (userCountry, setMapZoom) => {
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

export const MainAlert = class MainAlert {
  constructor(variant, body) {
    this.variant = variant;
    this.body = body;
  }
};
