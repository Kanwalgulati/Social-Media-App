import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

export const userReducer = createReducer(initialState, {
  LoginRequest: (state) => {
    state.loading = true;
  },
  LoginSuccess: (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload;
  },
  LoginFailure: (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.error = action.payload;
  },

  RegisterRequest: (state) => {
    state.loading = true;
  },
  RegisterSuccess: (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload;
  },
  RegisterFailure: (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.error = action.payload;
  },

  LoadUserRequest: (state) => {
    state.loading = true;
  },
  LoadUserSuccess: (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload;
  },
  LoadUserFailure: (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.error = action.payload;
  },
  LogoutUserRequest: (state) => {
    state.loading = true;
  },
  LogoutUserSuccess: (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.user = null;
  },
  LogoutUserFailure: (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
});

export const postOfFollowingReducer = createReducer(
  {},
  {
    postOfFollowingRequest: (state) => {
      state.loading = true;
    },
    postOfFollowingSuccess: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    },
    postOfFollowingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  }
);
export const allUsersReducer = createReducer(
  {},
  {
    allUsersRequest: (state) => {
      state.loading = true;
    },
    allUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    allUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  }
);
