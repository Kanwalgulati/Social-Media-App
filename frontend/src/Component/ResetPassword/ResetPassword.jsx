import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../../Action/User";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { message, error, loading } = useSelector((state) => state.like);
  const dispatch = useDispatch();
  const params = useParams();
  const alert = useAlert();
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
  const submitHandler = (e) => {
    e.preventDefault();
    let { token } = params;
    console.log("file: ResetPassword.jsx:16 ~ submitHandler ~ params:", params);
    dispatch(resetPassword(token, password));
  };
  return (
    <div className="resetPassword">
      <form action="" className="resetPasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>
        <input
          type="password"
          placeholder="Reset Password"
          required
          value={password}
          className="resetPasswordInputs"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Link to="/">
          <Typography>Login!</Typography>
        </Link>
        <Typography>Or</Typography>
        <Link to="/forgot/password">
          <Typography>Request Another Token</Typography>
        </Link>

        <Button type="submit" disabled={loading}>
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
