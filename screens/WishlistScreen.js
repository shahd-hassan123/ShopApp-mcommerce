import React, { useEffect } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator
} from 'react-native'
import { useWishlistStore } from '../store/wishlistStore'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useThemeStore } from '../lib/theme'

export default function WishlistScreen({ navigation }) {
  const { user } = useAuthStore()
  const { items, loading, fetchWishlist, removeFromWishlist } = useWishlistStore()
  const { addToCart } = useCartStore()
  const { theme } = useThemeStore()
useEffect(() => {fetchWishlist(user.id)}, [])
if (loading) {
return (
<View style={[styles.centered, { backgroundColor: theme.background }]}>
<ActivityIndicator size="large" color={theme.primary} />
<Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading wishlist...</Text>
</View>)}
return (
<View style={[styles.container, { backgroundColor: theme.background }]}>
<View style={[styles.header, { borderBottomColor: theme.border }]}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Text style={styles.backBtn}>← Back</Text>
</TouchableOpacity>
<Text style={[styles.headerTitle, { color: theme.text }]}>My Wishlist ❤️</Text>
<View style={{ width: 60 }} />
</View>
{items.length === 0 ? (
 <View style={styles.empty}>
<Text style={styles.emptyIcon}>❤️</Text>
<Text style={[styles.emptyTitle, { color: theme.text }]}>Wishlist is empty</Text>
<Text style={[styles.emptyText, { color: theme.textSecondary }]}>Tap ❤️ on any product to save it here</Text>
<TouchableOpacity style={styles.shopBtn} onPress={() => navigation.goBack()}>
<Text style={styles.shopBtnText}>Browse Products</Text>
</TouchableOpacity>
</View>
) : (
<FlatList
data={items}
keyExtractor={(item) => item.id}
contentContainerStyle={styles.list}
renderItem={({ item }) => (
<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
<Image source={{ uri: item.product_image }} style={styles.image} />
<View style={styles.cardBody}>
<Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>{item.product_name}</Text>
<Text style={[styles.productCategory, { color: theme.textSecondary }]}>{item.product_category}</Text>
<Text style={[styles.productPrice, { color: theme.primary }]}>${item.product_price}</Text>
<View style={styles.btnRow}>
<TouchableOpacity
style={styles.addBtn}
onPress={() => addToCart({
id: item.product_id,name: item.product_name,price: item.product_price,image_url: item.product_image,category: item.product_category,})}>
<Text style={styles.addBtnText}>🛒 Add to Cart</Text>
</TouchableOpacity>
<TouchableOpacity
style={[styles.removeBtn, { backgroundColor: theme.backgroundSecondary }]}onPress={() => removeFromWishlist(item.id)}>
<Text style={styles.removeBtnText}>🗑️</Text>
</TouchableOpacity> </View></View></View>)}
/>)}
</View>)
}
const styles = StyleSheet.create({container: { flex: 1 },centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },loadingText: { marginTop: 12, fontSize: 14 },
header: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',
paddingHorizontal: 16,paddingTop: 60,paddingBottom: 16,borderBottomWidth: 1,},
headerTitle: { fontSize: 17, fontWeight: '700' },backBtn: { fontSize: 15, color: '#6C63FF', fontWeight: '600' },empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
emptyIcon: { fontSize: 64, marginBottom: 16 },emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },emptyText: { fontSize: 14, marginBottom: 32, textAlign: 'center' },shopBtn: { backgroundColor: '#6C63FF', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40 },
shopBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },list: { padding: 16 },card: { flexDirection: 'row', borderRadius: 16, marginBottom: 12, padding: 12, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, alignItems: 'center' },
image: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F5F5F5' },cardBody: { flex: 1, paddingLeft: 12 },productName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },productCategory: { fontSize: 11, marginBottom: 4 },
productPrice: { fontSize: 15, fontWeight: '700', marginBottom: 8 },btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },addBtn: { backgroundColor: '#6C63FF', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, flex: 1, alignItems: 'center' },
addBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },removeBtn: { borderRadius: 8, padding: 6 },removeBtnText: { fontSize: 16 },})