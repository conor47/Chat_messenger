import React, { useState } from "react";
import { useAuthState } from "../../context/auth";
import classNames from "classnames";
import moment from "moment";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";

// component for displaying a single message

const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($uuid: String!, $content: String!) {
    reactToMessage(uuid: $uuid, content: $content) {
      uuid
    }
  }
`;

function Message({ message }) {
  const { user } = useAuthState();

  //   logic to determine if a message is received or sent. We make use of the authContext to get our own username
  //   we will use classnames package to apply conditional classes to distinguish sent messages from received messages
  const sent = message.from.toLowerCase() === user.username.toLowerCase();
  const received = !sent;
  const [showPopover, setShowPopover] = useState(false);
  const reactionIcons = [...new Set(message.reactions.map((r) => r.content))];

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => setShowPopover(false),
  });

  const react = (reaction) => {
    reactToMessage({ variables: { uuid: message.uuid, content: reaction } });
  };

  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showPopover}
      onToggle={setShowPopover}
      transition={false}
      rootClose={true}
      overlay={
        <Popover className="rounded-pill">
          <Popover.Content className="react-button-popover d-flex align-items-center px-0 py-1">
            {reactions.map((reaction) => (
              <Button
                variant="link"
                key={reaction}
                onClick={() => react(reaction)}
                className="react-icon-button"
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2">
        <i className="far fa-smile"></i>
      </Button>
    </OverlayTrigger>
  );

  // here we are using an overlay trigger that we copied from the react bootstrap docs. This is to provide a
  // tooltip where we hover over messages

  return (
    <div
      className={classNames("d-flex my-3", {
        "ms-auto": sent,
        "me-auto": received,
      })}
    >
      {sent && reactButton}
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>
            {moment(message.createdAt).format("MMM DD, YYYY @ h:mm a")}
          </Tooltip>
        }
      >
        <div
          className={classNames("py-2 px-3 rounded-pill position-relative", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          {message.reactions.length > 0 && (
            <div className="reaction-div bg-secondary p-1 rounded-pill">
              {reactionIcons} {message.reactions.length}
            </div>
          )}
          <p className={classNames({ "text-white": sent })} key={message.uuid}>
            {message.content}
          </p>
        </div>
      </OverlayTrigger>
      {received && reactButton}
    </div>
  );
}

export default Message;
