import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { translations } from './translations'
export const useLanguageStore = create((set, get) => ({
language: 'en',
t: translations.en,
loadLanguage: async () => {const saved = await AsyncStorage.getItem('language')
if (saved) {
set({ language: saved, t: translations[saved] })}},
setLanguage: async (lang) => {await AsyncStorage.setItem('language', lang)
set({ language: lang, t: translations[lang] })},
}))