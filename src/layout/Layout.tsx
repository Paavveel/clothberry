import { FC } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

import { toastOptions } from 'config/toastOptions';

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
      <Toaster position='bottom-right' toastOptions={toastOptions} />
    </div>
  );
};
