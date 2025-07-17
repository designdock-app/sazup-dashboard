import axios from "axios";
import AssignBookingModal from "../components/AssignBookingModal";
import { useBookingStore } from "../store/bookingStore";
import toast from "react-hot-toast";
import React, { useState, useRef } from "react";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import ScheduleCalendar from "../components/ScheduleCalendar";

export default function Bookings() {
  const bookings = useBookingStore((state) => state.bookings);
  const addBooking = useBookingStore((state) => state.addBooking);
  const updateBooking = useBookingStore((state) => state.updateBooking);
  const deleteBooking = useBookingStore((state) => state.deleteBooking);

  const [activeTab, setActiveTab] = useState("bookings");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRef = useRef(null);

  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [address, setAddress] = useState("");
  const [datetime, setDatetime] = useState("");
  const [editBooking, setEditBooking] = useState(null);

  const handleCreateBooking = async (newBooking) => {
  try {
    await addBooking(newBooking); // ✅ Use the store function (which already does the POST + state update)
    toast.success("Booking created!");
    } catch (error) {
      console.error("Failed to save booking:", error);
      toast.error("Failed to save booking");
    } finally {
      setShowCreateModal(false);
      setType("");
      setCategory("");
      setService("");
      setAddress("");
      setDatetime("");
    }
  };

  const handleUpdateBooking = async (updatedBooking) => {
    try {
      await axios.put(`/bookings/${updatedBooking.id}`, updatedBooking);
      updateBooking(updatedBooking.id, updatedBooking);
      toast.success("Booking updated!");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update booking");
    } finally {
      setEditBooking(null);
    }
  };

  const handleDeleteBooking = async (id) => {
  if (!window.confirm("Are you sure you want to delete this booking?")) return;

  try {
    console.log("🔍 Trying to delete booking ID:", id); // 👈 ADD THIS

    await axios.delete(`/bookings/${id}`);
    deleteBooking(id);
    toast.success("Booking deleted!");
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);
    toast.error("Failed to delete booking");
  }
};


  return (
    <div className="p-8 relative bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Bookings page</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-2 font-medium ${
            activeTab === "bookings"
              ? "border-b-2 border-black text-black"
              : "text-gray-500"
          }`}
        >
          Bookings
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`pb-2 font-medium ${
            activeTab === "schedule"
              ? "border-b-2 border-black text-black"
              : "text-gray-500"
          }`}
        >
          Schedule
        </button>
      </div>

      {activeTab === "bookings" && (
        <>
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 border rounded-md text-sm bg-white">Day</button>
              <button className="px-3 py-1 border rounded-md text-sm bg-white">6AM - 9PM</button>
              <button className="px-3 py-1 border rounded-md text-sm bg-white">All addresses</button>
              <button className="px-3 py-1 border rounded-md text-sm bg-white">Filter by</button>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border rounded-md"
              />
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Create new booking
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-md relative overflow-visible z-50">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-700 text-sm">
                <tr>
                  <th className="px-6 py-3 font-semibold">Booking ID</th>
                  <th className="px-6 py-3 font-semibold">Type of service</th>
                  <th className="px-6 py-3 font-semibold">Service Category</th>
                  <th className="px-6 py-3 font-semibold">Service</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3">{booking.bookingId}</td>
                    <td className="px-4 py-3">{booking.type}</td>
                    <td className="px-4 py-3">{booking.category}</td>
                    <td className="px-4 py-3">{booking.service}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === "Active"
                            ? "bg-[#1FC16B]/20 text-[#1FC16B]"
                            : booking.status === "Upcoming"
                            ? "bg-[#FF8447]/20 text-[#FF8447]"
                            : booking.status === "Pending"
                            ? "bg-[#47DDFF]/20 text-[#47DDFF]"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        ● {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 relative">
                      <button onClick={() => setOpenDropdownIndex(index)}>
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      {openDropdownIndex === index && (
                        <div
                          ref={dropdownRef}
                          className="absolute z-10 right-0 mt-2 w-40 bg-white border rounded-md shadow-md py-2 text-sm"
                        >
                          <button
  onClick={() => {
    setEditBooking(booking); // set entire object, including numeric id
    setOpenDropdownIndex(null);
  }}
  className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
>
  <PencilIcon className="w-4 h-4 mr-2" /> Edit
</button>

                          <button
  onClick={async () => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(booking.id); // central delete logic
toast.success("Booking deleted!");
      } catch (err) {
        toast.error("Failed to delete booking");
        console.error("Delete error:", err);
      }
    }
    setOpenDropdownIndex(null);
  }}
  className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
>
  <TrashIcon className="w-4 h-4 mr-2 text-red-600" /> Delete
</button>


                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showCreateModal && (
            <AssignBookingModal
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateBooking}
              type={type}
              category={category}
              service={service}
              address={address}
              datetime={datetime}
              setType={setType}
              setCategory={setCategory}
              setService={setService}
              setAddress={setAddress}
              setDatetime={setDatetime}
            />
          )}
        </>
      )}

      {activeTab === "schedule" && (
        <div className="mt-8">
          <ScheduleCalendar bookings={bookings} />
        </div>
      )}

      {/* ✅ Edit Booking Modal */}
      {editBooking && (
        <AssignBookingModal
          booking={editBooking}
          onClose={() => setEditBooking(null)}
          onCreate={handleUpdateBooking}
          type={editBooking.type}
          category={editBooking.category}
          service={editBooking.service}
          address={editBooking.address}
          datetime={editBooking.datetime}
          setType={(val) => setEditBooking({ ...editBooking, type: val })}
          setCategory={(val) => setEditBooking({ ...editBooking, category: val })}
          setService={(val) => setEditBooking({ ...editBooking, service: val })}
          setAddress={(val) => setEditBooking({ ...editBooking, address: val })}
          setDatetime={(val) => setEditBooking({ ...editBooking, datetime: val })}
        />
      )}
    </div>
  );
}
