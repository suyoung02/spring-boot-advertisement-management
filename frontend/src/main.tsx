import { AdminLayout } from '@/components/Layout';
import {
  CreateAccount,
  DashboardPage,
  ForgotPasswordPage,
  LoginPage,
  ManageUser,
  RegisterPage,
  UserDetail,
} from '@/pages/Admin';
import { HomePage } from '@/pages/Home';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

const router = createBrowserRouter([
  {
    path: '/admin',
    children: [
      {
        path: '',
        element: (
          <AdminLayout title="Hệ thống quản lý">
            <DashboardPage />
          </AdminLayout>
        ),
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    path: '/admin/users',
    element: (
      <AdminLayout title="Quản lý tài khoản">
        <Outlet />
      </AdminLayout>
    ),
    children: [
      {
        path: 'create-account',
        element: <CreateAccount />,
      },
      {
        path: ':id',
        element: <UserDetail />,
      },
      {
        path: '',
        element: <ManageUser />,
      },
    ],
  },

  {
    path: '/',
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Notifications />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>,
);
