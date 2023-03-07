import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
// import { SportingEvent } from "../Api/propTypes";

const PopOverlay = ({ sportingEvent }) => {
  const markerId = `${sportingEvent.StadiumID}-marker`;
  const labelId = `${sportingEvent.StadiumID}-label`;
  const popoverId = `${sportingEvent.StadiumID}-popover`;

  const sportEmoji = (sportName) => {
    switch (sportName) {
      case "nhl":
        return "🏒";
      default:
        return "📅";
    }
  };
  return (
    <div>
      <div className="marker" id={markerId} title="Marker"></div>
      <OverlayTrigger
        trigger="click"
        key={sportingEvent.StadiumID}
        placement="top"
        rootClose="true"
        overlay={
          <Popover id={popoverId}>
            <Popover.Header as="h3">{sportingEvent.DateTime}</Popover.Header>
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
        <a className="label" id={labelId} target="_blank">
          [{sportingEvent.sport.toUpperCase()}] {sportEmoji(sportingEvent.sport)} {sportingEvent.HomeTeam} vs{" "}
          {sportingEvent.AwayTeam}
        </a>
      </OverlayTrigger>
    </div>
  );
};

// PopOverlay.propTypes = {
//   sportingEvent: SportingEvent.shape().isRequired,
// };
export default PopOverlay;
