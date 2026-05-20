import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { saveProductsToCache, loadProductsFromCache } from '../lib/offlineCache'
import { shouldSync } from '../lib/batterySync'
let realtimeSubscription = null
export const useProductStore = create((set, get) => ({products: [],loading: false,error: null,selectedCategory: 'All',isOffline: false,
setCategory: (category) => set({ selectedCategory: category }),
fetchProducts: async () => {set({ loading: true, error: null })
const canSync = await shouldSync()
if (!canSync) {console.log('Low battery — loading from cache')
const cached = await loadProductsFromCache()
if (cached) {
set({ products: cached, loading: false, isOffline: true })} else {
set({ loading: false, isOffline: true })}
return}
 const { data, error } = await supabase
.from('products')
.select('*')
if (error) {
const cached = await loadProductsFromCache()
if (cached) {
set({ products: cached, loading: false, isOffline: true })
} else {set({ error: 'No data found', loading: false, isOffline: true })
}} else {
await saveProductsToCache(data)
set({ products: data || [], loading: false, isOffline: false })}},
subscribeToStock: () => {if (realtimeSubscription) return
realtimeSubscription = supabase
.channel('products-stock')
.on('postgres_changes',{ event: 'UPDATE', schema: 'public', table: 'products' },
(payload) => {console.log('Stock update received:', payload.new)
const updatedProduct = payload.new
const products = get().products
const updatedProducts = products.map(p =>
p.id === updatedProduct.id ? { ...p, stock: updatedProduct.stock } : p)
set({ products: updatedProducts })})
.subscribe()
console.log('Subscribed to realtime stock updates')},
unsubscribeFromStock: () => {if (realtimeSubscription) {
supabase.removeChannel(realtimeSubscription)
realtimeSubscription = null
console.log('Unsubscribed from realtime stock updates')}},}))