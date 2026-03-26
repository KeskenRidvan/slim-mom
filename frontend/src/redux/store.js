import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import calculatorReducer from "./calculator/calculatorSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calculator: calculatorReducer,
  },
});