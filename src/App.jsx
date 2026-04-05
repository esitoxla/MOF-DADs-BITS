import { Component, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Analytics from "./pages/Analytics";
import BudgetExpenditure from "./pages/BudgetExpenditure";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import SummaryReport from "./components/SummaryReport";
import ReportLayout from "./layouts/ReportLayout";
import ReportPreview from "./pages/ReportPreview";
import Users from "./pages/Users";
import NewUser from "./components/NewUser";
import UserLayout from "./layouts/UserLayout";
import UpdateUser from "./components/UpdateUser";
import PrivateRoute from "./helpers/routesProtect";
import { Toaster } from "react-hot-toast";
import RevenueCashLayout from "./layouts/RevenueCashLayout";
import RevenueCashPage from "./pages/RevenueCashPage";
import RevenueForm from "./components/RevenueForm";
import RevenuePage from "./pages/RevenuePage";
import AdminDashboard from "./pages/AdminDashboard";
import DetailedReport from "./pages/DetailedReport";
import DetailedEC from "./pages/DetailedEC";
import DetailedRevenue from "./pages/DetailedRevenue";
import { useDispatch } from "react-redux";
import { refreshSession } from "./store/features/authSlice";
import CashPage from "./pages/CashPage";
import DetailedCash from "./pages/DetailedCash";
import BudgetReallocationLayout from "./layouts/BudgetReallocationLayout";
import ReallocationPage from "./pages/ReallocationPage";
import BudgetReallocationPage from "./pages/BudgetReallocationPage";




function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshSession());
  }, [dispatch]);


  const router = createBrowserRouter([
    {
      path: "/",
      Component: Login,
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          Component: Analytics,
        },
        {
          path: "budget&reallocation",
          Component: BudgetReallocationLayout,
          children: [
            {
              index: true,
              Component: BudgetReallocationPage
            },
            {
              path: "budget",
              Component: BudgetExpenditure
            },
            {
              path: "reallocation",
              Component: ReallocationPage
            },
          ]
        },
        {
          path: "revenue&cash",
          Component: RevenueCashLayout,
          children: [
            {
              index: true,
              Component: RevenueCashPage,
            },
            {
              path: "revenue",
              Component: RevenuePage,
            },
            {
              path: "cash",
              Component: CashPage,
            },
          ],
        },
        {
          path: "reports",
          Component: ReportLayout,
          children: [
            {
              index: true,
              Component: Reports,
            },
            {
              path: "summaryReport",
              Component: SummaryReport,
            },
            {
              path: "detailedReport",
              Component: DetailedReport,
            },
            {
              path: "detailedEC",
              Component: DetailedEC,
            },
            {
              path: "detailedRevenue",
              Component: DetailedRevenue,
            },
            {
              path: "detailedCash",
              Component: DetailedCash,
            },
            {
              path: "preview",
              Component: ReportPreview,
            },
          ],
        },
        {
          path: "users",
          element: (
            <PrivateRoute allowedRoles={["admin"]}>
              <UserLayout />
            </PrivateRoute>
          ),
          children: [
            {
              index: true,
              Component: AdminDashboard,
            },
            {
              path: "users",
              Component: Users,
            },
            {
              path: "newUser",
              Component: NewUser,
            },
            {
              path: "update",
              Component: UpdateUser,
            },
          ],
        },
        {
          path: "settings",
          Component: Settings,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#16a34a",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "8px",
          },
          error: {
            style: { background: "#dc2626" },
          },
        }}
      />
    </>
  );
}

export default App;

// element: (
//             <PrivateRoute allowedRoles={["admin"]}>
//               <UserLayout />
//             </PrivateRoute>
//           ),
