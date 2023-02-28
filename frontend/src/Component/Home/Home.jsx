import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getFollowingPost } from "../../Action/User";
import Post from "../../Post/Post";
import Loader from "../Loader/Loader";
import User from "../User/User";
import "./Home.css";

export const getRandomNumber = () => {
  let num = Math.ceil(Math.random() * 10);
  return num;
};
export const getUserAvatar = (avatar) => {
  if (avatar && avatar.length > 10) return avatar;
  return `https://randomuser.me/api/portraits/men/${getRandomNumber()}.jpg`;
};
const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, posts, error } = useSelector(
    (state) => state.postOfFollowing
  );
  const { users, loading: usersLoading } = useSelector(
    (state) => state.allUsers
  );
  const { error: likeError, message } = useSelector((state) => state.like);
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
  useEffect(() => {
    dispatch(getFollowingPost());
    dispatch(getAllUsers());
  }, [dispatch]);
  return loading || usersLoading ? (
    <Loader />
  ) : (
    <div className="home">
      <div className="homeleft">
        {posts && posts.length ? (
          posts.map((post) => {
            let { caption, owner, image, comments, likes, _id } = post;
            return (
              <Post
                key={_id}
                ownerName={owner.name}
                postId={_id}
                postImage={image.url}
                likes={likes}
                comments={comments}
                caption={caption}
                ownerImage={getUserAvatar(owner.avatar.url)}
                ownerId={owner._id}
              />
            );
          })
        ) : (
          <Typography variant="h6"> No posts yet</Typography>
        )}
      </div>
      <div className="homeright">
        {users && users.length ? (
          users.map((user) => {
            return (
              <User
                key={user._id}
                userId={user._id}
                name={user.name}
                avatar={getUserAvatar(user.avatar.url)}
              />
            );
          })
        ) : (
          <Typography variant="h6">No Users Yet</Typography>
        )}
      </div>
    </div>
  );
};

export default Home;
