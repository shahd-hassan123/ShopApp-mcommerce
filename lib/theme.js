import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'
export const lightTheme = {background: '#FFFFFF',backgroundSecondary: '#F5F5F5',card: '#FFFFFF',text: '#1A1A2E',
textSecondary: '#999999',border: '#F0F0F0',borderInput: '#E0E0E0',
primary: '#6C63FF',headerBg: '#FFFFFF',inputBg: '#F5F5F5',cardShadow: '#000000',navBg: '#1A1A2E',}
export const darkTheme = {background: '#0A0A0F',backgroundSecondary: '#1A1A2E',card: '#1A1A2E',text: '#FFFFFF',textSecondary: '#888888',border: '#2A2A3E',borderInput: '#2A2A3E',primary: '#6C63FF',headerBg: '#0A0A0F',inputBg: '#1A1A2E',cardShadow: '#6C63FF',navBg: '#6C63FF',}
export const useThemeStore = create((set, get) => ({isDark: Appearance.getColorScheme() === 'dark',theme: Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme,
loadTheme: async () => {
const saved = await AsyncStorage.getItem('theme')
if (saved !== null) {
const isDark = saved === 'dark'
set({ isDark, theme: isDark ? darkTheme : lightTheme })}},
toggleTheme: async () => {
const isDark = !get().isDark
set({ isDark, theme: isDark ? darkTheme : lightTheme })
await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light')},
}))