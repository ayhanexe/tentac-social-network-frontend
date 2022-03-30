import { createAction } from "@reduxjs/toolkit";
import { IAuthUser } from "../../../types/auth/authTypes";

// Base Authentication Service Reducer's Actions
export const addUserInfo = createAction<IAuthUser>("auth/saveUser");
export const logout = createAction("auth/logout");
