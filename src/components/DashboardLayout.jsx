// src/components/DashboardLayout.jsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useBookingStore } from "../store/bookingStore"; // ✅ Make sure path is correct

export default function DashboardLayout() {
  const fetchBookings = useBookingStore((state) => state.fetchBookings);
  const fetchPartners = useBookingStore((state) => state.fetchPartners);

  useEffect(() => {
    fetchBookings();
    fetchPartners();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
