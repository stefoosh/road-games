export const API = class API {
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
};
