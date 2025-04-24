import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown } from 'lucide-react';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  username?: string;
  [key: string]: any;
}

const Header: React.FC = () => {
  const { token, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('User');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.username) setUsername(decoded.username);
      } catch (err) {
        console.error('Failed to decode token', err);
      }
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-lg rounded-2xl mb-6 border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
        ⚡ Renewable Energy Visualization Dashboard
      </h1>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all"
        >
          <span className="font-semibold">{username}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl ring-1 ring-gray-200 z-10 animate-fade-in">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
