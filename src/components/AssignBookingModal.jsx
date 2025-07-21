// src/components/AssignBookingModal.jsx
import React, { useEffect, useState } from "react";
import { useBookingStore } from "../store/bookingStore";
import { toast } from "react-hot-toast";
import { supabase } from "../supabaseClient";

export default function AssignBookingModal({ onClose, booking = null }) {
  const addBooking = useBookingStore((state) => state.addBooking);
  const fetchBookings = useBookingStore((state) => state.fetchBookings);
  const partners = useBookingStore((state) => state.partners);

  const [address, setAddress] = useState(booking?.address || "");
  const [type, setType] = useState(booking?.type || "");
  const [category, setCategory] = useState(booking?.category || "");
  const [service, setService] = useState(booking?.service || "");
  const [datetime, setDatetime] = useState(booking?.datetime?.slice(0, 16) || "");
  const [status, setStatus] = useState(booking?.status || "Pending");
  const [partnerId, setPartnerId] = useState(booking?.partner_id || "");

const handleSave = async () => {
  if (!type || !category || !service || !datetime) {
    toast.error("Please fill all required fields");
    return;
  }

  const bookingData = {
    address,
    type,
    category,
    service,
    datetime,
    status,
    partner_id: partnerId ? Number(partnerId) : null,
  };

  try {
  if (booking) {
    const { error } = await supabase
      .from("bookings")
      .update(bookingData)
      .eq("id", booking.id);

    if (error) {
      toast.error("❌ Failed to update booking");
      console.error(error);
      return;
    }

    toast.success("✅ Booking updated", { duration: 2000 });
  } else {
    const { error } = await supabase
      .from("bookings")
      .insert([bookingData]);

    if (error) {
      toast.error("❌ Failed to create booking");
      console.error(error);
      return;
    }

    toast.success("✅ Booking created", { duration: 2000 });
  }

  await fetchBookings();

  // 🟢 Wait slightly before closing to allow toast to appear
  setTimeout(() => {
    onClose();
  }, 500);
} catch (err) {
  console.error("❌ Error:", err);
  toast.error("Something went wrong");
}
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">
          {booking ? "Assign Booking" : "New Booking"}
        </h2>

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <select
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">-- Select Partner --</option>
          {partners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Active">Active</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-black rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

