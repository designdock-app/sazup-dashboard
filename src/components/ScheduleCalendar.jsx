import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import { useBookingStore } from "../store/bookingStore";
import AssignBookingModal from "./AssignBookingModal";

export default function ScheduleCalendar() {
  const bookings = useBookingStore((state) => state.bookings);
  const partners = useBookingStore((state) => state.partners);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

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
        row.push(new Date(year, month, dayCounter));
        dayCounter++;
      }
    }
    matrix.push(row);
  }

  const handleDateClick = (date) => {
  if (!date) return;
  const formatted = format(date, "yyyy-MM-dd");
  navigate(`/schedule/day/${formatted}?view=timeline`);
};


  const getCounts = (date) => {
    const dStr = format(date, "yyyy-MM-dd");
    let upcoming = 0, pending = 0, active = 0;

    bookings.forEach((b) => {
      if (!b.datetime) return;
      const bStr = format(parseISO(b.datetime), "yyyy-MM-dd");
      if (bStr === dStr) {
        if (b.status === "Upcoming") upcoming++;
        else if (b.status === "Pending") pending++;
        else if (b.status === "Active") active++;
      }
    });

    return { upcoming, pending, active };
  };

  const upcomingCount = bookings.filter(b => b.status === "Upcoming").length;
  const pendingCount = bookings.filter(b => b.status === "Pending").length;
  const activeCount = bookings.filter(b => b.status === "Active").length;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Schedule Management</h2>
      <p className="text-sm text-gray-600 mb-4">View and manage booking schedules across all partners</p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xl font-bold text-center">{upcomingCount}</p>
          <p className="text-sm text-center">Upcoming bookings</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xl font-bold text-center">{pendingCount}</p>
          <p className="text-sm text-center">Pending bookings</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xl font-bold text-center">{activeCount}</p>
          <p className="text-sm text-center">Active bookings</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xl font-bold text-center">{partners.length}</p>
          <p className="text-sm text-center">Total Partners</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <div className="flex justify-between mb-4">
          <h3 className="text-md font-semibold">July {year}</h3>
          <div className="flex gap-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded">Download</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Assign Booking</button>
          </div>
        </div>

        <table className="w-full table-fixed border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <th key={d} className="p-2 border text-center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((week, i) => (
              <tr key={i}>
                {week.map((date, j) => (
                  <td
                    key={j}
                    className={`p-2 border text-left align-top min-h-[80px] hover:bg-gray-100 cursor-pointer`}
                    onClick={() => handleDateClick(date)}
                  >
                    {date && (
                      <>
                        <div className="font-medium text-sm">{date.getDate()}</div>
                        {(() => {
                          const { upcoming, pending, active } = getCounts(date);
                          return (
                           <div className="mt-1 text-xs space-y-1">
  <div className={upcoming > 0 ? "status-upcoming-text" : "status-upcoming-faint"}>
  • {upcoming} Upcoming
</div>
<div className={pending > 0 ? "status-pending-text" : "status-pending-faint"}>
  • {pending} Pending
</div>
<div className={active > 0 ? "status-active-text" : "status-active-faint"}>
  • {active} Active
</div>
</div>

                          );
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
    </div>
  );
}
