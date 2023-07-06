import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { logoutUser } from "../api/axios";
import jwtInterceptor from "../interceptors/axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ShowHidePwd from "./authentication/ShowHidePwd";

export default function DeleteAccount() {
  const { user, dispatch } = useContext(AuthContext);
  const [logout, setLogout] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  let navigate = useNavigate();

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
    const response = await jwtInterceptor.post(`users/delete/${user}`, data);
    if (response.status === 204) {
      setLogout(true);
      dispatch({ type: "LOGOUT" });
    }
    toast.warn(response.response.data.message);
  }

  return (
    <>
      <div>
        {!logout ? (
          <div>
            {!content ? (
              <div>
                <h2>Are you sure that you want to delete your account?</h2>
                <h2>
                  You won't be able to access this account again and all your
                  data will be lost!
                </h2>
                <div className="row d-flex justify-content-left">
                  <div className="col-md-4">
                    <Form onSubmit={handleSubmit(onSubmit)} className="regForm">
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
                        <p className="text-danger">
                          {errors.password?.message}
                        </p>
                      </label>
                      <Button variant="primary" type="submit">
                        Delete account
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            ) : (
              content
            )}
          </div>
        ) : (
          <div>
            <h1>Your account was deleted successfully</h1>
            <p>We hope you had a good stay!</p>
            <Button variant="primary" onClick={() => navigate("/register")}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
