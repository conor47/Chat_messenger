import React, { Fragment, useEffect } from "react";
import { Button, Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSubscription, gql } from "@apollo/client";

import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";

import Users from "./Users";
import Messages from "./Messages";

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

export default function Home({ history }) {
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();

  const { user } = useAuthState();

  // here we are aliasing the data and error variables
  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

  useEffect(() => {
    if (messageError) console.log(messageError);

    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;

      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message,
        },
      });
    }
  }, [messageError, messageData]);

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    // now when we log out the entire app will be reloaded. This was an easy fix to the logout login and the
    // users being displayed wrong issue
    window.location.href = "/login";
  };

  return (
    <Fragment>
      <Nav className="justify-content-around bg-white mb-1">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Nav>
      <Row className="bg-white mx-0">
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
}
