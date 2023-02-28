import { Avatar, Button, Typography, Dialog } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Post.css";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentOnPost,
  likePost,
  updatePost,
  deletePost,
} from "../Action/Post";
import {
  getFollowingPost,
  getMyPosts,
  getOtherUserPosts,
  LoadUser,
} from "../Action/User";
import User from "../Component/User/User";
import CommentCard from "../Component/CommentCard/CommentCard";
import { getUserAvatar } from "../Component/Home/Home";

const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = "",
  fromOtherUser = false,
}) => {
  const { user } = useSelector((state) => state.user);
  const getDefaultValue = () => {
    let tempLike = false;
    likes.forEach((item) => {
      if (item._id === user._id) {
        tempLike = true;
      }
    });
    return tempLike;
  };
  const [liked, setLiked] = useState(getDefaultValue);
  const [likesUser, setLikesUser] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commentToggle, setCommentToggle] = useState(false);
  const [captionValue, setCaptionValue] = useState("");
  const [captionToggle, setCaptionToggle] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const handleLike = async () => {
    dispatch(likePost(postId));
    console.log("file: Post.jsx:61 ~ handleLike ~ isAccount:", fromOtherUser);
    if (fromOtherUser) {
      await dispatch(getOtherUserPosts(params.id));
    }
    if (isAccount == "me") {
      await dispatch(getMyPosts());
    } else {
      await dispatch(getFollowingPost());
    }
    setLiked(!liked);
  };
  const addCommentHandler = async (e) => {
    e.preventDefault();
    await dispatch(addCommentOnPost(postId, commentValue));

    if (isAccount == "me") {
      dispatch(getMyPosts());
    } else {
      dispatch(getFollowingPost());
    }
  };

  const updateCaptionHandler = async (e) => {
    e.preventDefault();
    await dispatch(updatePost(captionValue, postId));
    dispatch(getMyPosts());
  };

  const deletePostHandler = async () => {
    await dispatch(deletePost(postId));
    dispatch(getMyPosts());
    dispatch(LoadUser());
  };

  return (
    <div className="post">
      <div className="postHeader">
        {
          (isAccount = "me" ? (
            <Button
              onClick={() => {
                setCaptionToggle(!captionToggle);
                setCaptionValue(caption);
              }}
            >
              <MoreVert />
            </Button>
          ) : null)
        }
      </div>
      <img src={postImage} alt="Post" />
      <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="user"
          sx={{ height: "3vmax", width: "3vmax" }}
        />
        <Link to={`/user/${ownerName}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>
        <Typography
          fontWeight={100}
          color="rgba(0,0,0,0.582)"
          style={{ alignSelf: "center" }}
        >
          {caption}
        </Typography>
      </div>
      <button
        style={{
          backgroundColor: "white",
          border: "0px",
          cursor: "pointer",
          margin: "1vmax 2vmax",
        }}
        disabled={!likes.length}
        onClick={() => {
          setLikesUser(!likesUser);
        }}
      >
        <Typography>{likes.length} Likes</Typography>
      </button>
      <div className="postFooter">
        <Button onClick={handleLike}>
          {liked ? (
            <Favorite style={{ color: "#D61355" }} />
          ) : (
            <FavoriteBorder />
          )}
        </Button>
        <Button onClick={() => setCommentToggle(!commentToggle)}>
          <ChatBubbleOutline />
        </Button>
        {isDelete && (
          <Button onClick={deletePostHandler}>
            <DeleteOutline />
          </Button>
        )}
      </div>
      <Dialog
        open={likesUser}
        onClose={() => {
          setLikesUser(!likesUser);
        }}
      >
        <div className="DialogBox">
          <Typography variant="h4">Liked By</Typography>
          {likes.map((like) => {
            return (
              <User
                key={like._id}
                userId={like._id}
                name={like.name}
                avatar={like.avatar.url}
              />
            );
          })}
        </div>
      </Dialog>
      <Dialog
        open={commentToggle}
        onClose={() => {
          setCommentToggle(!commentToggle);
        }}
      >
        <div className="DialogBox">
          <Typography variant="h4">Comments</Typography>
          <form action="" className="commentForm" onSubmit={addCommentHandler}>
            <input
              type="text"
              value={commentValue}
              onChange={(e) => {
                setCommentValue(e.target.value);
              }}
              placeholder="Comment Here ..."
              required={true}
            />
            <Button type="submit" variant="contained">
              Add
            </Button>
          </form>
          {comments.length ? (
            comments.map((comment) => {
              return (
                <CommentCard
                  key={comment._id}
                  userId={comment.user._id}
                  name={comment.user.name}
                  avatar={getUserAvatar(comment.user.avatar.url)}
                  comment={comment.comment}
                  commentId={comment._id}
                  postId={postId}
                  isAccount={isAccount}
                />
              );
            })
          ) : (
            <Typography>No Comments Yet</Typography>
          )}
        </div>
      </Dialog>
      <Dialog
        open={captionToggle}
        onClose={() => {
          setCaptionToggle(!captionToggle);
        }}
      >
        <div className="DialogBox">
          <Typography variant="h4">Update Caption</Typography>
          <form
            action=""
            className="commentForm"
            onSubmit={updateCaptionHandler}
          >
            <input
              type="text"
              value={captionValue}
              onChange={(e) => {
                setCaptionValue(e.target.value);
              }}
              placeholder="Caption Here ..."
              required={true}
            />
            <Button type="submit" variant="contained">
              Update
            </Button>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default Post;
