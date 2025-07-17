import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Bookings from "./Pages/Bookings";
import ScheduleCalendar from "./components/ScheduleCalendar";
import DayViewPage from "./Pages/DayViewPage";
import Partners from "./Pages/Partners";
import DashboardLayout from "./components/DashboardLayout";
import { useBookingStore } from "./store/bookingStore";

export default function App() {
  const fetchBookings = useBookingStore((state) => state.fetchBookings);
const fetchPartners = useBookingStore((state) => state.fetchPartners);

useEffect(() => {
  fetchBookings();
  fetchPartners();
}, []);


  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/schedule/day/:date" element={<DayViewPage />} />
          <Route path="/" element={<Bookings />} />
          <Route path="/schedule" element={<ScheduleCalendar />} />
          <Route path="/schedule/:date" element={<DayViewPage />} />
          <Route path="/partners" element={<Partners />} />
        </Route>
      </Routes>
    </Router>
  );
}
