import React, { useState } from 'react'
import {View, Text, TouchableOpacity, StyleSheet,TextInput, ScrollView, Alert} from 'react-native'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../lib/theme'
import { sendLocalNotification } from '../lib/notifications'
import { generateReceipt } from '../lib/generateReceipt'
import { supabase } from '../lib/supabase'
import * as Haptics from 'expo-haptics'
export default function PaymentScreen({ navigation }) {
const { items, getTotalPrice, clearCart } = useCartStore()
const { user } = useAuthStore()
const { theme } = useThemeStore()
const [cardNumber, setCardNumber] = useState('')
const [cardName, setCardName] = useState('')
const [expiry, setExpiry] = useState('')
const [cvv, setCvv] = useState('')
const [loading, setLoading] = useState(false)
const [selectedMethod, setSelectedMethod] = useState('card')
const formatCardNumber = (text) => {const cleaned = text.replace(/\s/g, '')
const groups = cleaned.match(/.{1,4}/g)
return groups ? groups.join(' ') : cleaned
}
const formatExpiry = (text) => {
const cleaned = text.replace('/', '')
if (cleaned.length >= 2) {
return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
}return cleaned}
const handlePayment = async () => {if (selectedMethod === 'card') {
if (!cardNumber || !cardName || !expiry || !cvv) {Alert.alert('Error', 'Please fill in all card details')
return}
if (cardNumber.replace(/\s/g, '').length < 16) {
Alert.alert('Error', 'Please enter a valid card number')
return}}
setLoading(true)
try {const { error } = await supabase
.from('orders')
.insert({user_id: user.id, items: items,total: getTotalPrice(),status: 'completed',})
if (error) {Alert.alert('Error', 'Could not save order')
setLoading(false)
return
}
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
await generateReceipt(items, getTotalPrice())
await sendLocalNotification('✅ Payment Successful!', `Your payment of $${getTotalPrice().toFixed(2)} was successful!`)
clearCart()
navigation.goBack()
navigation.goBack()
} catch (e) {Alert.alert('Error', 'Something went wrong')}
setLoading(false)}
return (
<View style={[styles.container, { backgroundColor: theme.background }]}>
<View style={[styles.header, { borderBottomColor: theme.border }]}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Text style={styles.backBtn}>← Back</Text>
</TouchableOpacity>
<Text style={[styles.headerTitle, { color: theme.text }]}>Payment</Text>
<View style={{ width: 60 }} />
</View>
<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
<View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
<Text style={[styles.summaryTitle, { color: theme.text }]}>Order Summary</Text>
<View style={styles.summaryRow}>
<Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{items.length} items</Text>
<Text style={[styles.summaryValue, { color: theme.text }]}>${getTotalPrice().toFixed(2)}</Text>
</View>
<View style={styles.summaryRow}>
<Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Shipping</Text>
<Text style={[styles.summaryFree, { color: '#22C55E' }]}>FREE</Text>
</View>
<View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
<View style={styles.summaryRow}>
<Text style={[styles.summaryTotal, { color: theme.text }]}>Total</Text>
<Text style={[styles.summaryTotalValue, { color: theme.primary }]}>${getTotalPrice().toFixed(2)}</Text>
</View>
</View>
<Text style={[styles.sectionTitle, { color: theme.text }]}>Payment Method</Text>
<View style={styles.methodRow}>
<TouchableOpacity
style={[styles.methodBtn,{ backgroundColor: theme.card, borderColor: theme.border },
selectedMethod === 'card' && styles.methodBtnActive]}
onPress={() => setSelectedMethod('card')}>
<Text style={styles.methodIcon}>💳</Text>
<Text style={[styles.methodLabel, { color: theme.text }, selectedMethod === 'card' && { color: '#6C63FF' }]}>Credit Card</Text>
</TouchableOpacity>
<TouchableOpacity
style={[
styles.methodBtn,
{ backgroundColor: theme.card, borderColor: theme.border },
selectedMethod === 'cash' && styles.methodBtnActive]}
onPress={() => setSelectedMethod('cash')}>
<Text style={styles.methodIcon}>💵</Text>
<Text style={[styles.methodLabel, { color: theme.text }, selectedMethod === 'cash' && { color: '#6C63FF' }]}>Cash</Text>
</TouchableOpacity><TouchableOpacity
style={[styles.methodBtn,
{ backgroundColor: theme.card, borderColor: theme.border },
selectedMethod === 'apple' && styles.methodBtnActive]}
onPress={() => setSelectedMethod('apple')}>
<Text style={styles.methodIcon}>🍎</Text>
<Text style={[styles.methodLabel, { color: theme.text }, selectedMethod === 'apple' && { color: '#6C63FF' }]}>Apple Pay</Text>
</TouchableOpacity>
</View>
{selectedMethod === 'card' && (
<View>
<Text style={[styles.sectionTitle, { color: theme.text }]}>Card Details</Text>
<View style={styles.visualCard}>
<View style={styles.cardChip}>
<Text style={styles.cardChipText}>💳</Text>
</View>
<Text style={styles.cardNumberDisplay}>
{cardNumber || '•••• •••• •••• ••••'}
</Text>
<View style={styles.cardBottom}>
<View>
<Text style={styles.cardLabel}>CARD HOLDER</Text>
<Text style={styles.cardValue}>{cardName || 'YOUR NAME'}</Text>
</View>
<View>
<Text style={styles.cardLabel}>EXPIRES</Text>
<Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
</View></View>
</View>
<TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
placeholder="Card Number"
placeholderTextColor={theme.textSecondary} value={cardNumber}
onChangeText={(text) => setCardNumber(formatCardNumber(text))}
keyboardType="numeric"
maxLength={19}/>
<TextInput
style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
placeholder="Cardholder Name"
placeholderTextColor={theme.textSecondary}
value={cardName}
onChangeText={setCardName}
 autoCapitalize="words"/>
<View style={styles.row}>
<TextInput
style={[styles.input, styles.halfInput, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
 placeholder="MM/YY"
placeholderTextColor={theme.textSecondary}
value={expiry}
onChangeText={(text) => setExpiry(formatExpiry(text))}
keyboardType="numeric"
maxLength={5}/>
<TextInput
style={[styles.input, styles.halfInput, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
placeholder="CVV"
placeholderTextColor={theme.textSecondary}
value={cvv}
onChangeText={setCvv}
keyboardType="numeric"
maxLength={3}
secureTextEntry/>
</View>
<View style={[styles.secureRow, { backgroundColor: theme.backgroundSecondary }]}>
<Text style={styles.secureText}>🔒 Your payment is secure and encrypted</Text>
</View>
</View>)}
{selectedMethod === 'cash' && (
<View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
<Text style={styles.infoIcon}>💵</Text>
<Text style={[styles.infoTitle, { color: theme.text }]}>Cash on Delivery</Text>
<Text style={[styles.infoDesc, { color: theme.textSecondary }]}>Pay with cash when your order arrives. No card needed!</Text>
</View>)}
{selectedMethod === 'apple' && (
<View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
<Text style={styles.infoIcon}>🍎</Text>
<Text style={[styles.infoTitle, { color: theme.text }]}>Apple Pay</Text>
<Text style={[styles.infoDesc, { color: theme.textSecondary }]}>Use Face ID or Touch ID to complete your payment instantly.</Text>
</View>)}
<View style={{ height: 100 }} />
</ScrollView>
<View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
<TouchableOpacity
style={[styles.payBtn, loading && { opacity: 0.7 }]}
onPress={handlePayment}
disabled={loading}>
<Text style={styles.payBtnText}>
{loading ? 'Processing...' : `🔒 Pay $${getTotalPrice().toFixed(2)}`}
</Text></TouchableOpacity></View> </View>)
}
const styles = StyleSheet.create({
container: { flex: 1 },
header: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',paddingHorizontal: 16,paddingTop: 60,paddingBottom: 16,borderBottomWidth: 1,},
headerTitle: { fontSize: 17, fontWeight: '700' },
backBtn: { fontSize: 15, color: '#6C63FF', fontWeight: '600' },
content: { padding: 16 },
summaryCard: {borderRadius: 16,padding: 16,borderWidth: 1,marginBottom: 20,},
summaryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
summaryLabel: { fontSize: 14 },
summaryValue: { fontSize: 14, fontWeight: '600' },
summaryFree: { fontSize: 14, fontWeight: '600' },
summaryDivider: { height: 1, marginVertical: 10 },
summaryTotal: { fontSize: 16, fontWeight: '700' },
summaryTotalValue: { fontSize: 18, fontWeight: '700' },
sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
methodRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
methodBtn: {flex: 1,borderRadius: 12,padding: 12,alignItems: 'center',borderWidth: 1.5,gap: 6,},
methodBtnActive: { borderColor: '#6C63FF', backgroundColor: '#F0EEFF' },
methodIcon: { fontSize: 24 },
methodLabel: { fontSize: 11, fontWeight: '600' },
visualCard: {backgroundColor: '#6C63FF',borderRadius: 20,padding: 24,marginBottom: 20,shadowColor: '#6C63FF',shadowOffset: { width: 0, height: 8 },shadowOpacity: 0.4,shadowRadius: 16,elevation: 10,},
cardChip: { marginBottom: 20 },
cardChipText: { fontSize: 28 },
cardNumberDisplay: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', letterSpacing: 2, marginBottom: 20 },
cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
cardValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
input: {borderRadius: 12,padding: 14,fontSize: 15,borderWidth: 1,marginBottom: 12,},
row: { flexDirection: 'row', gap: 12 },halfInput: { flex: 1 },
secureRow: {borderRadius: 10,padding: 12,alignItems: 'center',marginTop: 4,},
secureText: { fontSize: 12, color: '#22C55E', fontWeight: '600' },
infoCard: {borderRadius: 16,padding: 24,alignItems: 'center',borderWidth: 1,marginBottom: 12,},infoIcon: { fontSize: 48, marginBottom: 12 },
infoTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
infoDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
footer: {position: 'absolute',bottom: 0,left: 0,right: 0,padding: 20,borderTopWidth: 1,paddingBottom: 34,},
payBtn: {backgroundColor: '#6C63FF',borderRadius: 16,padding: 18,alignItems: 'center',},
payBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
})