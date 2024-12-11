import React from 'react';
import { NavBarProps } from '../types';

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated, handleLogout }) => {
  return (
    <header className="w-full bg-white shadow mb-6 p-4 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-blue-600">Media Sharing Platform</h1>
        <p className="text-gray-600 mt-2 text-center">
          Upload and explore your media files with ease.
        </p>
      </div>
      <div>
        {isAuthenticated && (
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default NavBar;
