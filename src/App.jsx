import { Component, useState } from "react";
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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Login,
    },
    {
      path: "/dashboard",
      Component: DashboardLayout,
      children: [
        {
          index: true,
          Component: Analytics,
        },
        {
          path: "budget",
          Component: BudgetExpenditure,
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
    </>
  );
}

export default App;

// element: (
//             <PrivateRoute allowedRoles={["admin"]}>
//               <UserLayout />
//             </PrivateRoute>
//           ),
