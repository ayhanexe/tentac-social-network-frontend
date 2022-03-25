import { createAction } from "@reduxjs/toolkit";
import { IUser } from "../../../types/auth/authTypes";

// Base Authentication Service Reducer's Actions
export const addUserInfo = createAction<IUser>("auth/saveUser");
export const logout = createAction("auth/logout");
