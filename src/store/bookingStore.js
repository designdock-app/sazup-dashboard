// bookingStore.js
import { create } from "zustand";
import axios from "axios";

export const useBookingStore = create((set, get) => ({
  bookings: [],
  partners: [],

  // Load bookings from JSON Server
  fetchBookings: async () => {
    const response = await axios.get("http://localhost:3001/bookings");
    set({ bookings: response.data });
  },

  // Load partners from JSON Server
  fetchPartners: async () => {
    const response = await axios.get("http://localhost:3001/partners");
    set({ partners: response.data });
  },

  // Add a booking and persist it
  addBooking: async (newBooking) => {
  const generateBookingId = () => {
    const now = new Date();
    const datePart = now.toISOString().split("T")[0].replace(/-/g, "");
    const timePart = now.getHours().toString().padStart(2, "0") + now.getMinutes().toString().padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `BK-${datePart}-${timePart}-${rand}`;
  };

  const bookingWithId = {
    ...newBooking,
    bookingId: generateBookingId(),
  };

  const response = await axios.post("http://localhost:3001/bookings", bookingWithId);

  // ✅ Check if booking already exists before adding
  set((state) => {
    const exists = state.bookings.some(
      (b) => b.bookingId === response.data.bookingId
    );
    if (exists) return {}; // Don't add duplicate
    return {
      bookings: [...state.bookings, response.data],
    };
  });
},


  // Assign partner to booking and persist
  assignPartner: async (bookingId, partnerName) => {
    const bookingToUpdate = get().bookings.find((b) => b.id === bookingId);
    if (!bookingToUpdate) return;

    const updatedBooking = { ...bookingToUpdate, partner: partnerName };
    await axios.put(`http://localhost:3001/bookings/${bookingId}`, updatedBooking);

    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? updatedBooking : b
      ),
    }));
  },

  // Add partner and persist
  addPartner: async (newPartner) => {
    const response = await axios.post("/partners", newPartner); // ✅ no localhost hardcoding
    set((state) => ({
      partners: [...state.partners, response.data],
    }));
  },

  // Edit partner and update associated bookings
  editPartner: async (partnerId, newName) => {
    const currentPartner = get().partners.find((p) => p.id === partnerId);
    if (!currentPartner) return;

    const updatedPartner = { ...currentPartner, name: newName };
    await axios.put(`http://localhost:3001/partners/${partnerId}`, updatedPartner);

    const updatedBookings = get().bookings.map((b) =>
      b.partner === currentPartner.name ? { ...b, partner: newName } : b
    );
    await Promise.all(
      updatedBookings.map((b) =>
        axios.put(`http://localhost:3001/bookings/${b.id}`, b)
      )
    );

    set((state) => ({
      partners: state.partners.map((p) =>
        p.id === partnerId ? updatedPartner : p
      ),
      bookings: updatedBookings,
    }));
  },

  // Delete partner and unassign from bookings
  deletePartner: async (partnerId) => {
    const removedPartner = get().partners.find((p) => p.id === partnerId);
    if (!removedPartner) return;

    await axios.delete(`http://localhost:3001/partners/${partnerId}`);

    const updatedBookings = get().bookings.map((b) =>
      b.partner === removedPartner.name ? { ...b, partner: "" } : b
    );
    await Promise.all(
      updatedBookings.map((b) =>
        axios.put(`http://localhost:3001/bookings/${b.id}`, b)
      )
    );

    set((state) => ({
      partners: state.partners.filter((p) => p.id !== partnerId),
      bookings: updatedBookings,
    }));
  },
  // ✅ UPDATE BOOKING AND UPDATE LOCAL STATE
updateBooking: async (bookingId, updatedBooking) => {
  try {
    await axios.put(`http://localhost:3001/bookings/${bookingId}`, updatedBooking);
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? updatedBooking : b
      ),
    }));
  } catch (err) {
    console.error("Failed to update booking:", err);
  }
},


  // ✅ DELETE BOOKING AND UPDATE LOCAL STATE
  deleteBooking: async (bookingId) => {
    try {
      await axios.delete(`http://localhost:3001/bookings/${bookingId}`);
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== bookingId),
      }));
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  },
}));
