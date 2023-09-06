import { useState, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap";
import ShowHidePwd from "./ShowHidePwd";
import "./regForm.css";

export default function Registration() {
  const { loggedIn } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confPwdShow, setConfPwdShow] = useState(false);
  const [emailVerifyMsg, setEmailVerifyMsg] = useState("");
  const isDataSending = useRef(false);

  let navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup.string().required("Your username is required!"),
    email: yup.string().email().required(),
    password: yup.string().min(7).max(20).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords don't match!")
      .required("Confirm password is a required field"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(data) {
    isDataSending.current = true;
    try {
      const response = await axios.post("users/register", data);
      setEmailVerifyMsg(response.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
    isDataSending.current = false;
  }

  return (
    <div className="regContainer">
      {!loggedIn ? (
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <Form onSubmit={handleSubmit(onSubmit)} className="regForm">
              <label className="mb-3">
                Username:
                <input
                  type="text"
                  pattern="\S*"
                  className="form-control"
                  placeholder="username"
                  {...register("username")}
                />
                <p className="text-danger">{errors.username?.message}</p>
              </label>
              <label className="mb-3">
                Email:
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  {...register("email")}
                />
                <p className="text-danger">{errors.email?.message}</p>
              </label>
              <label className="mb-3">
                Password:
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
              <label className="mb-3">
                Confirm password:
                <div className="input-group">
                  <input
                    type={confPwdShow ? "text" : "password"}
                    pattern="\S*"
                    className="form-control mb-3"
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                  />
                  <ShowHidePwd
                    passwordShown={confPwdShow}
                    setPasswordShown={setConfPwdShow}
                  />
                </div>
                <p className="text-danger">{errors.confirmPassword?.message}</p>
              </label>
              {emailVerifyMsg && (
                <p className="text-success">{emailVerifyMsg}</p>
              )}
              <Button
                variant="primary"
                type="submit"
                className="btn-lg"
                disabled={isDataSending.current}
              >
                Register
              </Button>
              <span>
                Already have an account ?
                <Button
                  variant="link"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Log in
                </Button>
              </span>
            </Form>
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </div>
  );
}
