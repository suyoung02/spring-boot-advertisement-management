import { Box } from "@mantine/core";
import { IconCalendarStats } from "@tabler/icons-react";
import LinksGroup from "./LinksGroup";

const mockdata = {
  label: "Releases",
  icon: IconCalendarStats,
  links: [
    { label: "Upcoming releases", link: "/" },
    { label: "Previous releases", link: "/" },
    { label: "Releases schedule", link: "/" },
  ],
};

const NavbarLinksGroup = () => {
  return (
    <Box mih={220} p="md">
      <LinksGroup {...mockdata} />
    </Box>
  );
};

export default NavbarLinksGroup;
