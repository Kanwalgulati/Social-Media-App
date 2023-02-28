import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  FollwoAndUnfollowUser,
  getOtherUserPosts,
  getOtherUserProfile,
} from "../../Action/User";
import Post from "../../Post/Post";
import { getUserAvatar } from "../Home/Home";
import Loader from "../Loader/Loader";
import User from "../User/User";

const UserProfile = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, posts } = useSelector(
    (state) => state.otherUserPosts
  );
  const {
    error: likeError,
    message,
    loading: followLoading,
  } = useSelector((state) => state.like);
  const {
    user,
    loading: userLoading,
    error: otherUserError,
  } = useSelector((state) => state.otherUserProfile);
  const { user: me } = useSelector((state) => state.user);
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);
  const params = useParams();
  useEffect(() => {
    dispatch(getOtherUserPosts(params.id));
    dispatch(getOtherUserProfile(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (user) {
      user.followers.forEach((follower) => {
        if (follower._id === me._id) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      });
    }
    if (me?._id === params.id) {
      setMyProfile(true);
    }
  }, [user, me._id, params.id]);
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (likeError) {
      alert.error(likeError);
      dispatch({ type: "clearErrors" });
    }
    if (otherUserError) {
      alert.error(otherUserError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, likeError, message, dispatch, error, otherUserError]);

  const followHandler = async () => {
    setFollowing(!following);
    await dispatch(FollwoAndUnfollowUser(user._id));
    dispatch(getOtherUserProfile(params.id));
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
                ownerName={user?.name}
                postId={_id}
                postImage={image.url}
                likes={likes}
                comments={comments}
                caption={caption}
                ownerImage={getUserAvatar(user?.avatar.url)}
                ownerId={user?._id}
                fromOtherUser={true}
                // isAccount="otherUser"
              />
            );
          })
        ) : (
          <Typography variant="h3">
            {user?.name} has not made any Posts{" "}
          </Typography>
        )}
      </div>
      <div className="accountright">
        <Avatar
          src={getUserAvatar(user?.avatar.url)}
          sx={{ height: "8vmax", width: "8vmax" }}
        />
        <Typography variant="h5">{user?.name}</Typography>
        <div>
          <button onClick={() => setFollowersToggle(!followersToggle)}>
            <Typography>Followers</Typography>
          </button>
          <Typography>{user?.followers.length}</Typography>
        </div>
        <div>
          <button onClick={() => setFollowingToggle(!followingToggle)}>
            <Typography>Following</Typography>
          </button>
          <Typography>{user?.following.length}</Typography>
        </div>
        <div>
          <Typography>Posts</Typography>
          <Typography>{user?.posts.length}</Typography>
        </div>
        {myProfile ? null : (
          <Button
            variant="contained"
            onClick={followHandler}
            style={{ backgroundColor: following ? "red" : "" }}
            disabled={followLoading}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}

        <Dialog
          open={followersToggle}
          onClose={() => {
            setFollowersToggle(!followersToggle);
          }}
        >
          <div className="DialogBox">
            <Typography variant="h4">Followers</Typography>
            {user && user?.followers.length ? (
              user?.followers.map((follower) => {
                console.log(
                  "file: UserProfile.jsx:143 ~ user?.followers.map ~ follower:",
                  follower
                );
                return (
                  <User
                    key={follower._id}
                    userId={follower._id}
                    name={follower.name}
                    avatar={getUserAvatar(follower?.avatar?.url)}
                  />
                );
              })
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                {user?.name} have no followers
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
            {user && user?.following.length ? (
              user?.following.map((follow) => {
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
                {user?.name} is not following anyone
              </Typography>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;
