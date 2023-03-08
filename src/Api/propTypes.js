import PropTypes from "prop-types";

export const SportingEvent = class SportingEvent {
  constructor(stadiumId, sport, location, status, day, dateTime, dateTimeUtc, updated, awayTeam, homeTeam) {
    this.StadiumID = stadiumId;
    this.sport = sport;
    this.location = location;
    this.status = status;
    this.day = day;
    this.dateTime = dateTime;
    this.dateTimeUtc = dateTimeUtc;
    this.updated = updated;
    this.awayTeam = awayTeam;
    this.homeTeam = homeTeam;

    this.key = `${this.sport}-${this.StadiumID}-${this.dateTimeUtc}`;
    this.markerId = `${this.key}-marker`;
    this.popoverId = `${this.key}-popover`;
    this.labelId = `${this.key}-label`;
  }

  static shape() {
    return PropTypes.shape({
      StadiumID: PropTypes.number.isRequired,
      sport: PropTypes.string.isRequired,
      location: Location.shape(),
      status: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      dateTime: PropTypes.string.isRequired,
      dateTimeUtc: PropTypes.string.isRequired,
      updated: PropTypes.string.isRequired,
      awayTeam: PropTypes.string.isRequired,
      homeTeam: PropTypes.string.isRequired,

      key: PropTypes.string.isRequired,
      markerId: PropTypes.string.isRequired,
      popoverId: PropTypes.string.isRequired,
      labelId: PropTypes.string.isRequired,
    });
  }
};

export const Location = class Location {
  constructor(stadiumId, name, city, state, country, geoLat, geoLong, capacity) {
    this.stadiumId = stadiumId;
    this.name = name;
    this.city = city;
    this.state = state;
    this.country = country;
    this.latitude = geoLat;
    this.longitude = geoLong;
    this.capacity = capacity;
  }

  static shape() {
    return PropTypes.shape({
      capacity: PropTypes.number.isRequired,
      city: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      stadiumId: PropTypes.number.isRequired,
      state: PropTypes.string.isRequired,
    });
  }
};
