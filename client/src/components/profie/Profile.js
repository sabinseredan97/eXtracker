import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../../api/axios";

export default function Profile() {
  const { username } = useContext(AuthContext);
  let navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getUserData(username),
  });

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  }

  return (
    <>
      <div>
        <div>
          <h1>Hello {username}</h1>
          <h3>This is your profile page</h3>
        </div>
        {!content ? (
          <div>
            <h4>Your account was created at {data?.createdAt}</h4>
            <h4>Your email: {data?.email}</h4>
            {data?.verified && <h4>Email verified!</h4>}
            <div>
              <Button
                variant="link"
                onClick={() => navigate("/delete-account")}
              >
                Delete your account!
              </Button>
            </div>
          </div>
        ) : (
          content
        )}
      </div>
    </>
  );
}
