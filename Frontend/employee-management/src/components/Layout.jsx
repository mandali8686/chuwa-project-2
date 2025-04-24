// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar/NavBar';

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth:'100vw' }}>
      <NavBar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;
