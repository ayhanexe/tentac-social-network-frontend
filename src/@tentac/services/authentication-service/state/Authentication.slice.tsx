import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { initialAuthenticationServiceState } from "./Authentication.state";
import { addUserInfo } from "./Authentication.actions";

export const authenticationSlice = createSlice({
  name: "authenticationSlice",
  initialState: initialAuthenticationServiceState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(addUserInfo, (state, action) => {
      state.user = action.payload;
    }),
});

export default authenticationSlice.reducer;
