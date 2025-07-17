import React, { useState } from "react";
import { useBookingStore } from "../store/bookingStore";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Partners() {
  const partners = useBookingStore((state) => state.partners);
  const addPartner = useBookingStore((state) => state.addPartner);
  const deletePartner = useBookingStore((state) => state.deletePartner);
  const editPartner = useBookingStore((state) => state.editPartner);

  const [newPartner, setNewPartner] = useState("");
  const [editedPartner, setEditedPartner] = useState(null);

 const handleAdd = async () => {
  if (!newPartner.trim()) return;

  try {
    await addPartner({ name: newPartner.trim() }); // ✅ only this
    setNewPartner("");
    toast.success("Partner added");
  } catch (err) {
    console.error("Failed to save partner:", err);
    toast.error("Failed to add partner");
  }
};


  const handleRename = async () => {
    if (!editedPartner.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/partners/${editedPartner.id}`, {
        ...editedPartner,
        name: editedPartner.name.trim(),
      });

      editPartner(editedPartner.id, editedPartner.name.trim());
      toast.success("Partner renamed successfully.");
      setEditedPartner(null);
    } catch (err) {
      console.error("Rename failed:", err);
      toast.error("Failed to rename partner");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Add New Partner</h1>

      {/* Input Form */}
      <div className="flex items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Partner Name"
          value={newPartner}
          onChange={(e) => setNewPartner(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-64"
        />
        <button
          onClick={handleAdd}
          className="bg-[#05A54B] text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Partner
        </button>
      </div>

      <h2 className="text-lg font-medium mb-4">Existing Partners</h2>

      {editedPartner && (
        <div className="flex items-center gap-3 mb-8">
          <input
            type="text"
            placeholder="Edit Partner Name"
            value={editedPartner.name}
            onChange={(e) =>
              setEditedPartner({ ...editedPartner, name: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 rounded w-64"
          />
          <button
            onClick={handleRename}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={() => setEditedPartner(null)}
            className="text-gray-600 px-3 py-2 rounded hover:text-red-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Partner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white border p-4 rounded-lg shadow flex items-center justify-between gap-4"
          >
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                {partner.name[0]}
              </div>
              <div>
                <div className="font-medium text-gray-800">{partner.name}</div>
                <div className="text-sm text-gray-500">Partner ID: {partner.id}</div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setEditedPartner({ id: partner.id, name: partner.name })
                }
                className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100"
              >
                <span className="font-medium text-gray-700">Edit</span>
              </button>

              <button
                onClick={async () => {
                  if (confirm(`Delete partner "${partner.name}"?`)) {
                    try {
                      await axios.delete(`http://localhost:3001/partners/${partner.id}`);
                      deletePartner(partner.id);
                      toast.success("Partner deleted and unassigned from bookings.");
                    } catch (err) {
                      console.error("Delete failed:", err);
                      toast.error("Failed to delete partner");
                    }
                  }
                }}
                className="px-3 py-1 rounded border border-red-400 text-sm hover:bg-red-100"
              >
                <span className="font-medium text-red-600">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
