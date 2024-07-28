import { create } from 'zustand'

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (data) => set((state) => ({ ...state, products: data })),
    cart: [],
    setCart: (data) => set((state) => ({ ...state, cart: data }))
}))