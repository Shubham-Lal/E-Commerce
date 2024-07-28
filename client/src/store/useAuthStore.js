import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    user: {
        id: '',
        email: '',
        role: '', // 'user', 'admin'
        auth: 'authenticating' // 'authenticating', 'authenticated', 'failed'
    },
    setUser: (data) => set({ user: data })
}))