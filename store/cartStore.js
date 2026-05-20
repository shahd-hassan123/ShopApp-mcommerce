import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { sendLocalNotification } from '../lib/notifications'
import * as Haptics from 'expo-haptics'
export const useCartStore = create((set, get) => ({items: [],
addToCart: async (product) => {const items = get().items
const existing = items.find(i => i.id === product.id)
let newItems
if (existing) {newItems = items.map(i =>
i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)} else {
newItems = [...items, { ...product, quantity: 1 }]}
set({ items: newItems })
await AsyncStorage.setItem('cart', JSON.stringify(newItems))
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
await sendLocalNotification('🛒 Added to Cart!',`${product.name} has been added to your cart`)},
removeFromCart: async (productId) => {await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
const newItems = get().items.filter(i => i.id !== productId)
set({ items: newItems })
await AsyncStorage.setItem('cart', JSON.stringify(newItems))},
updateQuantity: async (productId, quantity) => {await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
if (quantity < 1) {get().removeFromCart(productId)
return}
const newItems = get().items.map(i =>
i.id === productId ? { ...i, quantity } : i)
set({ items: newItems })
await AsyncStorage.setItem('cart', JSON.stringify(newItems))},
clearCart: async () => {set({ items: [] })
await AsyncStorage.removeItem('cart')},
loadCart: async () => {const saved = await AsyncStorage.getItem('cart')
if (saved) set({ items: JSON.parse(saved) })},
getTotalPrice: () => {return get().items.reduce((total, item) => total + item.price * item.quantity, 0)},getTotalItems: () => {return get().items.reduce((total, item) => total + item.quantity, 0)},}))