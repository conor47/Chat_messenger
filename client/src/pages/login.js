import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../context/auth";

// here we are defining our register mutation. We will pass this to our usemutation hook to send mutations to
// out server

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

export default function Register(props) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  // the useMutation hook takes a second parameter which is an object containing lifecycle methods. These
  // are methods that will run over the lifecycle of the hook

  //   note we are using the lazyquery hook as opposed to the standard queryhook. This is because regular queyrhooks
  // are called once the component loads and the hook is executed. This would work for instances where we know what
  // we are fetching, eg fetching posts, but not in the case of logging in.

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError(err) {
      // this is how we can access our errors returned by our server. This is due to how we structured our errors
      // on the server side

      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      dispatch({ type: "LOGIN", payload: data.login });
      window.location.href = "/";
    },
  });

  const submitLoginForm = (e) => {
    e.preventDefault();
    loginUser({ variables });
    // when the registerUser mutation is executed we can see in the network tab the response from our server
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>

        {/* for each of our form inputs we check the errors object to see if the corresponding field is 
        truthy. If it is then we add the classname of text-danger. We also change the label to display the 
        error message */}

        <Form onSubmit={submitLoginForm}>
          <Form.Group className="mb-3">
            <Form.Label className={errors.username && "text-danger"}>
              {errors.username ?? "Username"}
            </Form.Label>
            <Form.Control
              type="text"
              value={variables.username}
              className={errors.username && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className={errors.password && "text-danger"}>
              {errors.password ?? "Password"}
            </Form.Label>
            <Form.Control
              type="password"
              value={variables.password}
              className={errors.password && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading..." : "Login"}
            </Button>
            <br />
            <small>
              Don't have an account ?<Link to="/register">Register</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
