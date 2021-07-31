import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuthState } from "../context/auth";

// this is a custom component that we are writing to handle the different use cases of our application views.
// When a user is not logged in we do not want them to be able to view the home page. When a user is logged in
// we do not want them to view the register page

export default function DynamicRoute(props) {
  const { user } = useAuthState();

  if (props.authenticated && !user) {
    return <Redirect to="/login" />;
  } else if (props.guest && user) {
    return <Redirect to="/" />;
  } else {
    return <Route component={props.component} {...props} />;
  }
}
