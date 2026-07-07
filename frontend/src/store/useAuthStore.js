import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      auth: null,

      login: (authData) => {
        set({
          auth: authData,
        });
      },

      logout: () => {
        set({
          auth: null,
        });
      },
    }),
    {
      name: "campuspass-auth",
    }
  )
);

export default useAuthStore;