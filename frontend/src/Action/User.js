import axios from "axios";
export const LoginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: "LoginRequest",
    });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      "/api/v1/login",
      { email, password },
      config
    );
    dispatch({ type: "LoginSuccess", payload: data.user });
  } catch (error) {
    dispatch({ type: "LoginFailure", payload: error.response.data.message });
  }
};
export const RegisterUser =
  (name, email, password, avatar) => async (dispatch) => {
    try {
      dispatch({
        type: "RegisterRequest",
      });
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        "/api/v1/register",
        { email, password, avatar, name },
        config
      );
      dispatch({ type: "RegisterSuccess", payload: data.user });
    } catch (error) {
      dispatch({
        type: "RegisterFailure",
        payload: error.response.data.message,
      });
    }
  };
export const UpdateUser = (name, email, avatar) => async (dispatch) => {
  try {
    dispatch({
      type: "UpdateProfileRequest",
    });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.put(
      "/api/v1/update/profile",
      { email, avatar, name },
      config
    );
    dispatch({ type: "UpdateProfileSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "UpdateProfileFailure",
      payload: error.response.data.message,
    });
  }
};
export const UpdateUserPassword =
  (oldPassword, newPassword) => async (dispatch) => {
    try {
      dispatch({
        type: "UpdatePasswordRequest",
      });
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.put(
        "/api/v1/update/password",
        { oldPassword, newPassword },
        config
      );
      dispatch({ type: "UpdatePasswordSuccess", payload: data.message });
    } catch (error) {
      dispatch({
        type: "UpdatePasswordFailure",
        payload: error.response.data.message,
      });
    }
  };
export const LoadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.get("/api/v1/me", config);
    dispatch({ type: "LoadUserSuccess", payload: data.user });
  } catch (error) {
    dispatch({ type: "LoadUserFailure", payload: error.response.data.message });
  }
};
export const DeleteUserProfile = () => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProfileRequest",
    });
    const { data } = await axios.delete("/api/v1/delete/me");
    dispatch({ type: "deleteProfileSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "deleteProfileFailure",
      payload: error.response.data.message,
    });
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({
      type: "forgotPasswordRequest",
    });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      "/api/v1/forgot/password",
      { email },
      { config }
    );
    dispatch({ type: "forgotPasswordSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "forgotPasswordFailure",
      payload: error.response.data.message,
    });
  }
};
export const resetPassword = (token, password) => async (dispatch) => {
  try {
    dispatch({
      type: "resetPasswordRequest",
    });
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.put(
      `/api/v1/reset/password/${token}`,
      { password },
      { config }
    );
    dispatch({ type: "resetPasswordSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "resetPasswordFailure",
      payload: error.response.data.message,
    });
  }
};

export const getFollowingPost = () => async (dispatch) => {
  try {
    dispatch({ type: "postOfFollowingRequest" });
    const { data } = await axios.get("/api/v1/posts");

    dispatch({
      type: "postOfFollowingSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "postOfFollowingFailure",
      payload: error.response.data.message,
    });
  }
};
export const getMyPosts = () => async (dispatch) => {
  try {
    dispatch({ type: "myPostRequest" });
    const { data } = await axios.get("/api/v1/my/posts");

    dispatch({
      type: "myPostSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "myPostFailure",
      payload: error.response.data.message,
    });
  }
};
export const getOtherUserProfile = (id) => async (dispatch) => {
  try {
    dispatch({ type: "userProfileRequest" });
    const { data } = await axios.get(`/api/v1/user/${id}`);

    dispatch({
      type: "userProfileSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "userProfileFailure",
      payload: error.response.data.message,
    });
  }
};
export const getOtherUserPosts = (id) => async (dispatch) => {
  try {
    dispatch({ type: "userPostsRequest" });
    const { data } = await axios.get(`/api/v1/userPosts/${id}`);

    dispatch({
      type: "userPostsSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "userPostsFailure",
      payload: error.response.data.message,
    });
  }
};
export const getAllUsers =
  (name = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: "allUsersRequest" });
      const { data } = await axios.get(`/api/v1/users?name=${name}`);

      dispatch({
        type: "allUsersSuccess",
        payload: data.users,
      });
    } catch (error) {
      dispatch({
        type: "allUsersFailure",
        payload: error.response.data.message,
      });
    }
  };

export const LogoutUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LogoutUserRequest",
    });

    const { data } = await axios.get("/api/v1/logout");
    dispatch({ type: "LogoutUserSuccess" });
  } catch (error) {
    dispatch({
      type: "LogoutUserFailure",
      payload: error.response.data.message,
    });
  }
};

export const FollwoAndUnfollowUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: "followUserRequest" });
    const { data } = await axios.get(`/api/v1/follow/${id}`);

    dispatch({
      type: "followUserSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "followUserFailure",
      payload: error.response.data.message,
    });
  }
};
