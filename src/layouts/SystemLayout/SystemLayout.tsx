import { useState } from 'react';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar/Sidebar';
import { Header } from './Header/Header';

export const SystemLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="flex h-screen bg-[var(--color-bg)] font-barlow overflow-hidden"
      style={{ animation: 'slideInSystem 0.4s ease forwards' }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
