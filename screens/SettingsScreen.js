import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Switch, Alert
} from 'react-native'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../lib/theme'
import { loadCurrency, CURRENCIES } from '../lib/localization'
import { useLanguageStore } from '../lib/languageStore'
import { getBatteryInfo } from '../lib/batterySync'

export default function SettingsScreen({ navigation }) {
  const { user, signOut } = useAuthStore()
  const { theme, isDark, toggleTheme } = useThemeStore()
  const { language, t, loadLanguage } = useLanguageStore()
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [battery, setBattery] = useState({ level: 100, isCharging: false, isLow: false })

  useEffect(() => {
    loadLanguage()
    loadCurrency().then(setSelectedCurrency)
    getBatteryInfo().then(setBattery)
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCurrency().then(setSelectedCurrency)
      loadLanguage()
      getBatteryInfo().then(setBattery)
    })
    return unsubscribe
  }, [navigation])

  const currentCurrency = CURRENCIES.find(c => c.code === selectedCurrency)

  const handleSignOut = () => {
    Alert.alert(t.signOutTitle, t.signOutDesc, [
      { text: t.cancel },
      { text: t.signOut, style: 'destructive', onPress: signOut }
    ])
  }

  const getBatteryIcon = () => {
    if (battery.isCharging) return '⚡'
    if (battery.isLow) return '🪫'
    if (battery.level > 60) return '🔋'
    return '🔋'
  }

  const getBatteryColor = () => {
    if (battery.isCharging) return '#FFD700'
    if (battery.isLow) return '#FF4444'
    if (battery.level > 60) return '#22C55E'
    return '#FF8C00'
  }

  const getBatteryStatus = () => {
    if (battery.isCharging) return `⚡ Charging — ${battery.level}%`
    if (battery.isLow) return `⚠️ Low battery — ${battery.level}%`
    if (battery.level > 60) return `✅ Good — ${battery.level}%`
    return `🟡 Medium — ${battery.level}%`
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t.settings}</Text>
      </View>
      <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: '#6C63FF' }]}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileEmail, { color: theme.text }]} numberOfLines={1}>
            {user?.email}
          </Text>
          <Text style={[styles.profileSub, { color: theme.textSecondary }]}>
            {t.member}
          </Text>
        </View>
      </View>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {t.appearance}
      </Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🌙</Text>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t.darkMode}</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {isDark ? t.darkEnabled : t.lightEnabled}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#E0E0E0', true: '#6C63FF' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        BATTERY
      </Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>{getBatteryIcon()}</Text>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Battery Level</Text>
              <Text style={[styles.settingDesc, { color: getBatteryColor() }]}>
  {getBatteryStatus()}
              </Text>
            </View>
          </View>
          <View style={styles.batteryContainer}>
            <View style={[styles.batteryFill, {
              width: `${battery.level}%`,
              backgroundColor: getBatteryColor(),
            }]} />
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {t.currency}
      </Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation.navigate('Currency')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>💱</Text>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t.currencyLabel}</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {currentCurrency?.flag} {currentCurrency?.name} ({currentCurrency?.symbol})
              </Text>
            </View>
          </View>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {t.language}
      </Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation.navigate('Language')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🌐</Text>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t.languageLabel}</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {language === 'en' ? '🇺🇸 English' : '🇫🇷 Français'}
              </Text>
            </View>
          </View>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {t.navigation}
      </Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.settingRow, styles.settingBorder, { borderBottomColor: theme.border }]}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>📋</Text>
            <Text style={[styles.settingLabel, { color: theme.text }]}>{t.orderHistory}</Text>
          </View>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingRow, styles.settingBorder, { borderBottomColor: theme.border }]}
          onPress={() => navigation.navigate('StoreLocator')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🗺️</Text>
            <Text style={[styles.settingLabel, { color: theme.text }]}>{t.storeLocator}</Text>
          </View>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation.navigate('Scanner')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>📷</Text>
            <Text style={[styles.settingLabel, { color: theme.text }]}>{t.barcodeScanner}</Text>
          </View>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {t.about}
      </Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.settingRow, styles.settingBorder, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>📱</Text>
            <Text style={[styles.settingLabel, { color: theme.text }]}>{t.version}</Text>
          </View>
          <Text style={[styles.settingValue, { color: theme.textSecondary }]}>1.0.0</Text>
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🛍️</Text>
            <Text style={[styles.settingLabel, { color: theme.text }]}>ShopApp</Text>
          </View>
          <Text style={[styles.settingValue, { color: theme.textSecondary }]}>Made with ❤️</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.signOutBtn, { borderColor: '#FF4444' }]}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>{t.signOut}</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 32, fontWeight: '700' },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  profileInfo: { flex: 1 },
  profileEmail: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  profileSub: { fontSize: 13 },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
  },

  section: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingBorder: { borderBottomWidth: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  settingLabel: { fontSize: 15, fontWeight: '500' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  settingValue: { fontSize: 13 },
  chevron: { fontSize: 20, fontWeight: '300' },

  batteryContainer: {
    width: 60,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 5,
  },

  signOutBtn: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 8,
  },
  signOutText: { fontSize: 16, fontWeight: '600', color: '#FF4444' },
})