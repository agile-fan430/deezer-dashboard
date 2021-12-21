import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Accounts',
    icon: 'person-outline',
    link: '/pages/accounts',
  },
  {
    title: 'Album',
    icon: 'bar-chart-outline',
    link: '/pages/albums',
  },
  {
    title: 'Tracks',
    icon: 'bar-chart-2-outline',
    link: '/pages/tracks',
  },
  {
    title: 'Artists',
    icon: 'headphones-outline',
    link: '/pages/artists',
  },
  {
    title: 'Analytics',
    icon: 'shopping-bag-outline',
    link: '/pages/analytics'
  },
  {
    title: 'Settings',
    icon: 'settings-2-outline',
    link: '/pages/settings',
  },
];
