
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-x-hidden">
          <div className="page-container">{children}</div>
        </main>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
};

export default Layout;
