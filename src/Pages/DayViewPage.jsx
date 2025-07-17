import { useBookingStore } from "../store/bookingStore";

import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import AssignBookingModal from "../components/AssignBookingModal";



export default function DayViewPage() {
  const bookings = useBookingStore((state) => state.bookings);
  const partners = useBookingStore((state) => state.partners);


  const [viewMode, setViewMode] = useState("list"); // "list" or "timeline"
  const { date } = useParams(); // Get /schedule/:date
  let selectedDate = null;
let formattedDate = "";
let dayOfWeek = "";

if (date) {
  const [year, month, day] = date.split("-").map(Number);
  selectedDate = new Date(year, month - 1, day); // month is 0-indexed

  if (!isNaN(selectedDate)) {
    formattedDate = format(selectedDate, "do MMMM yyyy");
    dayOfWeek = format(selectedDate, "EEEE");
  }
}

  const [assignModalBooking, setAssignModalBooking] = useState(null);

  // Filter only bookings for this date
  const bookingsForTheDay = useMemo(() => {
  if (!selectedDate) return [];

  return (bookings || []).filter((b) => {
    if (!b.date) return false;
    const bookingDate = parseISO(b.date); // much safer for string dates

    if (isNaN(bookingDate)) return false;

    return format(bookingDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
  });
}, [bookings, selectedDate]);



 // Group by partner
const groupedBookings = useMemo(() => {
  const groups = {};

  bookingsForTheDay.forEach((booking) => {
    const partnerName = booking.partner?.trim();
    const key = partnerName && partnerName !== "" ? partnerName : "Unassigned";
    if (!groups[key]) groups[key] = [];
    groups[key].push(booking);
  });

  console.log("📅 Bookings being grouped:", bookingsForTheDay);
  console.log("✅ Grouped bookings output:", groups);

  return groups;
}, [bookingsForTheDay]);






  const assignedCount = bookingsForTheDay.filter((b) => b.partner).length;
  const unassignedCount = bookingsForTheDay.length - assignedCount;
const [showAssignModal, setShowAssignModal] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);
const assignPartner = useBookingStore((state) => state.assignPartner); // add near top

const handlePartnerAssign = (bookingId, partnerName) => {
  assignPartner(bookingId, partnerName); // ✅ Updates store and re-renders
  toast.success(`Assigned to ${partnerName}`);
  setAssignModalBooking(null); // ✅ closes modal instantly after assignment
};

console.log("📅 All bookings from store:", bookings);
console.log("📆 Selected date:", selectedDate);

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-[#05A54B] text-xl"
            title="Back to Schedule"
          >
            ←
          </button>
          <h1 className="text-2xl font-semibold">
            {format(selectedDate, "dd MMMM yyyy")}
          </h1>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 text-sm rounded border ${
              viewMode === "list"
                ? "bg-[#05A54B] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            🗒️ List View
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1 text-sm rounded border ${
              viewMode === "timeline"
                ? "bg-[#05A54B] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📅 Timeline View
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-1">
          {bookingsForTheDay.length} bookings · {assignedCount} assigned ·{" "}
          {unassignedCount} unassigned
        </p>

        {viewMode === "list" ? (
          <div className="space-y-6 mt-6">
            {Object.entries(groupedBookings).map(([partner, bookings]) => (
              <div
                key={partner}
                className="bg-white border rounded-xl shadow-sm p-4"
              >
                 <h2 className="text-lg font-semibold mb-2">
  {partner && partner !== "Unassigned"
    ? `Partner: ${partner}`
    : "Unassigned Bookings"}
</h2>


                <div className="space-y-2">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">
                          {booking.time} · {booking.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.service}
                        </p>
                      </div>

                      {!booking.partner && (
                        <button
                          onClick={() => setAssignModalBooking(booking)}
                          className="text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 border-r text-left">Time</th>
                  {partners.map((partner) => (
  <th
    key={partner.id}
    className="px-4 py-2 border-r text-left"
  >
    {partner.name}
  </th>
))}

                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 14 }).map((_, i) => {
                  const hour = i + 6;
                  const label = `${hour.toString().padStart(2, "0")}:00`;
                  return (
                    <tr key={label} className="border-b">
                      <td className="px-4 py-2 border-r font-medium">{label}</td>
                      {partners.map((partner) => {
                        const booking = bookingsForTheDay.find(
                          (b) =>
                            b.partner === partner.name &&
                            b.time?.startsWith(label.slice(0, 2))
                        );
                        return (
                          <td key={partner} className="px-4 py-2 border-r">
                            {booking ? (
                              <div className="bg-yellow-100 p-2 rounded">
                                <div className="font-medium">
                                  {booking.type}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {booking.service}
                                </div>
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {assignModalBooking && (
  <AssignBookingModal
  booking={assignModalBooking}
  onCreate={(updatedBooking) => {
  console.log("✅ onCreate in DayViewPage fired:", updatedBooking);

  const { id, partner } = updatedBooking;
  if (id && partner) {
    useBookingStore.getState().assignPartner(id, partner);
    toast.success(`Assigned to ${partner}`);
  }

  setAssignModalBooking(null); // close modal
}}


  onClose={() => setAssignModalBooking(null)}
/>


)}

      </div>
    </div>
  );
}
