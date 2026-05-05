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
        label: "Residency",
        url: "/strategy#residency",
      },
      {
        id: "events",
        label: "Events",
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
        label: "Map",
        url: "/about#map",
      },
      {
        id: "constitution",
        label: "Constitution",
        url: "/about#constitution",
      },
      {
        id: "join",
        label: "How to Join",
        url: "/about#join",
      },
      {
        id: "friends",
        label: "Friends",
        url: "/about#friends",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact Us",
    url: "mailto:hello@prairieforge.org",
  },
];
