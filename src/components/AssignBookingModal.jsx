import React, { useState } from "react";
import { useBookingStore } from "../store/bookingStore";
import toast from "react-hot-toast";


export default function AssignBookingModal({
  booking = {},
  onCreate,
  onClose,
  type: parentType,
  category: parentCategory,
  service: parentService,
  address: parentAddress,
  datetime: parentDatetime,
  setType: setParentType,
  setCategory: setParentCategory,
  setService: setParentService,
  setAddress: setParentAddress,
  setDatetime: setParentDatetime,
}) {
  const partners = useBookingStore((state) => state.partners);


  function generateBookingId(datetime) {
    const datePart = datetime.split("T")[0].replace(/-/g, "");
    const timePart = datetime.split("T")[1].slice(0, 5).replace(":", "");
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BK-${datePart}-${timePart}-${random}`;
  }

  const [type, setType] = useState(booking?.type || parentType || "");
const [category, setCategory] = useState(booking?.category || parentCategory || "");
const [service, setService] = useState(booking?.service || parentService || "");
const [address, setAddress] = useState(booking?.address || parentAddress || "");
const [datetime, setDatetime] = useState(
  booking?.datetime || parentDatetime || ""
);


  const [status, setStatus] = useState(booking?.status || "Upcoming");
  const [selectedPartner, setSelectedPartner] = useState(booking?.partner || "");


const handleSubmit = () => {
  if (!datetime || !datetime.includes("T")) {
    toast.error("Please enter a valid date and time.");
    return;
  }

  const updatedBooking = {
    ...booking, // include all existing fields
    id: booking.id || generateBookingId(datetime),
    type,
    category,
    service,
    address,
    date: new Date(datetime).toISOString().split("T")[0],
    time: datetime.split("T")[1],
    datetime,
    partner: selectedPartner || booking.partner || "",
    status: status || booking.status || "Pending",
  };

  console.log("✅ handleSubmit fired, booking is:", updatedBooking);

  // Clear parent form state if creating
  if (setParentType) setParentType("");
  if (setParentCategory) setParentCategory("");
  if (setParentService) setParentService("");
  if (setParentAddress) setParentAddress("");
  if (setParentDatetime) setParentDatetime("");

  onCreate?.(updatedBooking);
  onClose?.();
};




 return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
  {booking?.id ? "Edit Booking" : "Create New Booking"}
</h2>


        <div className="space-y-3 mb-4">
          <input
  type="datetime-local"
  value={datetime}
  onChange={(e) => {
    setDatetime(e.target.value);
    if (setParentDatetime) setParentDatetime(e.target.value);
  }}
  className="w-full border rounded p-2"
/>

<input
  type="text"
  value={type}
  onChange={(e) => {
    setType(e.target.value);
    if (setParentType) setParentType(e.target.value);
  }}
  placeholder="Type of Service"
  className="w-full border rounded p-2"
/>

<input
  type="text"
  value={category}
  onChange={(e) => {
    setCategory(e.target.value);
    if (setParentCategory) setParentCategory(e.target.value);
  }}
  placeholder="Category"
  className="w-full border rounded p-2"
/>

<input
  type="text"
  value={service}
  onChange={(e) => {
    setService(e.target.value);
    if (setParentService) setParentService(e.target.value);
  }}
  placeholder="Service"
  className="w-full border rounded p-2"
/>

<input
  type="text"
  value={address}
  onChange={(e) => {
    setAddress(e.target.value);
    if (setParentAddress) setParentAddress(e.target.value);
  }}
  placeholder="Address"
  className="w-full border rounded p-2"
/>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>

        <select
  className="w-full p-2 border rounded mb-4"
  value={selectedPartner}
  onChange={(e) => setSelectedPartner(e.target.value)}
>
  <option value="">Select Partner</option>
  {partners.map((partner) => (
    <option key={partner.id} value={partner.name}>
      {partner.name}
    </option>
  ))}
</select>


        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
