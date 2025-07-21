import React, { useState, useEffect } from "react";
import { useBookingStore } from "../store/bookingStore";
import AssignBookingModal from "../components/AssignBookingModal";
import { toast } from "react-hot-toast";
import { FiMoreVertical } from "react-icons/fi";

export default function Bookings() {
  const {
    bookings,
    fetchBookings,
    addBooking,
    updateBooking,
    deleteBooking,
  } = useBookingStore();

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const bookingsPerPage = 30;



const indexOfLastBooking = currentPage * bookingsPerPage;
const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

const totalPages = Math.ceil(bookings.length / bookingsPerPage);
console.log("Total bookings:", bookings.length);
console.log("Total pages:", totalPages);


  
  

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCreate = async (newBooking) => {
    const success = await addBooking(newBooking);
    if (success) {
  toast.success("Booking added");
  setShowModal(false);
  setCurrentPage(1); // 👈 Reset to first page
}
else {
      toast.error("Error adding booking");
    }
  };
  

  const handleUpdate = async (updatedBooking) => {
    const success = await updateBooking(updatedBooking);
    if (success) {
      toast.success("Booking updated");
      setShowModal(false);
      setEditMode(false);
      setSelectedBooking(null);
    } else {
      toast.error("Error updating booking");
    }
  };

 const handleDelete = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this booking?");
  if (!confirmed) return;

  const success = await deleteBooking(id);
  if (success) {
  toast.success("Booking deleted successfully");
  setCurrentPage(1); // 👈 Reset to first page
} else {
  toast.error("Failed to delete booking");
}
};


  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Bookings page</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setSelectedBooking(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create new booking
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded">
        <table className="w-full table-auto text-sm">
  <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
    <tr>
      <th className="p-3">Booking ID</th>
      <th className="p-3">Type of service</th>
      <th className="p-3">Service Category</th>
      <th className="p-3">Service</th>
      <th className="p-3">Status</th>
      <th className="p-3">Actions</th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-100 text-gray-800">
    {currentBookings.map((b) => (

      <tr
        key={b.id}
        className="hover:bg-gray-50 transition duration-100"
      >
        <td className="p-3">{b.bookingId || `ADM${b.id}`}</td>
        <td className="p-3">{b.type}</td>
        <td className="p-3">{b.category}</td>
        <td className="p-3">{b.service}</td>
        <td className="p-3">
  <span
    className={`status-pill ${
      b.status === "Upcoming"
        ? "status-upcoming"
        : b.status === "Pending"
        ? "status-pending"
        : b.status === "Active"
        ? "status-active"
        : ""
    }`}
  >
    {b.status}
  </span>
</td>


        <td className="p-3 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown((prev) => (prev === b.id ? null : b.id));
            }}
            className="p-2 rounded hover:bg-gray-200"
          >
            <FiMoreVertical size={16} />
          </button>

          {openDropdown === b.id && (
            <div
              className="absolute right-4 top-9 bg-white border rounded shadow w-28 z-10"
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => {
  setSelectedBooking(b);
  setShowModal(true);
}}

                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
  onClick={() => handleDelete(b.id)}
  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
>
  Delete
</button>

            </div>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>



      </div>
      {totalPages > 1 && (
  <div className="flex justify-center mt-6 gap-2 items-center">
    {/* Previous Arrow */}
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className={`px-3 py-1 min-w-[32px] text-center rounded-full border text-sm shadow-sm transition-colors ${

        currentPage === 1
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100"
      }`}
    >
      ←
    </button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 rounded-full border text-sm transition-colors ${
          page === currentPage
            ? "bg-green-600 text-white font-medium shadow"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        {page}
      </button>
    ))}

    {/* Next Arrow */}
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded-full border text-sm transition-colors ${
        currentPage === totalPages
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100"
      }`}
    >
      →
    </button>
  </div>
)}

      {/* Modal */}
      {showModal && (
  <AssignBookingModal
    booking={selectedBooking}
    onClose={() => {
      setShowModal(false);
      setSelectedBooking(null); // Clear after close
    }}
    onCreate={handleCreate}
  />
)}



    </div>
  );
}
