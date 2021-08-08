import React, { Fragment } from "react";
import { Button, Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../../context/auth";

import Users from "./Users";
import Messages from "./Messages";

export default function Home({ history }) {
  const dispatch = useAuthDispatch();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
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
