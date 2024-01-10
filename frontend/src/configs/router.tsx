import { AdminLayout } from '@/components/Layout';
import {
  CreateAccount,
  DashboardPage,
  ForgotPasswordPage,
  LoginPage,
  ManageAdsForm,
  ManageAdsType,
  ManageLocationType,
  ManagePanel,
  ManagePosition,
  ManagePositionStatus,
  ManageReport,
  ManageReportType,
  ManageRequirementAds,
  ManageRequirementPosition,
  ManageUser,
  RegisterPage,
  UserDetail,
} from '@/pages/Admin';
import { HomePage } from '@/pages/Home';
import { NotFound } from '@/pages/Error';
import { Outlet, createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
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
      {
        path: '*',
        element: <NotFound />,
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
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/admin/ads',
    element: (
      <AdminLayout title="Quản lý quảng cáo">
        <Outlet />
      </AdminLayout>
    ),
    children: [
      {
        path: 'type',
        element: <ManageAdsType />,
      },
      {
        path: 'form',
        element: <ManageAdsForm />,
      },
      {
        path: 'panel',
        element: <ManagePanel />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/admin/position',
    element: (
      <AdminLayout title="Quản lý vị trí">
        <Outlet />
      </AdminLayout>
    ),
    children: [
      {
        path: 'location_type',
        element: <ManageLocationType />,
      },
      {
        path: 'status',
        element: <ManagePositionStatus />,
      },
      {
        path: '',
        element: <ManagePosition />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/admin/report',
    element: (
      <AdminLayout title="Quản lý báo cáo">
        <Outlet />
      </AdminLayout>
    ),
    children: [
      {
        path: 'type',
        element: <ManageReportType />,
      },
      {
        path: '',
        element: <ManageReport />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/admin/require',
    element: (
      <AdminLayout title="Quản lý yêu cầu">
        <Outlet />
      </AdminLayout>
    ),
    children: [
      {
        path: 'panel',
        element: <ManageRequirementAds />,
      },
      {
        path: 'position',
        element: <ManageRequirementPosition />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
