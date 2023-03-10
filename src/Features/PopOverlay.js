import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { SportingEvent } from "../Api/propTypes";

const PopOverlay = ({ sportingEvent }) => {
  const sportEmoji = (sportName) => {
    switch (sportName) {
      case "nhl":
        return "🏒";
      case "mlb":
        return "⚾";
      default:
        return "🏟️";
    }
  };
  return (
    <div>
      <div className="marker" id={sportingEvent.markerId} title="Marker"></div>
      <OverlayTrigger
        trigger="click"
        key={sportingEvent.StadiumID}
        placement="top"
        rootClose="true"
        overlay={
          <Popover id={sportingEvent.popoverId}>
            <Popover.Header as="h3">{sportingEvent.dateTime}</Popover.Header>
            <Popover.Body>
              <strong>Holy guacamole!</strong>
              <br />
              {/*<a REPLACE A LINKS WITH BUTTONS href="https://sports.yahoo.com" target="_blank" rel="noreferrer">*/}
              {/*  /!*otherUniqueObjectContent={sportingEvent.popoverContent}*!/someContentHere*/}
              {/*</a>*/}
              <br />
              {JSON.stringify(sportingEvent.location)}
            </Popover.Body>
          </Popover>
        }
      >
        <a className="label" id={sportingEvent.labelId} target="_blank">
          {sportEmoji(sportingEvent.sport)}
          {sportingEvent.awayTeam} @ {sportingEvent.homeTeam}
        </a>
      </OverlayTrigger>
    </div>
  );
};

PopOverlay.propTypes = {
  sportingEvent: SportingEvent.shape().isRequired,
};
export default PopOverlay;
