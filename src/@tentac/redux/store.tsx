import { configureStore } from "@reduxjs/toolkit";
import authenticationServiceReducer from "../services/authentication-service/state/Authentication.slice";
import popupServiceReducer from "../services/popup-alert-service/state/Popup.slice";

export const store = configureStore({
  preloadedState: {
    auth: {
      user: null,
    },
  },
  reducer: {
    auth: authenticationServiceReducer,
    popup: popupServiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
