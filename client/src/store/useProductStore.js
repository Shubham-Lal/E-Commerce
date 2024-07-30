import { create } from 'zustand'

export const useProductStore = create((set) => ({
    products: {
        status: '', // 'fetching', 'fetched', 'failed'
        items: []
    },
    setProducts: (products) => set({ products }),
    cart: {
        status: '', // 'fetching', 'fetched', 'failed'
        items: []
    },
    setCart: (cart) => set({ cart })
}))