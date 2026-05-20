import React, { useEffect, useState } from 'react'
import {View, Text, FlatList, Image, TouchableOpacity,StyleSheet, ActivityIndicator, TextInput
} from 'react-native'
import { useProductStore } from '../store/productStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useAuthStore } from '../store/authStore'
import { getBatteryInfo } from '../lib/batterySync'
import { formatPrice, loadCurrency } from '../lib/localization'
import { useThemeStore } from '../lib/theme'
import { useLanguageStore } from '../lib/languageStore'
const CATEGORIES = ['All', 'Shoes', 'Clothing', 'Electronics', 'Accessories']
export default function ProductsScreen({ navigation }) {
const { products, loading, fetchProducts, selectedCategory, setCategory, isOffline, subscribeToStock, unsubscribeFromStock } = useProductStore()
const { addToCart } = useCartStore()
const { addToWishlist, fetchWishlist, isInWishlist } = useWishlistStore()
const { user } = useAuthStore()
const { theme } = useThemeStore()
const { t } = useLanguageStore()
const [search, setSearch] = useState('')
const [batteryLow, setBatteryLow] = useState(false)
const [selectedCurrency, setSelectedCurrency] = useState('USD')
useEffect(() => {
fetchProducts()
checkBattery()
fetchWishlist(user.id)
subscribeToStock()
loadCurrency().then(setSelectedCurrency)
return () => unsubscribeFromStock()}, [])
useEffect(() => {const unsubscribe = navigation.addListener('focus', () => {loadCurrency().then(setSelectedCurrency)})
return unsubscribe
}, [navigation])
const checkBattery = async () => {
const info = await getBatteryInfo()
setBatteryLow(info.isLow && !info.isCharging)}
const filtered = products.filter(p => {
const matchCategory = selectedCategory === 'All' || p.category === selectedCategory
const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
return matchCategory && matchSearch})
if (loading) {
return (<View style={[styles.centered, { backgroundColor: theme.background }]}>
<ActivityIndicator size="large" color={theme.primary} />
<Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading products...</Text>
</View>)
  }
return (
<View style={[styles.container, { backgroundColor: theme.background }]}>
{isOffline && (
<View style={styles.offlineBanner}>
<Text style={styles.offlineBannerText}>{t.offline}</Text></View>
)}
{batteryLow && (
<View style={styles.batteryBanner}>
<Text style={styles.batteryBannerText}>{t.lowBattery}</Text>
</View>)}
<View style={[styles.header, { backgroundColor: theme.headerBg }]}>
<View>
<Text style={[styles.headerTitle, { color: theme.text }]}>{t.shopTitle}</Text>
<Text style={[styles.headerSub, { color: theme.textSecondary }]}>{filtered.length} {t.products}</Text>
</View>
</View>
<TextInput
style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
placeholder={t.searchPlaceholder}
placeholderTextColor={theme.textSecondary}
value={search}
onChangeText={setSearch}/>
<FlatList
horizontal
showsHorizontalScrollIndicator={false}
data={CATEGORIES}
keyExtractor={(item) => item}
style={styles.categoryList}
contentContainerStyle={{ paddingRight: 16 }}
renderItem={({ item }) => (
<TouchableOpacity
style={[styles.categoryBtn,
{ borderColor: theme.border },
selectedCategory === item && styles.categoryBtnActive
]}
onPress={() => setCategory(item)}
>
<Text style={[styles.categoryText,
{ color: theme.textSecondary },
selectedCategory === item && styles.categoryTextActive
]}>
{item}
</Text>
 </TouchableOpacity>
)}/>
<FlatList
data={filtered}
keyExtractor={(item) => item.id.toString()}
numColumns={2}
columnWrapperStyle={styles.row}
contentContainerStyle={styles.productList}
showsVerticalScrollIndicator={false}
ListEmptyComponent={
<View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.text }]}>{t.noProductsFound}</Text>
            <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>{t.checkSupabase}</Text>
</View>}
renderItem={({ item }) => (
<TouchableOpacity
style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
onPress={() => navigation.navigate('ProductDetail', { product: item })}
activeOpacity={0.9}>
<Image source={{ uri: item.image_url }} style={styles.image} /><TouchableOpacity
style={styles.wishlistBtn}
onPress={() => addToWishlist(user.id, item)}>
<Text style={styles.wishlistBtnText}>
{isInWishlist(item.id) ? '❤️' : '🤍'}
</Text>
</TouchableOpacity>
<View style={styles.cardBody}>
<Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
<Text style={[styles.productCategory, { color: theme.textSecondary }]}>{item.category}</Text>
<View style={styles.cardFooter}>
<Text style={[styles.productPrice, { color: theme.primary }]}>{formatPrice(item.price, selectedCurrency)}</Text>
<Text style={[styles.stockText, item.stock < 5 && styles.stockLow]}>
{item.stock < 5 ? `⚠️ ${t.onlyLeft} ${item.stock} ${t.stockLeft}` : `${t.stock} ${item.stock}`}
</Text></View><TouchableOpacity
style={styles.addBtn}
onPress={() => addToCart(item)}>
<Text style={styles.addBtnText}>{t.addToCart}</Text></TouchableOpacity></View></TouchableOpacity>
)}/>
</View>)
}

const styles = StyleSheet.create({ container: { flex: 1 },centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14 },offlineBanner: { backgroundColor: '#FF6B6B', padding: 10, alignItems: 'center' },
  offlineBannerText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },batteryBanner: { backgroundColor: '#FF8C00', padding: 10, alignItems: 'center' },batteryBannerText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  header: {flexDirection: 'row',justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  headerSub: { fontSize: 13, marginTop: 2 },
  searchBar: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  categoryList: {
    paddingLeft: 16,
    marginBottom: 16,
    maxHeight: 50,
  },
  categoryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    height: 38,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  categoryBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  categoryText: { fontSize: 13, fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF' },
  productList: { paddingHorizontal: 12, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: { width: '100%', height: 140, backgroundColor: '#F5F5F5' },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 4,
  },
  wishlistBtnText: { fontSize: 16 },
  cardBody: { padding: 10 },
  productName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  productCategory: { fontSize: 11, marginBottom: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 15, fontWeight: '700' },
  stockText: { fontSize: 10, color: '#BBB' },
  stockLow: { color: '#FF4444', fontWeight: '600' },
  addBtn: { backgroundColor: '#6C63FF', borderRadius: 8, padding: 7, alignItems: 'center', marginTop: 8 },
  addBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  emptySubText: { fontSize: 13 },
})