// src/App.jsx
import DayViewPage from "./Pages/DayViewPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Bookings from "./Pages/Bookings";
import ScheduleCalendar from "./components/ScheduleCalendar";
import Partners from "./Pages/Partners";
import { Toaster } from "react-hot-toast"; // ✅ Added for toast support

function App() {
  return (
    <>
      <Toaster position="top-right" /> {/* ✅ Renders toast notifications */}
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Bookings />} />
            <Route path="schedule" element={<ScheduleCalendar />} />
            <Route path="schedule/day/:date" element={<DayViewPage />} />
            <Route path="partners" element={<Partners />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
