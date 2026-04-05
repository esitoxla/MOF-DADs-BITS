import { configureStore } from "@reduxjs/toolkit";
import budgetReducer from "../store/features/budgetSlice";
import userReducer from "../store/features/userSlice";
import authReducer from "../store/features/authSlice";
import reportReducer from "../store/features/reportSlice";
import revenueReducer from "../store/features/revenueSlice";
import revenueReportReducer from "../store/features/revenueReport";
import appropriationReducer from "../store/features/appropriationSlice";
import budgetDynamicReducer from "../store/features/budgetDynamicSlice";
import cashReducer from "../store/features/cashSlice";
import cashReportReducer from "../store/features/cashReportSlice"
import activityReducer from "../store/features/activitySlice"
import reallocationReducer from "../store/features/reallocationSlice"

export const store = configureStore({
  reducer: {
    budget: budgetReducer,
    user: userReducer,
    auth: authReducer,
    report: reportReducer,
    revenue: revenueReducer,
    revenueReport: revenueReportReducer,
    appropriation: appropriationReducer,
    budgetDynamic: budgetDynamicReducer,
    cash: cashReducer,
    cashReport: cashReportReducer,
    activity: activityReducer,
    reallocation: reallocationReducer
  },
});
