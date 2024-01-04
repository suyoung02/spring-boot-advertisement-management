import {
  CreateAccount,
  DashboardPage,
  LoginPage,
  ManageUser,
  RegisterPage,
  UserDetail,
} from "@/pages/Admin";
import { HomePage } from "@/pages/Home";
import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "@mantine/core/styles.css";

const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path: "/admin/register",
    element: <RegisterPage />,
  },
  {
    path: "/admin",
    element: (
      <AdminLayout title="Hệ thống quản lý">
        <DashboardPage />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminLayout title="Quản lý tài khoản">
        <Outlet />
      </AdminLayout>
    ),
    children: [
      {
        path: "create-account",
        element: <CreateAccount />,
      },
      {
        path: ":id",
        element: <UserDetail />,
      },
      {
        path: "",
        element: <ManageUser />,
      },
    ],
  },

  {
    path: "/",
    element: <HomePage />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
);
