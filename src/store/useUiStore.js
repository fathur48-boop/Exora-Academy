import { create } from "zustand";

export const useUiStore = create((set) => ({
  toast: null,
  showToast: (message, tone = "success") => {
    set({ toast: { message, tone } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  clearToast: () => set({ toast: null }),
}));
