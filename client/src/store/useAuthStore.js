import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    user: {
        id: '',
        email: '',
        authenticated: false
    },
    setUser: (data) => set({ user: data })
}))