import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Image, Alert, ActivityIndicator
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '../lib/supabase'
import { useThemeStore } from '../lib/theme'
import { useProductStore } from '../store/productStore'

const CATEGORIES = ['Shoes', 'Clothing', 'Electronics', 'Accessories']

export default function AddProductScreen({ navigation }) {
  const { theme } = useThemeStore()
  const { fetchProducts } = useProductStore()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('Shoes')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImage(result.assets[0])
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImage(result.assets[0])
    }
  }

  const uploadImage = async () => {
    if (!image) return null
    setUploadingImage(true)

    try {
      const response = await fetch(image.uri)
      const blob = await response.blob()
      const arrayBuffer = await new Response(blob).arrayBuffer()
      const fileName = `product_${Date.now()}.jpg`

      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
        })

      if (error) {
        console.log('Upload error:', error)
        setUploadingImage(false)
        return null
      }

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

      setUploadingImage(false)
      return urlData.publicUrl
    } catch (e) {
      console.log('Upload error:', e)
      setUploadingImage(false)
      return null
    }
  }

  const handleAddProduct = async () => {
    if (!name || !description || !price || !stock) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    if (!image) {
      Alert.alert('Error', 'Please add a product image')
      return
    }

    setLoading(true)

    const imageUrl = await uploadImage()
    if (!imageUrl) {
      Alert.alert('Error', 'Failed to upload image. Please try again.')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        image_url: imageUrl,
      })

    if (error) {
      Alert.alert('Error', 'Failed to add product: ' + error.message)
      setLoading(false)
      return
    }

    await fetchProducts()
    Alert.alert('✅ Success!', 'Product added successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ])
    setLoading(false)
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Add Product</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

       
        <Text style={[styles.label, { color: theme.text }]}>Product Image</Text>
        <View style={styles.imageSection}>
          {image ? (
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <View style={styles.changeImageOverlay}>
                <Text style={styles.changeImageText}>Tap to change</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.imageBtns}>
              <TouchableOpacity
                style={[styles.imageBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={takePhoto}
              >
                <Text style={styles.imageBtnIcon}>📷</Text>
                <Text style={[styles.imageBtnText, { color: theme.text }]}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.imageBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={pickImage}
              >
                <Text style={styles.imageBtnIcon}>🖼️</Text>
                <Text style={[styles.imageBtnText, { color: theme.text }]}>From Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        
        <Text style={[styles.label, { color: theme.text }]}>Product Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
          placeholder="e.g. Nike Air Max"
          placeholderTextColor={theme.textSecondary}
          value={name}
          onChangeText={setName}
        />

        
        <Text style={[styles.label, { color: theme.text }]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
          placeholder="Describe your product..."
          placeholderTextColor={theme.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

       
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: theme.text }]}>Price ($)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
              placeholder="0.00"
              placeholderTextColor={theme.textSecondary}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: theme.text }]}>Stock</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
            />
          </View>
        </View>


        <Text style={[styles.label, { color: theme.text }]}>Category</Text>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                { borderColor: theme.border, backgroundColor: theme.card },
                category === cat && styles.categoryBtnActive
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                { color: theme.textSecondary },
                category === cat && styles.categoryTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.submitBtn, (loading || uploadingImage) && { opacity: 0.7 }]}
          onPress={handleAddProduct}
          disabled={loading || uploadingImage}
        >
          {loading || uploadingImage ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.submitBtnText}>
                {uploadingImage ? 'Uploading image...' : 'Adding product...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.submitBtnText}>✅ Add Product</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  content: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    marginBottom: 4,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  imageSection: { marginBottom: 8 },
  imageBtns: { flexDirection: 'row', gap: 12 },
  imageBtn: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 8,
  },
  imageBtnIcon: { fontSize: 32 },
  imageBtnText: { fontSize: 13, fontWeight: '600' },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  changeImageOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: 6,
  },
  changeImageText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  categoryText: { fontSize: 13, fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF' },
  submitBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
})