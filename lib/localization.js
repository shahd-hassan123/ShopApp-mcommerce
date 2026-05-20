import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
export const CURRENCIES = [
{ symbol: '$', code: 'USD', name: 'US Dollar', flag: '🇺🇸' },{ symbol: '£', code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
{ symbol: '€', code: 'EUR', name: 'Euro', flag: '🇪🇺' },{ symbol: '¥', code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },{ symbol: 'ر.س', code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
{ symbol: 'ج.م', code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },{ symbol: 'د.إ', code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },]
export const EXCHANGE_RATES = {
USD: 1,GBP: 0.79,EUR: 0.92,JPY: 149.50,SAR: 3.75,EGP: 30.90,AED: 3.67,}
export function formatPrice(priceInUSD, currencyCode = 'USD') {const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0]
const rate = EXCHANGE_RATES[currencyCode] || 1
const converted = priceInUSD * rate
return `${currency.symbol}${converted.toFixed(2)}`}
export async function saveCurrency(code) {
await AsyncStorage.setItem('selected_currency', code)}
export async function loadCurrency() {
try {const saved = await AsyncStorage.getItem('selected_currency')
if (saved) return saved
const locales = Localization.getLocales()
const tag = locales?.[0]?.languageTag || 'en-US'
if (tag.includes('EG')) return 'EGP'
if (tag.includes('SA')) return 'SAR'
if (tag.includes('AE')) return 'AED'
if (tag.includes('GB')) return 'GBP'
if (tag.includes('JP')) return 'JPY'
if (tag.includes('DE') || tag.includes('FR')) return 'EUR'
return 'USD'} catch (e) {return 'USD'}
}