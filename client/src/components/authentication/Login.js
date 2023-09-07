import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap";
import ShowHidePwd from "./ShowHidePwd";
import "./login.css";

export default function Login() {
  const { user, login } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);
  const [resendLink, setResendLink] = useState(false);
  const [disableTimer, setDisableTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [disabled, setDisabled] = useState(false);

  let navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(5)
      .max(20)
      .required("Your username is required!"),
    password: yup.string().min(7).max(20).required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(data) {
    try {
      const response = await axios.post("users/login", data, {
        withCredentials: true,
      });
      if (response.status === 201) {
        setDisabled(true);
        toast.warn("Your account is not verified yet!");
        toast.success(response.data.message);
        setResendLink(true);
        setDisableTimer(true);
        setTimer(60);
      } else {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        login(response.data.username);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimer) => {
        lastTimer <= 1 && clearInterval(interval);
        if (lastTimer <= 1) setDisableTimer(false);
        return lastTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disableTimer]);

  return (
    <div className="loginContainer">
      {!user ? (
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <Form onSubmit={handleSubmit(onSubmit)} className="loginForm">
              <Form.Group className="mb-3">
                <Form.Label>Username:</Form.Label>
                <input
                  type="text"
                  pattern="\S*"
                  className="form-control"
                  placeholder={errors.username?.message}
                  {...register("username")}
                />
                <p className="text-danger">{errors.username?.message}</p>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password:</Form.Label>
                <div className="input-group">
                  <input
                    type={passwordShown ? "text" : "password"}
                    pattern="\S*"
                    className="form-control mb-3"
                    placeholder={errors.password?.message}
                    {...register("password")}
                  />
                  <ShowHidePwd
                    passwordShown={passwordShown}
                    setPasswordShown={setPasswordShown}
                  />
                </div>
                <p className="text-danger">{errors.password?.message}</p>
              </Form.Group>
              <Button
                variant="primary"
                className="btn-lg"
                type="submit"
                disabled={disabled}
              >
                Log in
              </Button>
              {resendLink && (
                <Button variant="link" type="submit" disabled={disableTimer}>
                  {disableTimer ? `Resend link in ${timer}s` : "Resend link"}
                </Button>
              )}
              <span>
                Don't have an account ?
                <Button
                  variant="link"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Create one
                </Button>
              </span>
              <Button
                variant="link"
                onClick={() => {
                  navigate("/forgot-password");
                }}
              >
                Forgot password ?
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </div>
  );
}
