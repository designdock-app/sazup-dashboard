import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Keep only ONE import
import { format } from "date-fns";
import { toast } from "react-hot-toast";

import { useBookingStore } from "../store/bookingStore";
import AssignBookingModal from "./AssignBookingModal";
// import DayViewModal from "./DayViewModal"; ❌ No longer needed if you're not using modal

export default function ScheduleCalendar() {
  const bookings = useBookingStore((state) => state.bookings);
  const partners = useBookingStore((state) => state.partners);
  const getStatusColor = (status) => {
  switch (status) {
    case "Upcoming":
      return "text-green-500";
    case "Pending":
      return "text-yellow-500";
    case "Active":
      return "text-blue-500";
    default:
      return "text-gray-300";
  }
};
const getBookingCountsForDate = (date) => {
  const counts = {};

  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // midnight
  const dateString = format(localDate, "yyyy-MM-dd");

  bookings.forEach((b) => {
   if (!b.date || !b.status) return;

const bookingDate = new Date(b.datetime);

    if (isNaN(bookingDate)) return;

    const bookingLocalDate = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate()
    );
    const bookingString = format(bookingLocalDate, "yyyy-MM-dd");

    if (bookingString === dateString) {
      counts[b.status] = (counts[b.status] || 0) + 1;
    }
  });

  return counts;
};









const navigate = useNavigate(); // ✅ Declare only once inside the component

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth(); // 0-based (0 = Jan)

const firstDay = new Date(year, month, 1);
const startDay = firstDay.getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();

const matrix = [];
let dayCounter = 1;

for (let i = 0; i < 6; i++) {
  const row = [];
  for (let j = 0; j < 7; j++) {
    if ((i === 0 && j < startDay) || dayCounter > daysInMonth) {
      row.push(null);
    } else {
      const cellDate = new Date(year, month, dayCounter);
row.push(cellDate);

      dayCounter++;
    }
  }
  matrix.push(row);
}



const handleDateClick = (date) => {
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // removes time offset
  const formatted = format(localDate, "yyyy-MM-dd");
  navigate(`/schedule/day/${formatted}`);
};

const handleAssignClick = () => {
  console.log("Assign Booking Clicked");
  // Optionally open a modal here
};

const handlePartnerAssign = (bookingId, partnerName) => {
  useBookingStore.getState().assignPartner(bookingId, partnerName); // ✅ Zustand update
  toast.success(`Assigned to ${partnerName}`);
};




  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Schedule Management</h2>
      <p className="text-sm text-gray-600 mb-4">
        View and manage booking schedules across all partners
      </p>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xl font-bold text-center">28</p>
          <p className="text-sm text-center">Upcoming bookings</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xl font-bold text-center">4</p>
          <p className="text-sm text-center">Pending bookings</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xl font-bold text-center">5</p>
          <p className="text-sm text-center">Active bookings</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xl font-bold text-center">5</p>
          <p className="text-sm text-center">Total Partners</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <div className="flex justify-between mb-4">
          
<h3 className="text-md font-semibold">July {year}</h3>
          <div className="flex gap-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded">
              Download
            </button>
            <button
              onClick={handleAssignClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Assign Booking
            </button>
          </div>
        </div>

        <table className="w-full table-fixed border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <th key={d} className="p-2 border">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((week, i) => (
              <tr key={i}>
                {week.map((date, j) => (
                  <td
                    key={j}
                    className="p-2 border text-center align-top cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      if (!date) return;
                      handleDateClick(date);
                    }}
                  >
                    {date && (
                      <>
  <div className="text-sm font-medium">{date.getDate()}</div>
  {(() => {
    try {
      const counts = getBookingCountsForDate(date);
      console.log("📅 Date:", date, "→ Counts:", counts);

      return ["Upcoming", "Pending", "Active"].map((status) => (
        <div
          key={status}
          className={`text-xs ${
            counts[status] > 0 ? getStatusColor(status) : "text-gray-300"
          }`}
        >
          ● {counts[status]} {status}
        </div>
      ));
    } catch (err) {
      console.error("❌ Error in calendar cell for date", date, err);
      return null;
    }
  })()}
</>


                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedBooking && (
        <AssignBookingModal
  booking={selectedBooking}
  onAssign={handlePartnerAssign}
  onClose={() => {
    setModalOpen(false);
    setSelectedBooking(null);
  }}
/>

      )}
    </div>
  );
}

