import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap";

export default function ForgotPassword() {
  const [emailVerifyMsg, setEmailVerifyMsg] = useState("");
  const [disableTimer, setDisableTimer] = useState(false);
  const [timer, setTimer] = useState(0);

  const schema = yup.object().shape({
    email: yup.string().email().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(data) {
    try {
      const response = await axios.post(
        "users/forgot-password/sendEmail",
        data
      );
      setEmailVerifyMsg(response.data.message);
      toast.success(response.data.message);
      setDisableTimer(true);
      setTimer(60);
    } catch (error) {
      toast.error(error.message);
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
    <div className="row d-flex justify-content-center">
      <div className="col-md-4">
        <Form onSubmit={handleSubmit(onSubmit)} className="regForm">
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
          {emailVerifyMsg && <p className="text-success">{emailVerifyMsg}</p>}
          <Button
            variant="primary"
            type="submit"
            disabled={disableTimer}
            className="btn-lg"
          >
            {disableTimer ? `Resend link in ${timer}s` : "Send link"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
