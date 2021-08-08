import React from "react";
import { useAuthState } from "../../context/auth";
import classNames from "classnames";
import moment from "moment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// component for displaying a single message

function Message({ message }) {
  const { user } = useAuthState();
  //   logic to determine if a message is received or sent. We make use of the authContext to get our own username
  //   we will use classnames package to apply conditional classes to distinguish sent messages from received messages
  const sent = message.from === user.username;
  const received = !sent;

  // here we are using an overlay trigger that we copied from the react bootstrap docs. This is to provide a
  // tooltip where we hover over messages

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip>
          {moment(message.createdAt).format("MMM DD, YYYY @ h:mm a")}
        </Tooltip>
      }
    >
      <div
        className={classNames("d-flex my-3", {
          "ms-auto": sent,
          "me-auto": received,
        })}
      >
        <div
          className={classNames("py-2 px-3 rounded-pill", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          <p className={classNames({ "text-white": sent })} key={message.uuid}>
            {message.content}
          </p>
        </div>
      </div>
    </OverlayTrigger>
  );
}

export default Message;
