import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, FlatList
} from 'react-native'
import MapView, { Marker, Circle } from 'react-native-maps'
import * as Location from 'expo-location'
import { useThemeStore } from '../lib/theme'

const STORES = [
  {
    id: '1',
    name: 'ShopApp Downtown',
    address: '123 Main Street, Downtown',
    phone: '+1 234 567 890',
    hours: 'Mon-Sat 9am-9pm',
    latitude: 37.7849,
    longitude: -122.4094,
  },
  {
    id: '2',
    name: 'ShopApp Mall Branch',
    address: '456 Mall Avenue, Westside',
    phone: '+1 234 567 891',
    hours: 'Daily 10am-10pm',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: '3',
    name: 'ShopApp Express',
    address: '789 Quick Lane, Eastside',
    phone: '+1 234 567 892',
    hours: 'Mon-Fri 8am-8pm',
    latitude: 37.7649,
    longitude: -122.3994,
  },
]

export default function StoreLocatorScreen({ navigation }) {
  const { theme } = useThemeStore()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = async () => {
    setLoading(true)
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setError('Location permission denied')
      setLoading(false)
      return
    }
    const loc = await Location.getCurrentPositionAsync({})
    setLocation(loc.coords)
    setLoading(false)
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Finding your location...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.errorIcon}>📍</Text>
        <Text style={[styles.errorTitle, { color: theme.text }]}>Location Needed</Text>
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={getLocation}>
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const mapRegion = {
    latitude: location?.latitude || 37.7749,
    longitude: location?.longitude || -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Store Locator</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Map */}
      <MapView style={styles.map} region={mapRegion} showsUserLocation>
        {location && (
          <Circle
            center={{ latitude: location.latitude, longitude: location.longitude }}
            radius={500}
            fillColor="rgba(108, 99, 255, 0.1)"
            strokeColor="rgba(108, 99, 255, 0.3)"
            strokeWidth={2}
          />
        )}
        {STORES.map(store => (
          <Marker
            key={store.id}
            coordinate={{ latitude: store.latitude, longitude: store.longitude }}
            title={store.name}
            description={store.address}
            onPress={() => setSelectedStore(store)}
            pinColor="#6C63FF"
          />
        ))}
      </MapView>

      {/* Selected Store Card */}
      {selectedStore && (
        <View style={[styles.storeCard, { backgroundColor: theme.card }]}>
          <View style={styles.storeCardHeader}>
            <Text style={[styles.storeName, { color: theme.text }]}>{selectedStore.name}</Text>
            <TouchableOpacity onPress={() => setSelectedStore(null)}>
              <Text style={[styles.closeBtn, { color: theme.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.storeAddress, { color: theme.textSecondary }]}>📍 {selectedStore.address}</Text>
          <Text style={[styles.storePhone, { color: theme.textSecondary }]}>📞 {selectedStore.phone}</Text>
          <Text style={[styles.storeHours, { color: theme.primary }]}>🕐 {selectedStore.hours}</Text>
        </View>
      )}

      {/* Store List */}
      {!selectedStore && (
        <View style={[styles.listContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <Text style={[styles.listTitle, { color: theme.text }]}>Nearby Stores ({STORES.length})</Text>
          <FlatList
            data={STORES}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storeList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.storeItem, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
                onPress={() => setSelectedStore(item)}
              >
                <Text style={styles.storeItemIcon}>🏪</Text>
                <Text style={[styles.storeItemName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.storeItemAddress, { color: theme.textSecondary }]} numberOfLines={1}>{item.address}</Text>
                <Text style={[styles.storeItemHours, { color: theme.primary }]}>{item.hours}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14 },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  errorText: { fontSize: 14, marginBottom: 24, textAlign: 'center' },
  retryBtn: { backgroundColor: '#6C63FF', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32 },
  retryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  backBtn: { fontSize: 15, color: '#6C63FF', fontWeight: '600' },
  map: { flex: 1 },
  storeCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  storeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  storeName: { fontSize: 16, fontWeight: '700', flex: 1 },
  closeBtn: { fontSize: 16, paddingLeft: 8 },
  storeAddress: { fontSize: 13, marginBottom: 4 },
  storePhone: { fontSize: 13, marginBottom: 4 },
  storeHours: { fontSize: 13, fontWeight: '500' },
  listContainer: { paddingTop: 16, paddingBottom: 20, borderTopWidth: 1 },
  listTitle: { fontSize: 15, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12 },
  storeList: { paddingHorizontal: 16 },
  storeItem: { borderRadius: 12, padding: 12, marginRight: 12, width: 160, borderWidth: 1 },
  storeItemIcon: { fontSize: 24, marginBottom: 6 },
  storeItemName: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  storeItemAddress: { fontSize: 11, marginBottom: 4 },
  storeItemHours: { fontSize: 10, fontWeight: '500' },
})