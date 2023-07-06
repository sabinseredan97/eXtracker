import { useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap";
import ShowHidePwd from "../authentication/ShowHidePwd";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confPwdShow, setConfPwdShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const params = useParams();
  let navigate = useNavigate();

  const schema = yup.object().shape({
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
    setDisabled(true);
    try {
      const response = await axios.put(
        `users/reset-password/${params.id}/${params.token}`,
        data
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="row d-flex justify-content-center">
      <div className="col-md-4">
        <Form onSubmit={handleSubmit(onSubmit)} className="regForm">
          <label className="mb-3">
            Password:
            <div className="input-group">
              <input
                type={passwordShown ? "text" : "password"}
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
          <Button
            variant="primary"
            type="submit"
            className="btn-lg"
            disabled={disabled}
          >
            Update password
          </Button>
          <span>
            <Button
              variant="link"
              onClick={() => {
                navigate("/login");
              }}
            >
              Go to log in
            </Button>
          </span>
        </Form>
      </div>
    </div>
  );
}
