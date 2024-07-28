import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    user: {
        id: '',
        email: '',
        authenticated: 'authenticating' // 'authenticating', 'authenticated', 'failed'
    },
    setUser: (data) => set({ user: data })
}))