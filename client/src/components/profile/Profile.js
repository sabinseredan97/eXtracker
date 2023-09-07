import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Card, ListGroup, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../../api/axios";
import defaultUserLogo from "../../logo/defaultUserLogo.png";
import appBackground from "../../images/app-background.jpg";

export default function Profile() {
  const { user } = useContext(AuthContext);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getUserData(user),
  });

  let content;
  if (isLoading) {
    content = (
      <div className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span>Loading...</span>
        </Spinner>
      </div>
    );
  } else if (isError) {
    content = <p>{error.message}</p>;
  }

  return (
    <div
      className="text-center"
      style={{
        backgroundImage: `url(${appBackground})`,
        height: "93.9vh",
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {!content ? (
        <Card style={{ width: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <Card.Body>
            <Card.Title className="text-white">
              <img
                className="userAvatar"
                variant="top"
                src={defaultUserLogo}
                alt="user"
              />{" "}
              {user}
            </Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item
              className="text-white"
              style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            >
              Email: {data?.email}
            </ListGroup.Item>
            <ListGroup.Item
              className="text-white"
              style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            >
              Account created at:{" "}
              {data?.createdAt.substring(0, data?.createdAt.indexOf("T"))}
            </ListGroup.Item>
            {data?.verified && (
              <ListGroup.Item
                className="text-white"
                style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
              >
                Account verified
              </ListGroup.Item>
            )}
          </ListGroup>
          <Card.Body style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
            <Card.Link as={Link} to="/delete-account">
              Delete your account
            </Card.Link>
            <Card.Link as={Link} to="/">
              Home
            </Card.Link>
          </Card.Body>
        </Card>
      ) : (
        content
      )}
    </div>
  );
}
