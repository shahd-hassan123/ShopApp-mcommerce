import React, { useEffect, useState } from 'react'
import {View, Text, FlatList, TouchableOpacity, StyleSheet
} from 'react-native'
import { CURRENCIES, loadCurrency, saveCurrency } from '../lib/localization'
import { useThemeStore } from '../lib/theme'
export default function CurrencyScreen({ navigation }) {const [selected, setSelected] = useState('USD')
const { theme } = useThemeStore()
useEffect(() => {
loadCurrency().then(setSelected)}, [])
const handleSelect = async (code) => {await saveCurrency(code)
setSelected(code)
navigation.goBack()}
return (<View style={[styles.container, { backgroundColor: theme.background }]}>
<View style={[styles.header, { borderBottomColor: theme.border }]}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Text style={styles.backBtn}>← Back</Text>
</TouchableOpacity>
<Text style={[styles.headerTitle, { color: theme.text }]}>Select Currency</Text>
<View style={{ width: 60 }} />
</View>
<FlatList data={CURRENCIES}
keyExtractor={(item) => item.code}
contentContainerStyle={styles.list}
renderItem={({ item }) => (
<TouchableOpacity style={[styles.item, { backgroundColor: theme.card, borderColor: theme.border }, selected === item.code && styles.itemActive]}
onPress={() => handleSelect(item.code)}>
<Text style={styles.flag}>{item.flag}</Text>
<View style={styles.itemBody}>
<Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
<Text style={[styles.itemCode, { color: theme.textSecondary }]}>{item.code}</Text></View>
<Text style={[styles.itemSymbol, { color: theme.primary }]}>{item.symbol}</Text>
{selected === item.code && <Text style={styles.checkmark}>✅</Text>}
</TouchableOpacity>)}/></View>)}
const styles = StyleSheet.create({container: { flex: 1 },
header: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',paddingHorizontal: 16,paddingTop: 60,paddingBottom: 16,borderBottomWidth: 1,},
headerTitle: { fontSize: 17, fontWeight: '700' },backBtn: { fontSize: 15, color: '#6C63FF', fontWeight: '600' },list: { padding: 16 },
item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, gap: 12 },
itemActive: { borderColor: '#6C63FF', backgroundColor: '#F8F8FF' },flag: { fontSize: 28 },itemBody: { flex: 1 },itemName: { fontSize: 14, fontWeight: '600' },itemCode: { fontSize: 12, marginTop: 2 },
itemSymbol: { fontSize: 16, fontWeight: '700' },checkmark: { fontSize: 16 },})