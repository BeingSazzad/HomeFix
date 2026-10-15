import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { demoHomeowner, demoProUser } from "@/Mockdata";
import type { User, UserRole } from "@/types";

const STORAGE_KEY = "lhf-auth-role";

interface AuthState {
  user: User | null;
  hydrated: boolean;
}

function userFromRole(role: UserRole) {
  return role === "pro" ? demoProUser : demoHomeowner;
}

const initialState: AuthState = {
  user: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate(state) {
      if (typeof window === "undefined") return;
      const role = window.localStorage.getItem(STORAGE_KEY) as UserRole | null;
      state.user = role === "pro" || role === "homeowner" ? userFromRole(role) : null;
      state.hydrated = true;
    },
    loginAs(state, action: PayloadAction<UserRole>) {
      state.user = userFromRole(action.payload);
      state.hydrated = true;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, action.payload);
      }
    },
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.hydrated = true;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, action.payload.role);
      }
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload, id: state.user.id, role: state.user.role };
    },
    logout(state) {
      state.user = null;
      state.hydrated = true;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});

export const { hydrate, login, loginAs, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
