import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { SportingEvent } from "../Api/propTypes";

const PopOverlay = ({ sportingEvent }) => {
  return (
    <div>
      <div className="marker" id={sportingEvent.markerId} title="Marker"></div>
      <OverlayTrigger
        trigger="click"
        key={sportingEvent.id}
        placement="top"
        rootClose="true"
        overlay={
          <Popover id={sportingEvent.popoverId}>
            <Popover.Header as="h3">{sportingEvent.headerLabel}</Popover.Header>
            <Popover.Body>
              <strong>Holy guacamole!</strong>
              <br />
              Check this{" "}
              <a href="https://sports.yahoo.com" target="_blank">
                otherUniqueObjectContent={sportingEvent.popoverContent}
              </a>
              <br />
              {JSON.stringify(sportingEvent.lonLat)}
            </Popover.Body>
          </Popover>
        }
      >
        <a className="label" id={sportingEvent.labelId} target="_blank">
          {sportingEvent.headerLabel}
        </a>
      </OverlayTrigger>
    </div>
  );
};

PopOverlay.propTypes = {
  sportingEvent: SportingEvent.shape().isRequired,
};
export default PopOverlay;
