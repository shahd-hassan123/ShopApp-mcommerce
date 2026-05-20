import React, { useEffect, useState } from 'react'
import {View, Text, FlatList, TouchableOpacity,StyleSheet, ActivityIndicator} from 'react-native'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../lib/theme'
export default function OrderHistoryScreen({ navigation }) {
const { user } = useAuthStore()
const { theme } = useThemeStore()
const [orders, setOrders] = useState([])
const [loading, setLoading] = useState(true)
const [selectedOrder, setSelectedOrder] = useState(null)
useEffect(() => {
fetchOrders()
}, [])
const fetchOrders = async () => {
setLoading(true)
const { data, error } = await supabase
.from('orders')
.select('*')
.eq('user_id', user.id)
.order('created_at', { ascending: false })
if (!error) setOrders(data || [])
setLoading(false)}
if (loading) {return (
<View style={[styles.centered, { backgroundColor: theme.background }]}>
<ActivityIndicator size="large" color={theme.primary} />
<Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading orders...</Text>
</View>)}
return (
<View style={[styles.container, { backgroundColor: theme.background }]}>
<View style={[styles.header, { borderBottomColor: theme.border }]}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Text style={styles.backBtn}>← Back</Text></TouchableOpacity>
<Text style={[styles.headerTitle, { color: theme.text }]}>Order History</Text>
<View style={{ width: 60 }} /></View>
{orders.length === 0 ? (
<View style={styles.empty}>
<Text style={styles.emptyIcon}>📋</Text>
<Text style={[styles.emptyTitle, { color: theme.text }]}>No orders yet</Text>
<Text style={[styles.emptyText, { color: theme.textSecondary }]}>Your past orders will appear here</Text>
<TouchableOpacity style={styles.shopBtn} onPress={() => navigation.goBack()}>
<Text style={styles.shopBtnText}>Start Shopping</Text></TouchableOpacity></View>
) : (
<FlatList
data={orders}
keyExtractor={(item) => item.id}
contentContainerStyle={styles.list}
renderItem={({ item }) => (
<TouchableOpacity
style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]}
onPress={() => setSelectedOrder(selectedOrder?.id === item.id ? null : item)}
>
<View style={styles.orderHeader}>
<View>
<Text style={[styles.orderId, { color: theme.text }]}>Order #{item.id.slice(0, 8).toUpperCase()}</Text>
<Text style={[styles.orderDate, { color: theme.textSecondary }]}>
{new Date(item.created_at).toLocaleDateString()}
</Text>
</View>
<View style={styles.orderRight}>
<Text style={[styles.orderTotal, { color: theme.primary }]}>${item.total.toFixed(2)}</Text>
<View style={styles.statusBadge}>
<Text style={styles.statusText}>✅ {item.status}</Text></View></View></View>
{selectedOrder?.id === item.id && (
<View style={styles.orderItems}>
<View style={[styles.divider, { backgroundColor: theme.border }]} />
<Text style={[styles.itemsTitle, { color: theme.text }]}>Items ordered:</Text>
{item.items.map((product, index) => (
<View key={index} style={styles.itemRow}>
<Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>{product.name}</Text>
<Text style={[styles.itemQty, { color: theme.textSecondary }]}>x{product.quantity}</Text>
<Text style={[styles.itemPrice, { color: theme.primary }]}>${(product.price * product.quantity).toFixed(2)}</Text>
</View>))}
<View style={styles.totalRow}>
<Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
<Text style={[styles.totalAmount, { color: theme.primary }]}>${item.total.toFixed(2)}</Text>
</View></View>
)}
<Text style={[styles.expandHint, { color: theme.textSecondary }]}>
{selectedOrder?.id === item.id ? '▲ Hide details' : '▼ View details'}
 </Text>
</TouchableOpacity>)}/>
)}
</View>
  )}
const styles = StyleSheet.create({container: { flex: 1 },
centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
loadingText: { marginTop: 12, fontSize: 14 },
header: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',paddingHorizontal: 16,paddingTop: 60,
paddingBottom: 16,borderBottomWidth: 1,},
headerTitle: { fontSize: 17, fontWeight: '700' },
backBtn: { fontSize: 15, color: '#6C63FF', fontWeight: '600' },
empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
emptyIcon: { fontSize: 64, marginBottom: 16 },emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },emptyText: { fontSize: 14, marginBottom: 32 },shopBtn: { backgroundColor: '#6C63FF', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40 },
shopBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },list: { padding: 16 },
orderCard: { borderRadius: 16, marginBottom: 12, padding: 16, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
orderId: { fontSize: 14, fontWeight: '700', marginBottom: 4 },orderDate: { fontSize: 12 },orderRight: { alignItems: 'flex-end' },orderTotal: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
statusBadge: { backgroundColor: '#E8FFF0', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
statusText: { fontSize: 11, color: '#22C55E', fontWeight: '600' },
orderItems: { marginTop: 12 },
divider: { height: 1, marginVertical: 10 },
itemsTitle: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
itemName: { flex: 1, fontSize: 13 },
itemQty: { fontSize: 13, marginHorizontal: 8 },
itemPrice: { fontSize: 13, fontWeight: '600' },
totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
totalLabel: { fontSize: 14, fontWeight: '700' },
totalAmount: { fontSize: 14, fontWeight: '700' },
expandHint: { fontSize: 11, textAlign: 'center', marginTop: 10 },
})