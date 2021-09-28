import React from 'react';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  createHttpLink,
  split,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

let httpLink = createHttpLink({
  uri: '/graphql/',
});

// this is like an intercepter for all of our requests. We are adding an authorization header to every HTTP request
// Here we are pulling the login token from local storage for each request

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// initialising a webSocket link can be seen in the Apollo docs. These next code blocks are responsible
// for that

httpLink = authLink.concat(httpLink);

const host = window.location.host;

const wsLink = new WebSocketLink({
  uri: `ws://${host}/graphql/`,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
});

// split is a function that checks if the incomming request is a query or mutation or a subscription.
// If its a query or mutation then we use the httpLink. If its a subscription then we use the
// Web socket link

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default function ApolloProvider(props) {
  return <Provider client={client} {...props} />;
}
