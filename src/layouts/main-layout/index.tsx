import { Outlet } from 'react-router-dom';
import AppHeader from '../../common-components/app-header';
import Sidebar from '../../common-components/sidebar';

const MainLayout = () => (
  <div className="flex min-h-screen flex-col">
    <AppHeader />
    <div className="grid flex-1 grid-cols-1 md:grid-cols-[216px_minmax(0,1fr)]">
      <Sidebar />
      <main className="min-w-0 px-4 pt-[26px] pb-10 sm:px-[30px]">
        <Outlet />
      </main>
    </div>
  </div>
);

export default MainLayout;
