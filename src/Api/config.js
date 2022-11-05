export const API = class API {
  static scheme = process.env.NODE_ENV === "production" ? "https" : "http";

  static fqdn =
    window.location.hostname === "road-games.stefoo.sh" && process.env.NODE_ENV === "production"
      ? "road-games-api-prod-hella-jr-39q261.mo2.mogenius.io"
      : window.location.hostname.endsWith(".road-games.pages.dev")
      ? "116.86.138.123:8080"
      : "0.0.0.0:8080";

  static url = `${API.scheme}://${API.fqdn}`;

  static countriesBase = "/regional/countries";
  static countriesUri = API.url + API.countriesBase;

  static statesBase = (countryName) => {
    return `/regional/states?country_name=${countryName}`;
  };
  static statesUri = (countryName) => {
    return API.url + API.statesBase(countryName);
  };
};
