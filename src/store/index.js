import { configureStore } from "@reduxjs/toolkit";
import budgetReducer from "../store/features/budgetSlice"

export const store = configureStore({
    reducer: {
       budget: budgetReducer 
    }
})