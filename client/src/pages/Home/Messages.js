import React, { useEffect, Fragment, useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Col, Form } from "react-bootstrap";
import { useMessageState, useMessageDispatch } from "../../context/message";

import Message from "./Message";

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      reactions {
        uuid
        content
      }
    }
  }
`;

function Messages() {
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();
  const [content, setContent] = useState("");

  const selectedUser = users?.find((user) => user.selected === true);
  const messages = selectedUser?.messages;

  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);

  const submitMessage = (e) => {
    e.preventDefault();

    if (content.trim() === "" || !selectedUser) return;

    setContent("");

    //mutation for sending the message

    sendMessage({ variables: { to: selectedUser.username, content } });
  };

  let selectedChatMarkup;
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className="info-text">Select a friend</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p className="info-text">Loading ...</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => (
      // we add a workaround to stop the margin of the last message collapsing with the margin of the parent.
      // To do so we target this last child element and add an invisible div to this element.
      <Fragment key={message.uuid}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages.length === 0) {
    selectedChatMarkup = (
      <p className="info-text">
        You are now connected! Send your first message
      </p>
    );
  }

  return (
    <Col xs={10} md={8} className="p-0">
      <div className="messages-box d-flex flex-column-reverse p-3">
        {selectedChatMarkup}
      </div>
      <div className="px-3 py-2">
        <Form onSubmit={submitMessage}>
          <Form.Group className="my-3 d-flex align-items-center m-0">
            <Form.Control
              type="text"
              className="message-input p-2 rounded-pill bg-secondary border-0"
              placeholder="type a message ..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <i
              class="fas fa-paper-plane fa-2x text-primary mx-2"
              onClick={submitMessage}
              role="button"
            ></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
}

export default Messages;
