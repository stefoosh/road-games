import PropTypes from "prop-types";

export const SportingEvent = class SportingEvent {
  constructor(key, lonLat, headerLabel, popoverContent) {
    this.key = key;
    this.lonLat = lonLat;
    this.headerLabel = headerLabel;
    this.popoverContent = popoverContent;

    this.markerId = `${key}-marker`;
    this.popoverId = `${this.key}-popover`;
    this.labelId = `${key}-label`;
  }

  static shape() {
    return PropTypes.shape({
      key: PropTypes.number.isRequired,
      lonLat: PropTypes.array.isRequired,
      headerLabel: PropTypes.string.isRequired,
    });
  }
};
