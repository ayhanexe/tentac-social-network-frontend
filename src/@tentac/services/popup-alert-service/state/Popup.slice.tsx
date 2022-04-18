import { createSlice } from "@reduxjs/toolkit";
import { setShowing } from "./Popup.actions";
import { initialPopupServiceState } from "./Popup.state";

export const authenticationSlice = createSlice({
  name: "authenticationSlice",
  initialState: initialPopupServiceState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(setShowing, (state, action) => {
      state.isShowing = action.payload;
    }),
});

export default authenticationSlice.reducer;
