import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { AppWrapper } from '@components/AppWrapper';
import { Header } from '@components/Header/Header';

export const Layout: FC = () => {
  return (
    <div className='app container'>
      <AppWrapper>
        <Header />
        <main className='main'>
          <Outlet />
        </main>
      </AppWrapper>
    </div>
  );
};
