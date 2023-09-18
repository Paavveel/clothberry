export enum AppRoutes {
  ROOT = '/',
  PROFILE = '/profile',
  BASKET = '/basket',
  SIGNIN = '/signin',
  SIGNUP = '/signup',
  ABOUT = '/about',
}

export type Menu = {
  title: string;
  url: string;
  submenu?: Menu[];
};

export const menuItems: Menu[] = [
  {
    title: 'T-Shirts',
    url: '/t-shirts',
    submenu: [
      {
        title: 'Berserk',
        url: 'berserk',
      },
      {
        title: 'Hunter x Hunter',
        url: 'hunter-x-hunter',
      },
      {
        title: 'Jujutsu Kaisen',
        url: 'jujutsu-kaisen',
      },
    ],
  },
  {
    title: 'Outerwear',
    url: '/outerwear',
    submenu: [
      {
        title: 'Dragon Ball',
        url: 'dragon-ball',
      },
      {
        title: 'Naruto',
        url: 'naruto',
      },
      {
        title: 'Evangelion',
        url: 'oevangelion',
      },
    ],
  },
  {
    title: 'Hoodies & Fleece',
    url: '/hoodies-fleece',
    submenu: [
      {
        title: 'Tokyo Ghoul',
        url: 'tokyo-ghoul',
      },
      {
        title: 'Cyberpunk: Edgerunners',
        url: 'cyberpunk-edgerunners',
      },
      {
        title: 'Evangelion',
        url: 'evangelion',
      },
    ],
  },
];
