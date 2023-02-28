import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteUserProfile, getMyPosts, LogoutUser } from "../../Action/User";
import Post from "../../Post/Post";
import { getUserAvatar } from "../Home/Home";
import Loader from "../Loader/Loader";
import User from "../User/User";
import "./Account.css";

const Account = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, posts } = useSelector((state) => state.myPosts);
  const {
    error: likeError,
    message,
    loading: deleteLoading,
  } = useSelector((state) => state.like);
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);

  useEffect(() => {
    dispatch(getMyPosts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (likeError) {
      alert.error(likeError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, likeError, message, dispatch, error]);

  const logoutHandler = async () => {
    await dispatch(LogoutUser());
    alert.success("Logged out successfully");
  };

  const deleteProfileHandler = () => {
    dispatch(DeleteUserProfile());
    dispatch(LogoutUser());
  };

  return loading || userLoading ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountleft">
        {posts && posts.length ? (
          posts.map((post) => {
            let { caption, owner, image, comments, likes, _id } = post;
            return (
              <Post
                key={_id}
                ownerName={user.name}
                postId={_id}
                postImage={image.url}
                likes={likes}
                comments={comments}
                caption={caption}
                ownerImage={getUserAvatar(user.avatar.url)}
                ownerId={user._id}
                isAccount="me"
                isDelete={true}
              />
            );
          })
        ) : (
          <Typography variant="h3">No Posts to show</Typography>
        )}
      </div>
      <div className="accountright">
        <Avatar
          src={getUserAvatar(user.avatar.url)}
          sx={{ height: "8vmax", width: "8vmax" }}
        />
        <Typography variant="h5">{user.name}</Typography>
        <div>
          <button onClick={() => setFollowersToggle(!followersToggle)}>
            <Typography>Followers</Typography>
          </button>
          <Typography>{user.followers.length}</Typography>
        </div>
        <div>
          <button onClick={() => setFollowingToggle(!followingToggle)}>
            <Typography>Following</Typography>
          </button>
          <Typography>{user.following.length}</Typography>
        </div>
        <div>
          <Typography>Posts</Typography>
          <Typography>{user.posts.length}</Typography>
        </div>
        <Button variant="contained" onClick={logoutHandler}>
          Logout
        </Button>
        <Link to={`/update/profile`}>Edit Profile</Link>
        <Link to={`/update/password`}>Change Password</Link>
        <Button
          variant="text"
          style={{ color: "red", margin: "2vmax" }}
          onClick={deleteProfileHandler}
          disabled={deleteLoading}
        >
          Delete My Profile
        </Button>
        <Dialog
          open={followersToggle}
          onClose={() => {
            setFollowersToggle(!followersToggle);
          }}
        >
          <div className="DialogBox">
            <Typography variant="h4">Followers</Typography>
            {user && user.followers.length ? (
              user.followers.length.map((follower) => {
                return (
                  <User
                    key={follower._id}
                    userId={follower._id}
                    name={follower.name}
                    avatar={follower.avatar.url}
                  />
                );
              })
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                You have no followers
              </Typography>
            )}
          </div>
        </Dialog>
        <Dialog
          open={followingToggle}
          onClose={() => {
            setFollowingToggle(!followingToggle);
          }}
        >
          <div className="DialogBox">
            <Typography variant="h4">Following</Typography>
            {user && user.following.length ? (
              user.following.map((follow) => {
                return (
                  <User
                    key={follow._id}
                    userId={follow._id}
                    name={follow.name}
                    avatar={getUserAvatar(follow?.avatar?.url)}
                  />
                );
              })
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                You're not following anyone
              </Typography>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Account;
