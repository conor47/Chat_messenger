import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import ApolloProvider from "./apolloProvider";

import "./App.scss";

import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";

function App() {
  return (
    <ApolloProvider>
      <BrowserRouter>
        <Container className="pt-5">
          {/* we use the exact keyword as if not then it will look for anything after the '/' in path */}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
