// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-green-100 ${
      isActive ? "text-green-600 font-semibold bg-green-50" : "text-gray-700"
    }`;

  return (
    <aside className="w-64 bg-white h-screen p-4 border-r">
      <div className="flex items-center mb-8">
        <img src="/Icon.svg" alt="Sazup Logo" className="w-6 h-6 mr-2" />
        <span className="font-bold text-green-600 text-xl">Sazup</span>
      </div>
      <nav className="space-y-2">
        <NavLink to="/" end className={linkClasses}>
          Bookings
        </NavLink>
        <NavLink to="/schedule" className={linkClasses}>
          Schedule
        </NavLink>
        <NavLink to="/partners" className={linkClasses}>
          Partners
        </NavLink>
      </nav>
    </aside>
  );
}
