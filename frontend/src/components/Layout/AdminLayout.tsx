import { LinksGroup, Logo } from '@/components/NavbarLinksGroup';
import { UserButton } from '@/components/UserButton';
import {
  IconBadgeAd,
  IconFileAnalytics,
  IconMail,
  IconNotes,
  IconPresentationAnalytics,
  IconUsers,
} from '@tabler/icons-react';
import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  title: string;
};

const mockdata = [
  {
    label: 'Quản lý tài khoản',
    icon: IconUsers,
    initiallyOpened: false,
    links: [
      { label: 'Danh sách tài khoản', link: '/admin/users' },
      { label: 'Tạo tài khoản', link: '/admin/users/create-account' },
      { label: 'Tài khoản', link: '/admin/account' },
    ],
  },
  {
    label: 'Quản lý vị trí',
    icon: IconNotes,
    initiallyOpened: false,
    links: [
      { label: 'Loại vị trí', link: '/admin/position/location_type' },
      { label: 'Trạng thái vị trí', link: '/admin/position/status' },
      { label: 'Điểm quảng cáo', link: '/admin/position' },
    ],
  },
  {
    label: 'Quản lý quảng cáo',
    icon: IconBadgeAd,
    initiallyOpened: false,
    links: [
      { label: 'Loại bảng quảng cáo', link: '/admin/ads/type' },
      { label: 'Hình thức quảng cáo', link: '/admin/ads/form' },
      { label: 'Bảng quảng cáo', link: '/admin/ads/panel' },
    ],
  },
  {
    label: 'Quản lý báo cáo',
    icon: IconFileAnalytics,
    links: [
      { label: 'Loại báo cáo', link: '/admin/report/type' },
      { label: 'Báo cáo', link: '/admin/report' },
    ],
  },
  {
    label: 'Quản lý yêu cầu',
    icon: IconMail,
    links: [
      { label: 'Yêu cầu bảng quảng cáo', link: '/admin/require/panel' },
      { label: 'Yêu cầu điểm quảng cáo', link: '/admin/require/position' },
    ],
  },
  { label: 'Thống kê', icon: IconPresentationAnalytics },
];

const AdminLayout = ({ title, children }: Props) => {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <div className="flex">
      <div className="w-[300px] border-r h-screen py-4 flex flex-col justify-between relative">
        <div>
          <div className="pb-4 border-b">
            <Logo style={{ width: 120 }} />
          </div>
          <div className="flex py-4 flex-col gap-5 font-medium h-[calc(100vh-130px)] overflow-y-scroll px-4 hide-scrollbar">
            {links}
          </div>
        </div>
        <div className="pt-4 px-4 border-t">
          <UserButton />
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
