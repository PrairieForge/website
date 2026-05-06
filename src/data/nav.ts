import type { MenuItem } from "#/lib/types";

export const navItems: MenuItem[] = [
  {
    id: "vision",
    label: "Our Vision",
    url: "/#vision",
  },
  {
    id: "strategy",
    label: "Our Strategy",
    url: "/strategy",
    subMenu: [
      {
        id: "fellowship",
        label: "Monthly Fellowship",
        url: "/strategy#fellowship",
      },
      {
        id: "internship",
        label: "Summer Internship",
        url: "/strategy#internship",
      },
      {
        id: "residency",
        label: "Pastoral Residency",
        url: "/strategy#residency",
      },
      {
        id: "events",
        label: "Prairie Fires",
        url: "/strategy#events",
      },
    ],
  },
  {
    id: "about",
    label: "Who We Are",
    url: "/about",
    subMenu: [
      {
        id: "map",
        label: "Member Churches",
        url: "/about#map",
      },
      {
        id: "friends",
        label: "Friends of Prairie Forge",
        url: "/about#friends",
      },
      {
        id: "join",
        label: "How to Join",
        url: "/about#join",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact Us",
    url: "mailto:hello@prairieforge.org",
  },
];
