import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getEmailVrfTkn } from "../../api/axios";
import success from "../../logo/success.png";

export default function EmailVerify() {
  let navigate = useNavigate();
  const params = useParams();

  const { isLoading, isError, error } = useQuery({
    queryKey: ["email-verify"],
    queryFn: () => getEmailVrfTkn(params.id, params.verifyTkn),
  });

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <h2>{error.message}</h2>;
  }

  return (
    <>
      {!content ? (
        <div className="verifyEmail">
          <img className="successImg" src={success} alt="success_img" />
          <h1>Email Verified!</h1>
          <Button
            variant="primary"
            className="btn-lg"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </div>
      ) : (
        content
      )}
    </>
  );
}
