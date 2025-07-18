import React, { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useBookingStore } from "../store/bookingStore";
import { format } from "date-fns";

export default function DayViewPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  const bookings = useBookingStore((state) => state.bookings);
  const partners = useBookingStore((state) => state.partners);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewMode = searchParams.get("view") || "list";

  const day = useMemo(() => new Date(date), [date]);

  const timeslots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const bookingDate = new Date(b.datetime);
      return (
        bookingDate.toISOString().slice(0, 10) ===
        day.toISOString().slice(0, 10)
      );
    });
  }, [bookings, day]);

  const getBookingAtSlot = (time, partnerId) => {
    return filteredBookings.find((b) => {
      const bDate = new Date(b.datetime);
      const bHour = bDate.getHours().toString().padStart(2, "0");
      return `${bHour}:00` === time && b.partner_id === partnerId;
    });
  };

  const groupedBookings = useMemo(() => {
    const groups = {};
    filteredBookings.forEach((booking) => {
      const partnerName = booking.partner_id
        ? partners.find((p) => p.id === booking.partner_id)?.name
        : null;
      const key = partnerName || "Unassigned";
      if (!groups[key]) groups[key] = [];
      groups[key].push(booking);
    });
    return groups;
  }, [filteredBookings, partners]);

  return (
    <div className="p-6">
      {/* Header row with back and tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/schedule")}
            className="text-xl hover:text-green-600"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold">
            {format(day, "dd MMMM yyyy")}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/schedule/day/${date}?view=list`)}
            className={`border px-3 py-1 rounded ${
              viewMode === "list" ? "bg-green-600 text-white" : "bg-white"
            }`}
          >
            🗒️ List View
          </button>
          <button
            onClick={() => navigate(`/schedule/day/${date}?view=timeline`)}
            className={`border px-3 py-1 rounded ${
              viewMode === "timeline" ? "bg-green-600 text-white" : "bg-white"
            }`}
          >
            📅 Timeline View
          </button>
        </div>
      </div>

      {/* Count summary */}
      <p className="text-sm mb-4">
        {filteredBookings.length} bookings •{" "}
        {filteredBookings.filter((b) => b.partner_id).length} assigned •{" "}
        {filteredBookings.filter((b) => !b.partner_id).length} unassigned
      </p>

      {viewMode === "list" ? (
        <div className="space-y-6">
          {Object.entries(groupedBookings).map(([partner, bookings]) => (
            <div
              key={partner}
              className="bg-white border rounded-xl shadow-sm p-4"
            >
              <h2 className="text-lg font-semibold mb-2">
                {partner !== "Unassigned" ? `Partner: ${partner}` : "Unassigned Bookings"}
              </h2>
              <div className="space-y-2">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(booking.datetime), "HH:mm")} · {booking.type}
                      </p>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                    </div>
                    {!booking.partner_id && (
                      <button
                        className="text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                        onClick={() => navigate(`/schedule/day/${date}?view=list&edit=${booking.id}`)}
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
        <div className="overflow-auto border rounded">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border p-2 w-24">Time</th>
                {partners.map((p) => (
                  <th key={p.id} className="border p-2 min-w-[120px]">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeslots.map((time) => (
                <tr key={time}>
                  <td className="border p-2 text-gray-600 font-medium">
                    {time}
                  </td>
                  {partners.map((partner) => {
                    const booking = getBookingAtSlot(time, partner.id);
                    return (
                      <td key={partner.id} className="border p-2 align-top">
                        {booking && (
                          <div className="bg-yellow-100 p-2 rounded leading-tight">
                            <div className="font-medium">{booking.type}</div>
                            <div className="text-xs text-gray-700">{booking.service}</div>
                            <div className="text-xs text-gray-500">{booking.address}</div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
