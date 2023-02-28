import { Avatar, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { LoadUser, UpdateUser } from "../../Action/User";
import Loader from "../Loader/Loader";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const { loading, error, user } = useSelector((state) => state.user);
  const {
    loading: updateLoading,
    error: updateError,
    message,
  } = useSelector((state) => state.like);
  console.log(
    "file: UpdateProfile.jsx:10 ~ UpdateProfile ~ message0:",
    message
  );
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);
  console.log("file: UpdateProfile.jsx:13 ~ UpdateProfile ~ user:", user);
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (updateError) {
      alert.error(updateError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, dispatch, error, message, updateError]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(UpdateUser(name, email, avatar));
    dispatch(LoadUser());
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatarPrev(Reader.result);
        setAvatar(Reader.result);
      }
    };
  };
  return loading ? (
    <Loader />
  ) : (
    <div className="updateProfile">
      <form className="updateProfileForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>
        <Avatar
          src={avatarPrev}
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
          className="updateProfileInputs"
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="updateProfileInputs"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Button type="submit" disabled={updateLoading}>
          Update Profile
        </Button>
        {/* <Link to="/register">
          <Typography>New User</Typography>
        </Link> */}
      </form>
    </div>
  );
};

export default UpdateProfile;
