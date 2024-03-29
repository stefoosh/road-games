export const API = class API {
  static scheme = process.env.NODE_ENV === "production" ? "https" : "http";

  static fqdn =
    process.env.NODE_ENV === "production" && window.location.hostname === "roadgames.stefoo.sh"
      ? "sportsdata-prod-hella-jr-39q261.mo2.mogenius.io"
      : window.location.hostname.endsWith(".road-games.pages.dev")
      ? "road-games-001-prod-hella-jr-39q261.mo2.mogenius.io"
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

  static gamesBase = (sportName, start, end) => {
    return `/${sportName}/games/range?start=${start}&end=${end}`;
  };

  static gamesUri = (sportName, start, end) => {
    return API.url + API.gamesBase(sportName, start, end);
  };
};
