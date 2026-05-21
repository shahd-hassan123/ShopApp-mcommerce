import React, { useState } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Alert
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { supabase } from '../lib/supabase'
export default function ScannerScreen({ navigation }) {
const [permission, requestPermission] = useCameraPermissions()
const [scanned, setScanned] = useState(false)
const [scanning, setScanning] = useState(false)
if (!permission) {
return (
<View style={styles.centered}>
<Text style={styles.text}>Loading camera...</Text>
</View>)}
if (!permission.granted) {
return (
<View style={styles.centered}>
<Text style={styles.scanIcon}>📷</Text>
<Text style={styles.title}>Camera Access Needed</Text>
<Text style={styles.text}>Please allow camera access to scan barcodes</Text>
<TouchableOpacity style={styles.button} onPress={requestPermission}>
<Text style={styles.buttonText}>Allow Camera</Text>
</TouchableOpacity>
</View>)}
const handleBarCodeScanned = async ({ type, data }) => {
if (scanned) return
setScanned(true)
setScanning(false)
const { data: products, error } = await supabase
.from('products')
.select('*')
.eq('barcode', data)
if (error || !products || products.length === 0) {
Alert.alert(
'🔍 Barcode Scanned',
`Code: ${data}\n\nNo product found with this barcode.`,
[{ text: 'Scan Again', onPress: () => setScanned(false) }]
)
} else {
Alert.alert('✅ Product Found!',
`${products[0].name}\n$${products[0].price}`,
[{ text: 'Scan Again', onPress: () => setScanned(false) },{ text: 'Go to Shop', onPress: () => navigation.navigate('Home') }]
)}
  }
return (
<View style={styles.container}>
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Text style={styles.backBtn}>← Back</Text>
</TouchableOpacity>
<Text style={styles.headerTitle}>Scan Barcode</Text>
<View style={{ width: 60 }} />
</View>
      {scanning ? (
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e'],
            }}
          />

          <View style={styles.overlay}>
            <View style={styles.scanBox}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scanHint}>Point camera at a barcode</Text>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setScanning(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.scanIcon}>📷</Text>
          <Text style={styles.title}>Ready to Scan</Text>
          <Text style={styles.text}>Tap the button below to scan a product barcode</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { setScanned(false); setScanning(true) }}
          >
            <Text style={styles.buttonText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  scannerContainer: { flex: 1, position: 'relative' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
  backBtn: { fontSize: 15, color: '#6C63FF', fontWeight: '600' },

  scanIcon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 8, textAlign: 'center' },
  text: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 32, lineHeight: 22 },

  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#6C63FF',
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8 },
  scanHint: { color: '#FFFFFF', fontSize: 14, marginTop: 24, fontWeight: '500' },

  cancelBtn: {
    marginTop: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
})
