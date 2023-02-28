import React, { useEffect, useState } from "react";
import "./Login.css";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../../Action/User";
import { useAlert } from "react-alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error } = useSelector((state) => state.user);
  const { error: logoutError, message } = useSelector((state) => state.like);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (logoutError) {
      alert.error(logoutError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [error, alert, dispatch, logoutError, message]);

  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(LoginUser(email, password));
  };
  return (
    <div className="login">
      <form action="" className="loginForm" onSubmit={loginHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Link to="/forgot/password">
          <Typography> Forgot Password</Typography>
        </Link>
        <Button type="submit">Login</Button>
        <Link to="/register">
          <Typography>New User</Typography>
        </Link>
      </form>
    </div>
  );
};

export default Login;
