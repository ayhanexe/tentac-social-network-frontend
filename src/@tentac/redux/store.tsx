import { configureStore } from "@reduxjs/toolkit";
import { authenticationServiceReducer } from "../services/authentication-service";

export const store = configureStore({
  preloadedState: {
    auth: {
      user: null,
    },
  },
  reducer: {
    auth: authenticationServiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
