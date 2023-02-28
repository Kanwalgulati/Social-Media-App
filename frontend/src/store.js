import { configureStore } from "@reduxjs/toolkit";
import {
  likeReducer,
  myPostsReducer,
  userPostsReducer,
  userProfileReducer,
} from "./Reducers/Post";
import {
  allUsersReducer,
  postOfFollowingReducer,
  userReducer,
} from "./Reducers/User";

const store = configureStore({
  reducer: {
    user: userReducer,
    postOfFollowing: postOfFollowingReducer,
    allUsers: allUsersReducer,
    like: likeReducer,
    myPosts: myPostsReducer,
    otherUserProfile: userProfileReducer,
    otherUserPosts: userPostsReducer,
  },
});

export default store;
