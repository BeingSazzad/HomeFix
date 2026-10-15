import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import filterReducer from "@/redux/slices/filterSlice";
import intakeReducer from "@/redux/slices/intakeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filterReducer,
    intake: intakeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
