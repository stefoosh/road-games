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

    this.key = `${this.StadiumID}-${this.homeTeam}`;
    this.markerId = `${this.StadiumID}-marker`;
    this.popoverId = `${this.StadiumID}-popover`;
    this.labelId = `${this.StadiumID}-label`;
  }

  static shape() {
    return PropTypes.shape({
      stadiumId: PropTypes.number.isRequired,
      location: PropTypes.object.isRequired,
      sport: PropTypes.string.isRequired,
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
      stadiumId: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    });
  }
};
