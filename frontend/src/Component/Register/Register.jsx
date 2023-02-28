import { Avatar, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RegisterUser } from "../../Action/User";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [alert, dispatch, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(RegisterUser(name, email, password, avatar));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatar(Reader.result);
      }
    };
  };
  return (
    <div className="register">
      <form className="registerForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>
        <Avatar
          src={avatar}
          alt="User"
          sx={{ height: "10vmax", width: "10vmax" }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="registerInputs"
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="registerInputs"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="registerInputs"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Link to="/">
          <Typography>Already Signed Up? Login Now</Typography>
        </Link>
        <Button type="submit" disabled={loading}>
          Register
        </Button>
        {/* <Link to="/register">
          <Typography>New User</Typography>
        </Link> */}
      </form>
    </div>
  );
};

export default Register;
