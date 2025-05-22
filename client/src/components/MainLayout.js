import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <main className="max-w-xxl mx-auto mt-10 rounded-t-[50px] bg-gradient-to-r from-[#0B3B8A] to-[#0B6FFF] p-8 flex flex-col md:flex-row md:space-x-10 min-h-screen">
      <Sidebar />
      <div className="flex-1">
        {children}
      </div>
    </main>
  );
};

export default MainLayout;
