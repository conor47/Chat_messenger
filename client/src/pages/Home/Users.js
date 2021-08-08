import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Col, Image } from "react-bootstrap";
// package for conditionally joining classnames together
import classNames from "classnames";

import { useMessageDispatch, useMessageState } from "../../context/message";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      imageUrl
      createdAt
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;

function Users() {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((user) => user.selected === true);

  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }),
    onError: (err) => console.log(err),
  });
  let usersMarkup;
  if (!users || loading) {
    usersMarkup = <p>Loading ...</p>;
  } else if (users.length === 0) {
    usersMarkup = <p>No users have joined yet</p>;
  } else if (users.length > 0) {
    usersMarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          //   makes the cursor a pointer when we hover over the div
          role="button"
          className={classNames(
            "user-div d-flex p-3 justify-content-center justify-content-md-start",
            {
              //   this second arguement contains the optional classnames
              "bg-white": selected,
            }
          )}
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
        >
          <Image src={user.imageUrl} className="me-2 user-image" />

          {/* these classes are important for the responsiveness of the app. On small devices the text does not show  */}
          {/* on medium devices and up the text will show */}
          <div className="d-none d-md-block">
            <p className="text-success">{user.username}</p>
            <p className="font-weight-light">
              {user.latestMessage
                ? user.latestMessage.content
                : "You are now connected"}
            </p>
          </div>
        </div>
      );
    });
  }
  return (
    <Col xs={2} md={4} className="p-0 bg-secondary">
      {usersMarkup}
    </Col>
  );
}

export default Users;
