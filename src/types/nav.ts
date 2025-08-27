export type NavItem = {
  label: string;
  path: string;
  openInNewTab: boolean;
  acl: string;
  subItems: NavItem[];
};

export type NavGlobal = {
  items: NavItem[];
};
