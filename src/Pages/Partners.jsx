import React, { useState } from "react";
import { useEffect } from "react";
import { useBookingStore } from "../store/bookingStore";
import { toast } from "react-hot-toast";
import axios from "axios";
import { supabase } from "../supabaseClient";




export default function Partners() {
  const partners = useBookingStore((state) => state.partners);
  const addPartner = useBookingStore((state) => state.addPartner);
  const deletePartner = useBookingStore((state) => state.deletePartner);
  const fetchPartners = useBookingStore((state) => state.fetchPartners);
  const updatePartner = useBookingStore((state) => state.updatePartner);


useEffect(() => {
  fetchPartners(); // 🟢 This loads partners from Supabase
}, []);


  const [newPartner, setNewPartner] = useState("");
  const [editedPartner, setEditedPartner] = useState(null);

 const handleAdd = async () => {
  if (!newPartner.trim()) return;

  try {
    await addPartner({ name: newPartner.trim() }); // ✅ THIS LINE IS CRITICAL
    setNewPartner("");
    toast.success("Partner added");
  } catch (err) {
    console.error("Failed to add partner:", err);
    toast.error("Failed to add partner");
  }



    
  };
  const handleSaveEdit = async () => {
  if (!editedPartner?.name.trim()) {
    toast.error("Name cannot be empty.");
    return;
  }

  const success = await updatePartner(editedPartner.id, editedPartner.name.trim());
  if (success) {
    toast.success("Partner name updated");
    setEditedPartner(null);
  } else {
    toast.error("Failed to update partner");
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
  onClick={handleSaveEdit}
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
      const { error } = await supabase
        .from("partners")
        .delete()
        .eq("id", partner.id);

      if (error) throw error;

      deletePartner(partner.id); // Remove from local store
      toast.success("Partner deleted");
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
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
