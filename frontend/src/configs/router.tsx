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
import { NotFound } from '@/pages/Error';
import { HomePage } from '@/pages/Home';
import { Role } from '@/types/enum';
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
        element: (
          <AdminLayout>
            <LoginPage />
          </AdminLayout>
        ),
      },
      {
        path: 'register',
        element: (
          <AdminLayout>
            <RegisterPage />
          </AdminLayout>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <AdminLayout>
            <ForgotPasswordPage />
          </AdminLayout>
        ),
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
      <AdminLayout role={[Role.VHTT]} title="Quản lý tài khoản">
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
      <AdminLayout
        role={[Role.VHTT, Role.WARD, Role.DISTRICT]}
        title="Quản lý quảng cáo"
      >
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
    element: <Outlet />,
    children: [
      {
        path: 'location_type',
        element: (
          <AdminLayout role={[Role.VHTT]} title="Quản lý vị trí">
            <ManageLocationType />
          </AdminLayout>
        ),
      },
      {
        path: 'status',
        element: (
          <AdminLayout role={[Role.VHTT]} title="Quản lý vị trí">
            <ManagePositionStatus />
          </AdminLayout>
        ),
      },
      {
        path: '',
        element: (
          <AdminLayout
            role={[Role.VHTT, Role.WARD, Role.DISTRICT]}
            title="Quản lý vị trí"
          >
            <ManagePosition />
          </AdminLayout>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/admin/report',
    element: <Outlet />,
    children: [
      {
        path: 'type',
        element: (
          <AdminLayout role={[Role.VHTT]} title="Quản lý vị trí">
            <ManageReportType />
          </AdminLayout>
        ),
      },
      {
        path: '',
        element: (
          <AdminLayout
            role={[Role.VHTT, Role.WARD, Role.DISTRICT]}
            title="Quản lý vị trí"
          >
            <ManageReport />
          </AdminLayout>
        ),
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
      <AdminLayout
        role={[Role.VHTT, Role.WARD, Role.DISTRICT]}
        title="Quản lý yêu cầu"
      >
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
