import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../Action/User";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { message, error } = useSelector((state) => state.like);
  const alert = useAlert();
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [message, error, dispatch, alert]);
  return (
    <div className="forgotPassword">
      <form action="" className="forgotPasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          className="forgotPasswordInputs"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <Button type="submit">Send Token</Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
