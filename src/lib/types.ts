export type MenuItem = {
  id: string;
  label: string;
  url: string;
  subMenu?: MenuItem[];
};
