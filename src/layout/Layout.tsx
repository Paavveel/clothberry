import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';

export const Layout: FC = () => {
  return (
    <div className='app container'>
      <Header />
      <main className='main'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
