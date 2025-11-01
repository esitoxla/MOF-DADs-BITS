import { configureStore } from "@reduxjs/toolkit";
import budgetReducer from "../store/features/budgetSlice"
import userReducer from "../store/features/userSlice"
import authReducer from "../store/features/authSlice"
import reportReducer from "../store/features/reportSlice"

export const store = configureStore({
    reducer: {
       budget: budgetReducer,
       user:  userReducer,
       auth: authReducer,
       report: reportReducer
    }
})