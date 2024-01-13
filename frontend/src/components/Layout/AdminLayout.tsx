import { LinksGroup, Logo } from '@/components/NavbarLinksGroup';
import { UserButton } from '@/components/UserButton';
import { useUserStore } from '@/stores/user';
import { Role } from '@/types/enum';
import { User } from '@/types/user';
import {
  IconBadgeAd,
  IconFileAnalytics,
  IconMail,
  IconNotes,
  IconPresentationAnalytics,
  IconUsers,
} from '@tabler/icons-react';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: ReactNode;
  title?: string;
  role?: Role[];
};

const mockdata = [
  {
    label: 'Quản lý tài khoản',
    icon: IconUsers,
    initiallyOpened: false,
    links: [
      { label: 'Danh sách tài khoản', link: '/admin/users', role: [Role.VHTT] },
      {
        label: 'Tạo tài khoản',
        link: '/admin/users/create-account',
        role: [Role.VHTT],
      },
      {
        label: 'Tài khoản',
        link: '/admin/account',
        role: [Role.VHTT, Role.DISTRICT, Role.WARD],
      },
    ],
  },
  {
    label: 'Quản lý vị trí',
    icon: IconNotes,
    initiallyOpened: false,
    links: [
      {
        label: 'Loại vị trí',
        link: '/admin/position/location_type',
        role: [Role.VHTT],
      },
      {
        label: 'Trạng thái vị trí',
        link: '/admin/position/status',
        role: [Role.VHTT],
      },
      {
        label: 'Điểm quảng cáo',
        link: '/admin/position',
        role: [Role.VHTT, Role.DISTRICT, Role.WARD],
      },
    ],
  },
  {
    label: 'Quản lý quảng cáo',
    icon: IconBadgeAd,
    initiallyOpened: false,
    links: [
      {
        label: 'Loại bảng quảng cáo',
        link: '/admin/ads/type',
        role: [Role.VHTT],
      },
      {
        label: 'Hình thức quảng cáo',
        link: '/admin/ads/form',
        role: [Role.VHTT],
      },
      {
        label: 'Bảng quảng cáo',
        link: '/admin/ads/panel',
        role: [Role.VHTT, Role.DISTRICT, Role.WARD],
      },
    ],
  },
  {
    label: 'Quản lý báo cáo',
    icon: IconFileAnalytics,
    links: [
      { label: 'Loại báo cáo', link: '/admin/report/type', role: [Role.VHTT] },
      {
        label: 'Báo cáo',
        link: '/admin/report',
        role: [Role.VHTT, Role.DISTRICT, Role.WARD],
      },
    ],
  },
  {
    label: 'Quản lý yêu cầu',
    icon: IconMail,
    links: [
      {
        label: 'Yêu cầu bảng quảng cáo',
        link: '/admin/require/panel',
        role: [Role.VHTT, Role.DISTRICT, Role.WARD],
      },
      {
        label: 'Yêu cầu điểm quảng cáo',
        link: '/admin/require/position',
        role: [Role.VHTT, Role.DISTRICT, Role.WARD],
      },
    ],
  },
  {
    label: 'Thống kê',
    icon: IconPresentationAnalytics,
    link: '/admin/analytics',
    role: [Role.VHTT, Role.DISTRICT, Role.WARD],
  },
];

const AdminLayout = ({ title, children, role }: Props) => {
  const user = useUserStore.use.user();

  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  // console.log('?????', role, user);
  if (!role && user) {
    return <Navigate to={user.role ? '/admin/users' : '/admin/position'} />;
  } else if (role && !role?.includes(user?.role as Role)) {
    return <Navigate to={user ? '/admin/account' : '/admin/login'} />;
  }

  if (!role) return children;

  return (
    <div className="flex">
      <div className="w-[300px] border-r h-screen py-4 flex flex-col justify-between relative">
        <div>
          <div className="pb-4 border-b pl-4">
            <Logo style={{ width: 120 }} />
          </div>
          <div className="flex py-4 flex-col gap-5 font-medium h-[calc(100vh-130px)] overflow-y-scroll px-4 hide-scrollbar">
            {links}
          </div>
        </div>
        <div className="pt-4 px-4 border-t">
          <UserButton user={user as User} />
        </div>
      </div>
      <div className="w-full">
        <div className="uppercase text-2xl py-4 border-b font-bold px-8">
          {title}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
