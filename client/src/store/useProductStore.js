import { create } from 'zustand'

export const useProductStore = create((set) => ({
    products: {
        status: '', // 'fetching', 'fetched', 'failed'
        items: []
    },
    setProducts: (products) => set({ products }),
    cart: [],
    setCart: (data) => set((state) => ({ ...state, cart: data }))
}))