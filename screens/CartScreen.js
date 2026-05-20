import React, { useEffect } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Image, Alert
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../lib/theme'
import { sendLocalNotification } from '../lib/notifications'
import { generateReceipt } from '../lib/generateReceipt'
import { supabase } from '../lib/supabase'
export default function CartScreen({ navigation }) {
const { items, removeFromCart, updateQuantity, clearCart, loadCart, getTotalPrice, getTotalItems } = useCartStore()
const { user } = useAuthStore()
const { theme } = useThemeStore()
useEffect(() => {loadCart()}, [])
const handleCheckout = async () => {
if (items.length === 0) return
try {const { error } = await supabase
.from('orders')
.insert({user_id: user.id,items: items,total: getTotalPrice(),status: 'completed'})
if (error) {Alert.alert('Error', 'Could not save order: ' + error.message)
return}
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
await generateReceipt(items, getTotalPrice())
await sendLocalNotification('✅ Order Placed!','Your receipt has been generated successfully!')
clearCart()} catch (error) {Alert.alert('Error', 'Something went wrong')}}
if (items.length === 0) {
return (<View style={[styles.container, { backgroundColor: theme.background }]}>
<View style={[styles.header, { borderBottomColor: theme.border }]}>
<Text style={[styles.headerTitle, { color: theme.text }]}>My Cart</Text>
</View>
<View style={styles.empty}>
<Text style={styles.emptyIcon}>🛒</Text>
<Text style={[styles.emptyTitle, { color: theme.text }]}>Cart is empty</Text>
<Text style={[styles.emptyText, { color: theme.textSecondary }]}>Add some products to get started</Text>
</View>
</View>)}
return (
<View style={[styles.container, { backgroundColor: theme.background }]}>
<View style={[styles.header, { borderBottomColor: theme.border }]}>
<Text style={[styles.headerTitle, { color: theme.text }]}>My Cart ({getTotalItems()})</Text>
<TouchableOpacity onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [{ text: 'Cancel' },{ text: 'Clear', style: 'destructive', onPress: clearCart }])}>
<Text style={styles.clearBtn}>Clear</Text>
</TouchableOpacity>
</View>
<FlatList data={items} keyExtractor={(item) => item.id.toString()}
contentContainerStyle={styles.list}
renderItem={({ item }) => (
<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
<Image source={{ uri: item.image_url }} style={styles.image} />
<View style={styles.cardBody}>
<Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
<Text style={[styles.productPrice, { color: theme.textSecondary }]}>${item.price}</Text>
<View style={styles.qtyRow}>
<TouchableOpacity style={[styles.qtyBtn, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
onPress={() => updateQuantity(item.id, item.quantity - 1)}>
<Text style={[styles.qtyBtnText, { color: theme.text }]}>−</Text>
</TouchableOpacity>
<Text style={[styles.qtyText, { color: theme.text }]}>{item.quantity}</Text>
<TouchableOpacity style={[styles.qtyBtn, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
onPress={() => updateQuantity(item.id, item.quantity + 1)}>
<Text style={[styles.qtyBtnText, { color: theme.text }]}>+</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.removeBtn}
onPress={() => removeFromCart(item.id)}>
<Text style={styles.removeBtnText}>🗑️</Text>
</TouchableOpacity>
</View></View>
<Text style={[styles.itemTotal, { color: theme.primary }]}>${(item.price * item.quantity).toFixed(2)}</Text>
</View> )}/>
<View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
<View style={styles.totalRow}>
<Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total</Text>
<Text style={[styles.totalPrice, { color: theme.text }]}>${getTotalPrice().toFixed(2)}</Text>
</View>
 <View style={styles.btnRow}>
<TouchableOpacity 
style={[styles.receiptBtn, { borderColor: theme.primary }]}
onPress={handleCheckout}
>
<Text
 style={styles.receiptBtnText}>🧾 Receipt Only</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.payBtn}onPress={() => navigation.navigate('Payment')}>
<Text style={styles.payBtnText}>💳 Pay Now</Text>
</TouchableOpacity> </View></View></View>
)}
const styles = StyleSheet.create({container: { flex: 1 },
header: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',paddingHorizontal: 16,paddingTop: 60,paddingBottom: 16,borderBottomWidth: 1,},
headerTitle: { fontSize: 22, fontWeight: '700' },clearBtn: { fontSize: 14, color: '#FF4444', fontWeight: '600' },empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
emptyIcon: { fontSize: 64, marginBottom: 16 },emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },emptyText: { fontSize: 14, marginBottom: 32 },list: { padding: 16 },
card: {flexDirection: 'row',borderRadius: 16,marginBottom: 12,padding: 12,borderWidth: 1,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.06,shadowRadius: 8,
elevation: 2,alignItems: 'center',},
image: { width: 70, height: 70, borderRadius: 10, backgroundColor: '#F5F5F5' },
cardBody: { flex: 1, paddingHorizontal: 12 },
productName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },productPrice: { fontSize: 13, marginBottom: 8 },qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
qtyBtn: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },qtyBtnText: { fontSize: 16, fontWeight: '700' },
qtyText: { fontSize: 15, fontWeight: '700', minWidth: 20, textAlign: 'center' },removeBtn: { marginLeft: 4 },removeBtnText: { fontSize: 16 },itemTotal: { fontSize: 14, fontWeight: '700' },
footer: {padding: 20,borderTopWidth: 1,paddingBottom: 34,},totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
totalLabel: { fontSize: 16, fontWeight: '500' },totalPrice: { fontSize: 22, fontWeight: '700' },btnRow: { flexDirection: 'row', gap: 10 },
receiptBtn: {flex: 1,borderRadius: 12,padding: 14,alignItems: 'center',borderWidth: 1.5,},
receiptBtnText: { color: '#6C63FF', fontSize: 14, fontWeight: '700' },payBtn: {flex: 1,backgroundColor: '#6C63FF',borderRadius: 12,padding: 14,alignItems: 'center',
},payBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
})