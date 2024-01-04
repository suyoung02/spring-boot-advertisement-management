import { type ReactNode } from "react";
import {
  IconFileAnalytics,
  IconGauge,
  IconLock,
  IconMail,
  IconNotes,
  IconPresentationAnalytics,
  IconUsers,
} from "@tabler/icons-react";
import { LinksGroup, Logo } from "@/components/NavbarLinksGroup";
import { UserButton } from "@/components/UserButton";

type Props = {
  children: ReactNode;
  title: string;
};

const mockdata = [
  { label: "Dashboard", icon: IconGauge, link: "/admin" },
  {
    label: "Quản lý tài khoản",
    icon: IconUsers,
    initiallyOpened: true,
    links: [
      { label: "Danh sách tài khoản", link: "/admin/users" },
      { label: "Tạo tài khoản", link: "/admin/users/create-account" },
    ],
  },
  {
    label: "Quản lý quảng cáo",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: "Loại quảng cáo", link: "/" },
      { label: "Điểm quảng cáo", link: "/" },
      { label: "Bảng quảng cáo", link: "/" },
    ],
  },
  {
    label: "Quản lý báo cáo",
    icon: IconFileAnalytics,
  },
  {
    label: "Yêu cầu",
    icon: IconMail,
  },
  { label: "Thống kê", icon: IconPresentationAnalytics },
  {
    label: "Đổi mật khẩu",
    icon: IconLock,
  },
];

const AdminLayout = ({ title, children }: Props) => {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <div className="flex">
      <div className="w-[300px] border-r h-screen p-4 flex flex-col justify-between">
        <div>
          <div className="mb-4 pb-4 border-b">
            <Logo style={{ width: 120 }} />
          </div>
          <div className="flex flex-col gap-5 font-medium">{links}</div>
        </div>
        <div className="">
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
