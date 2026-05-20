import * as FileSystem from 'expo-file-system/legacy'
const CACHE_FILE = FileSystem.documentDirectory + 'products_cache.json'
export async function saveProductsToCache(products) {
try {await FileSystem.writeAsStringAsync(CACHE_FILE, JSON.stringify(products))
console.log('Products cached successfully')
} catch (error) {
console.log('Cache save error:', error)}}
export async function loadProductsFromCache() {
try {const fileInfo = await FileSystem.getInfoAsync(CACHE_FILE)
if (!fileInfo.exists) return null
const data = await FileSystem.readAsStringAsync(CACHE_FILE)
return JSON.parse(data)} catch (error) {
console.log('Cache load error:', error)
return null}}
export async function clearProductsCache() {try {
await FileSystem.deleteAsync(CACHE_FILE)
console.log('Cache cleared')} catch (error) {
console.log('Cache clear error:', error)}
}