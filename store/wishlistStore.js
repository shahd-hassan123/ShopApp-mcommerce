import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import * as Haptics from 'expo-haptics'
export const useWishlistStore = create((set, get) => ({items: [],loading: false,
fetchWishlist: async (userId) => {set({ loading: true })
const { data, error } = await supabase
.from('wishlist')
.select('*')
.eq('user_id', userId)
if (!error) set({ items: data || [] })
set({ loading: false })},
addToWishlist: async (userId, product) => {const exists = get().items.find(i => i.product_id === String(product.id))
if (exists) return
const { data, error } = await supabase
.from('wishlist')
.insert({user_id: userId,product_id: String(product.id),product_name: product.name, product_price: product.price,product_image: product.image_url,product_category: product.category,})
.select()
if (!error && data) {
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
set({ items: [...get().items, data[0]] })
}},
removeFromWishlist: async (wishlistId) => {await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
await supabase.from('wishlist').delete().eq('id', wishlistId)
set({ items: get().items.filter(i => i.id !== wishlistId) })},
isInWishlist: (productId) => {return get().items.some(i => i.product_id === String(productId))},}))