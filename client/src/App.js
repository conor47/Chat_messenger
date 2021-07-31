import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Switch } from "react-router-dom";

import ApolloProvider from "./apolloProvider";

import "./App.scss";

import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";

import { AuthProvider } from "./context/auth";
import DynamicRoute from "./util/DynamicRoute";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container className="pt-5">
            {/* we use the exact keyword as if not then it will look for anything after the '/' in path */}
            <Switch>
              <DynamicRoute exact path="/" component={Home} authenticated />
              <DynamicRoute path="/register" component={Register} guest />
              <DynamicRoute path="/login" component={Login} guest />
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
