import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, FlatList
} from 'react-native'
import { useThemeStore } from '../lib/theme'
import { useLanguageStore } from '../lib/languageStore'
const LANGUAGES = [{ code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
{ code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },]
export default function LanguageScreen({ navigation }) {const { theme } = useThemeStore()
const { language, setLanguage, t } = useLanguageStore()
const handleSelect = async (code) => {await setLanguage(code)
navigation.goBack()}
return (<View style={[styles.container, { backgroundColor: theme.background }]}>
<View style={[styles.header, { borderBottomColor: theme.border }]}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Text style={styles.backBtn}>← Back</Text></TouchableOpacity>
<Text style={[styles.headerTitle, { color: theme.text }]}>{t.languageLabel}
</Text>
<View style={{ width: 60 }} /></View>
<FlatList
data={LANGUAGES}
keyExtractor={(item) => item.code}
contentContainerStyle={styles.list}
renderItem={({ item }) => (
<TouchableOpacity
style={[
styles.item,
{ backgroundColor: theme.card, borderColor: theme.border },language === item.code && styles.itemActive]}
onPress={() => handleSelect(item.code)}>
<Text style={styles.flag}>{item.flag}</Text>
<View style={styles.itemBody}>
<Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
<Text style={[styles.itemNative, { color: theme.textSecondary }]}>{item.native}</Text>
</View>
{language === item.code && <Text style={styles.checkmark}>✅</Text>}</TouchableOpacity>)}/>
</View>)}
const styles = StyleSheet.create({container: { flex: 1 },
header: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',paddingHorizontal: 16,paddingTop: 60,paddingBottom: 16,borderBottomWidth: 1,},
headerTitle: { fontSize: 17, fontWeight: '700' },
backBtn: { fontSize: 15, color: '#6C63FF', fontWeight: '600' },
list: { padding: 16 },
item: {flexDirection: 'row',alignItems: 'center',padding: 16,borderRadius: 12,marginBottom: 10,borderWidth: 1.5,gap: 12,},
itemActive: { borderColor: '#6C63FF', backgroundColor: '#F0EEFF' },
flag: { fontSize: 32 },itemBody: { flex: 1 },itemName: { fontSize: 16, fontWeight: '600' },itemNative: { fontSize: 13, marginTop: 2 },checkmark: { fontSize: 18 },})