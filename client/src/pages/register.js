import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";

// here we are defining our register mutation. We will pass this to our usemutation hook to send mutations to
// out server

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

export default function Register() {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // the useMutation hook takes a second parameter which is an object containing lifecycle methods. These
  // are methods that will run over the lifecycle of the hook

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, res) {
      console.log(res);
    },
    onError(err) {
      // this is how we can access our errors returned by our server. This is due to how we structured our errors
      // on the server side
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();
    registerUser({ variables });
    // when the registerUser mutation is executed we can see in the network tab the response from our server
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>

        {/* for each of our form inputs we check the errors object to see if the corresponding field is 
        truthy. If it is then we add the classname of text-danger. We also change the label to display the 
        error message */}

        <Form onSubmit={submitRegisterForm}>
          <Form.Group className="mb-3">
            <Form.Label className={errors.email && "text-danger"}>
              {errors.email ?? "Email address"}
            </Form.Label>
            <Form.Control
              type="email"
              value={variables.email}
              className={errors.email && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, email: e.target.value })
              }
            />
          </Form.Group>
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
          <Form.Group className="mb-3">
            <Form.Label className={errors.confirmPassword && "text-danger"}>
              {errors.confirmPassword ?? "Confirm password"}
            </Form.Label>
            <Form.Control
              type="password"
              value={variables.confirmPassword}
              className={errors.confirmPassword && "is-invalid"}
              onChange={(e) =>
                setVariables({
                  ...variables,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading..." : "Register"}
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
