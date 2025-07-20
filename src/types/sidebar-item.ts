import { TIcon } from "./icon";

export type TBasicListItem = {
  id: string;
  label: string;
};

export type TSidebarItem = TBasicListItem & {
  href: string;
  pattern?: string;
  isActive: (pathname: string) => boolean;
  icon: TIcon;
  target?: string;
};
