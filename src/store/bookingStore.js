// src/store/bookingStore.js
import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useBookingStore = create((set, get) => ({
  bookings: [],
  partners: [],

  fetchBookings: async () => {
    const { data, error } = await supabase.from('bookings').select('*');
    if (!error) set({ bookings: data });
    else console.error("❌ Error fetching bookings:", error);
  },

  fetchPartners: async () => {
    const { data, error } = await supabase.from('partners').select('*');
    if (!error) set({ partners: data });
    else console.error("❌ Error fetching partners:", error);
  },

  addPartner: async (partner) => {
    const { data, error } = await supabase
      .from("partners")
      .insert([{ name: partner.name }])
      .select();
    if (error) throw error;
    set((state) => ({ partners: [...state.partners, ...data] }));
  },

  addBooking: async (booking) => {
    const { data, error } = await supabase.from('bookings').insert([booking]).select();
    if (error) return false;
    set((state) => ({ bookings: [...state.bookings, data[0]] }));
    return true;
  },

   assignPartner: async (bookingId, partnerName) => {
    const state = get();
    const partner = state.partners.find((p) => p.name === partnerName);
    if (!partner) {
      console.error("❌ Partner not found:", partnerName);
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({ partner_id: partner.id })
      .eq("id", bookingId)
      .select();

    if (error) {
      console.error("❌ Failed to assign partner:", error.message);
    } else {
      console.log("✅ Partner assigned in Supabase:", data);

      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? { ...b, partner_id: partner.id } : b
        ),
      }));
    }
  },

  deleteBooking: async (id) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) {
      console.error('❌ Error deleting booking:', error);
      return false;
    } else {
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id),
      }));
      return true;
    }
  },
  updatePartner: async (id, newName) => {
    const { error } = await supabase
      .from("partners")
      .update({ name: newName })
      .eq("id", id);

    if (error) {
      console.error("❌ Error updating partner:", error);
      return false;
    }

    set((state) => ({
      partners: state.partners.map((p) =>
        p.id === id ? { ...p, name: newName } : p
      ),
    }));
    return true;
  },

}));

