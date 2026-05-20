import React, { useState } from 'react'
import {View, Text, Image, TouchableOpacity,StyleSheet, ScrollView, Alert
} from 'react-native'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../lib/theme'
import { formatPrice, loadCurrency } from '../lib/localization'
import * as Haptics from 'expo-haptics'
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const REVIEWS = [
{ id: 1, name: 'Sarah M.', rating: 5, comment: 'Absolutely love it! Great quality and fast delivery.', date: '2 days ago' },
{ id: 2, name: 'John D.', rating: 4, comment: 'Really good product, fits perfectly. Highly recommend!', date: '1 week ago' },
{ id: 3, name: 'Emma K.', rating: 5, comment: 'Best purchase I made this year. Will buy again!', date: '2 weeks ago' },
]
function StarRating({ rating }) {
return (<View style={{ flexDirection: 'row', gap: 2 }}>
{[1, 2, 3, 4, 5].map(i => (
<Text key={i} style={{ fontSize: 14, color: i <= rating ? '#FFD700' : '#DDD' }}>★</Text>))}
</View>)}
export default function ProductDetailScreen({ route, navigation }) {
const { product } = route.params
const { addToCart } = useCartStore()
const { addToWishlist, isInWishlist } = useWishlistStore()
const { user } = useAuthStore()
const { theme } = useThemeStore()
const [selectedSize, setSelectedSize] = useState('M')
const [quantity, setQuantity] = useState(1)
const [currency, setCurrency] = useState('USD')
React.useEffect(() => {loadCurrency().then(setCurrency)}, [])
const handleAddToCart = async () => {
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
for (let i = 0; i < quantity; i++) {
await addToCart({ ...product, selectedSize })}
Alert.alert('✅ Added!', `${product.name} (Size: ${selectedSize}) added to cart!`)}
const averageRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1)
return (
<View style={[styles.container, { backgroundColor: theme.background }]}>
<View style={[styles.header, { backgroundColor: theme.background }]}>
<TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.backgroundSecondary }]} onPress={() => navigation.goBack()}>
<Text style={[styles.backBtnText, { color: theme.text }]}>←</Text>
</TouchableOpacity>
<Text style={[styles.headerTitle, { color: theme.text }]}>Product Details</Text>
<TouchableOpacity
style={[styles.wishBtn, { backgroundColor: theme.backgroundSecondary }]}
onPress={() => addToWishlist(user.id, product)}
>
<Text style={{ fontSize: 20 }}>{isInWishlist(product.id) ? '❤️' : '🤍'}</Text>
</TouchableOpacity>
</View>
<ScrollView showsVerticalScrollIndicator={false}>
<Image source={{ uri: product.image_url }} style={styles.image} />
<View style={styles.body}>
<View style={styles.topRow}>
<View style={[styles.categoryBadge, { backgroundColor: theme.backgroundSecondary }]}>
<Text style={[styles.categoryText, { color: theme.primary }]}>{product.category}</Text>
</View>
<View style={styles.ratingRow}>
<Text style={{ fontSize: 14, color: '#FFD700' }}>★</Text>
<Text style={[styles.ratingText, { color: theme.text }]}>{averageRating}</Text>
<Text style={[styles.reviewCount, { color: theme.textSecondary }]}>({REVIEWS.length} reviews)</Text>
</View></View>
<Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
<Text style={[styles.productPrice, { color: theme.primary }]}>{formatPrice(product.price, currency)}</Text>
<View style={[styles.stockRow, { backgroundColor: product.stock < 5 ? '#FFF0F0' : '#F0FFF4' }]}>
<Text style={{ color: product.stock < 5 ? '#FF4444' : '#22C55E', fontSize: 13, fontWeight: '600' }}>
{product.stock < 5 ? `⚠️ Only ${product.stock} items left!` : `✅ In Stock (${product.stock} available)`}
</Text>
</View>
<Text style={[styles.sectionTitle, { color: theme.text }]}>Product Details</Text>
<Text style={[styles.description, { color: theme.textSecondary }]}>
{product.description || 'Premium quality product crafted with the finest materials. Designed for comfort and style, this product is perfect for everyday use. Experience the difference with our carefully curated collection.'}
</Text>
<Text style={[styles.sectionTitle, { color: theme.text }]}>Select Size</Text>
<View style={styles.sizesRow}>
{SIZES.map(size => (
<TouchableOpacity
key={size}
style={[
styles.sizeBtn,
{ borderColor: theme.border, backgroundColor: theme.backgroundSecondary },
selectedSize === size && styles.sizeBtnActive]}
onPress={() => setSelectedSize(size)}
>
<Text style={[styles.sizeBtnText,
{ color: theme.textSecondary },
 selectedSize === size && styles.sizeBtnTextActive
]}>
{size}
</Text>
</TouchableOpacity>))}
</View>
<Text style={[styles.sectionTitle, { color: theme.text }]}>Quantity</Text>
<View style={styles.qtyRow}>
<TouchableOpacity
style={[styles.qtyBtn, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
onPress={() => setQuantity(Math.max(1, quantity - 1))}
>
<Text style={[styles.qtyBtnText, { color: theme.text }]}>−</Text>
</TouchableOpacity>
<Text style={[styles.qtyText, { color: theme.text }]}>{quantity}</Text>
<TouchableOpacity
style={[styles.qtyBtn, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
onPress={() => setQuantity(quantity + 1)}
>
<Text style={[styles.qtyBtnText, { color: theme.text }]}>+</Text>
</TouchableOpacity>
<Text style={[styles.qtyTotal, { color: theme.textSecondary }]}>
Total: <Text style={{ color: theme.primary, fontWeight: '700' }}>{formatPrice(product.price * quantity, currency)}</Text>
</Text>
</View>
<Text style={[styles.sectionTitle, { color: theme.text }]}>Reviews ⭐</Text>
<View style={[styles.ratingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
<Text style={[styles.bigRating, { color: theme.text }]}>{averageRating}</Text>
<StarRating rating={Math.round(averageRating)} />
<Text style={[styles.ratingLabel, { color: theme.textSecondary }]}>Based on {REVIEWS.length} reviews</Text>
</View>
{REVIEWS.map(review => (
<View key={review.id} style={[styles.reviewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
<View style={styles.reviewHeader}>
<View style={[styles.reviewAvatar, { backgroundColor: theme.primary }]}>
<Text style={styles.reviewAvatarText}>{review.name.charAt(0)}</Text></View>
<View style={styles.reviewInfo}>
<Text style={[styles.reviewName, { color: theme.text }]}>{review.name}</Text>
<Text style={[styles.reviewDate, { color: theme.textSecondary }]}>{review.date}</Text>
</View>
<StarRating rating={review.rating} />
</View>
<Text style={[styles.reviewComment, { color: theme.textSecondary }]}>{review.comment}</Text></View>))}
<View style={{ height: 100 }} />
</View></ScrollView>
<View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
<View>
<Text style={[styles.footerLabel, { color: theme.textSecondary }]}>Total Price</Text>
<Text style={[styles.footerPrice, { color: theme.primary }]}>{formatPrice(product.price * quantity, currency)}</Text>
</View>
<TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
<Text style={styles.addToCartBtnText}>🛒 Add to Cart</Text>
</TouchableOpacity></View>
</View>)
}
const styles = StyleSheet.create({container: { flex: 1 },
header: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',paddingHorizontal: 16,paddingTop: 60,paddingBottom: 12,
},backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
backBtnText: { fontSize: 20, fontWeight: '600' },headerTitle: { fontSize: 17, fontWeight: '700' },wishBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
image: { width: '100%', height: 300, backgroundColor: '#F5F5F5' },body: { padding: 16 },
topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },categoryBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
categoryText: { fontSize: 12, fontWeight: '600' },ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
ratingText: { fontSize: 14, fontWeight: '700' },reviewCount: { fontSize: 12 },
productName: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
productPrice: { fontSize: 26, fontWeight: '700', marginBottom: 12 },
stockRow: { borderRadius: 10, padding: 10, marginBottom: 16 },
sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 8 },
description: { fontSize: 14, lineHeight: 22, marginBottom: 8 },
sizesRow: { flexDirection: 'row', gap: 10, marginBottom: 8, flexWrap: 'wrap' },
sizeBtn: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5 },
sizeBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
sizeBtnText: { fontSize: 13, fontWeight: '600' },
sizeBtnTextActive: { color: '#FFFFFF' },
qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
qtyBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
qtyBtnText: { fontSize: 20, fontWeight: '700' },
qtyText: { fontSize: 18, fontWeight: '700', minWidth: 30, textAlign: 'center' },
qtyTotal: { fontSize: 14, marginLeft: 8 },
ratingCard: { borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, marginBottom: 12 },
bigRating: { fontSize: 48, fontWeight: '700' },
ratingLabel: { fontSize: 12, marginTop: 4 },
reviewCard: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 10 },
reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
reviewAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
reviewAvatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
reviewInfo: { flex: 1 },
reviewName: { fontSize: 14, fontWeight: '600' },
reviewDate: { fontSize: 11 },
reviewComment: { fontSize: 13, lineHeight: 20 },
footer: {position: 'absolute',bottom: 0,left: 0,right: 0,flexDirection: 'row',justifyContent: 'space-between',
alignItems: 'center',padding: 20,borderTopWidth: 1,paddingBottom: 34,},
footerLabel: { fontSize: 12, marginBottom: 2 },
footerPrice: { fontSize: 20, fontWeight: '700' },
addToCartBtn: {backgroundColor: '#6C63FF',borderRadius: 16, paddingVertical: 16,
paddingHorizontal: 32,flexDirection: 'row',alignItems: 'center',gap: 8,},addToCartBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
})