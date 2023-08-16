import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const Layout: FC = () => {
  return (
    <div className='app container'>
      <main className='main'>
        <Outlet />
      </main>
    </div>
  );
};
