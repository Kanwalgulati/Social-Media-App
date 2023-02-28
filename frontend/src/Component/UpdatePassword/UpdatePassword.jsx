import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUserPassword } from "../../Action/User";
import "./UpdatePassword.css";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { loading, message, error } = useSelector((state) => state.like);
  const dispatch = useDispatch();
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
  }, [dispatch, error, message, alert]);

  const updatePasswordHandler = (e) => {
    e.preventDefault();
    dispatch(UpdateUserPassword(oldPassword, newPassword));
  };

  return (
    <div className="updatePassword">
      <form
        action=""
        className="updatePasswordForm"
        onSubmit={updatePasswordHandler}
      >
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>

        <input
          type="password"
          placeholder="Old Password"
          required
          className="updatePasswordInputs"
          value={oldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="New Password"
          required
          value={newPassword}
          className="updatePasswordInputs"
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />

        <Button type="submit" disabled={loading}>
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
