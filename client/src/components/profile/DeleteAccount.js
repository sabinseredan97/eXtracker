import { useContext, useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { logoutUser } from "../../api/axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ShowHidePwd from "../authentication/ShowHidePwd";
import axios from "axios";
import deleteBackground from "../../images/delete.jpg";

export default function DeleteAccount() {
  const { setLoggedIn, username, setUsername } = useContext(AuthContext);
  const [logout, setLogout] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const schema = yup.object().shape({
    password: yup.string().min(7).max(20).required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { isError, error } = useQuery({
    queryKey: ["logout"],
    queryFn: logoutUser,
    enabled: logout,
  });

  let content;
  if (isError) {
    content = <h2>{error.message}</h2>;
  }

  async function onSubmit(data) {
    try {
      const response = await axios.post(`users/delete/${username}`, data);
      if (response.status === 204) {
        setLogout(true);
        setLoggedIn(false);
        setUsername(null);
      }
    } catch (error) {
      toast.warn(error.response.data.message);
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${deleteBackground})`,
        height: "100vh",
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {!logout ? (
        <div>
          {!content ? (
            <div className="text-center">
              <Card
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    Are you sure that you want to delete your account?
                  </Card.Title>
                  <Card.Text>
                    You won't be able to access this account again and all your
                    data will be lost!
                  </Card.Text>
                  <Form
                    onSubmit={handleSubmit(onSubmit)}
                    className="regForm mb-3"
                  >
                    <label className="mb-3">
                      Type your password to delete your account
                      <div className="input-group">
                        <input
                          type={passwordShown ? "text" : "password"}
                          pattern="\S*"
                          className="form-control mb-3"
                          placeholder="password"
                          {...register("password")}
                        />
                        <ShowHidePwd
                          passwordShown={passwordShown}
                          setPasswordShown={setPasswordShown}
                        />
                      </div>
                      <p className="text-danger">{errors.password?.message}</p>
                    </label>
                    <Button variant="primary" type="submit">
                      Delete account
                    </Button>
                  </Form>
                  <Card.Link href="/">Home</Card.Link>
                </Card.Body>
              </Card>
            </div>
          ) : (
            content
          )}
        </div>
      ) : (
        <div className="text-center">
          <Card style={{ width: "100%" }}>
            <Card.Body>
              <Card.Title>Your account was deleted successfully</Card.Title>
              <Card.Text>We hope you had a good stay!</Card.Text>
              <Card.Link href="/register">Create a account</Card.Link>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}
