import { createSlice } from "@reduxjs/toolkit";
import { initialAuthenticationServiceState } from "./Authentication.state";
import { addUserInfo, logout } from "./Authentication.actions";

export const authenticationSlice = createSlice({
  name: "authenticationSlice",
  initialState: initialAuthenticationServiceState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(addUserInfo, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout, (state, action) => {
        state.user = null;
      }),
});

export default authenticationSlice.reducer;
