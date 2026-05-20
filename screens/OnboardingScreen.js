import React, { useState, useRef } from 'react'
import {View, Text, StyleSheet, TouchableOpacity,Dimensions, FlatList, Animated} from 'react-native'
import { useThemeStore } from '../lib/theme'
const { width, height } = Dimensions.get('window')
const SLIDES = [
{id: '1',emoji: '🛍️',title: 'Welcome to ShopApp',
subtitle: 'Discover thousands of products at your fingertips. Shop smarter, faster, better.',bg: '#6C63FF',accent: '#8B85FF',},
{id: '2',emoji: '❤️',title: 'Save Your Favourites',subtitle: 'Add products to your wishlist and never miss a deal again.',bg: '#FF6B9D',
accent: '#FF8FB3',},
{id: '3',emoji: '🚀',title: 'Fast & Secure Checkout',subtitle: 'Pay with card or cash. Get your receipt instantly as a PDF.',bg: '#00C896',accent: '#00E5AB',},
{id: '4',emoji: '🌍',title: 'Shop in Your Currency',subtitle: 'We support multiple currencies and languages so you always feel at home.',bg: '#FF8C42',accent: '#FFA666',},]
export default function OnboardingScreen({ navigation }) {const [currentIndex, setCurrentIndex] = useState(0)
const flatListRef = useRef(null)
const scrollX = useRef(new Animated.Value(0)).current
const handleNext = () => {if (currentIndex < SLIDES.length - 1) {
flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
setCurrentIndex(currentIndex + 1)} else {
navigation.replace('Auth')}}
const handleSkip = () => {navigation.replace('Auth')}
return (<View style={styles.container}>
<FlatList ref={flatListRef}
data={SLIDES}
keyExtractor={(item) => item.id}
horizontal
pagingEnabled
showsHorizontalScrollIndicator={false}
scrollEnabled={false}
onScroll={Animated.event(
[{ nativeEvent: { contentOffset: { x: scrollX } } }],
{ useNativeDriver: false })}
renderItem={({ item }) => (
<View style={[styles.slide, { backgroundColor: item.bg, width }]}>
<View style={[styles.circle1, { backgroundColor: item.accent }]} />
<View style={[styles.circle2, { backgroundColor: item.accent }]} />
<TouchableOpacity style={styles.skipBtn} onPress={handleSkip}><Text style={styles.skipText}>Skip</Text></TouchableOpacity>
<View style={styles.slideContent}><View style={styles.emojiContainer}>
<Text style={styles.emoji}>{item.emoji}</Text></View>
<Text style={styles.title}>{item.title}</Text><Text style={styles.subtitle}>{item.subtitle}</Text>
</View></View>)}/>
<View style={[styles.bottom, { backgroundColor: SLIDES[currentIndex].bg }]}>
<View style={styles.dotsRow}>
{SLIDES.map((_, i) => (
<View
key={i}style={[ styles.dot,
i === currentIndex ? styles.dotActive : styles.dotInactive ]}/>))}</View>
<TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
<Text style={[styles.nextBtnText, { color: SLIDES[currentIndex].bg }]}>
{currentIndex === SLIDES.length - 1 ? "Let's Shop! 🛍️" : 'Next →'}</Text></TouchableOpacity></View>
</View>)}
const styles = StyleSheet.create({container: { flex: 1 },
slide: {height,justifyContent: 'center',alignItems: 'center',position: 'relative',overflow: 'hidden',},
circle1: {position: 'absolute',width: 300,height: 300,borderRadius: 150,top: -80,right: -80,opacity: 0.4,},
circle2: { position: 'absolute',width: 200,height: 200,borderRadius: 100,bottom: 100,left: -60,opacity: 0.3,},
skipBtn: {position: 'absolute',top: 60,right: 24,backgroundColor: 'rgba(255,255,255,0.2)',paddingHorizontal: 16,paddingVertical: 8,borderRadius: 20,},
skipText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },slideContent: { alignItems: 'center', paddingHorizontal: 32 },
emojiContainer: {width: 140,height: 140,borderRadius: 70,backgroundColor: 'rgba(255,255,255,0.2)',justifyContent: 'center',alignItems: 'center',
marginBottom: 40,shadowColor: '#000',shadowOffset: { width: 0, height: 10 },shadowOpacity: 0.2,shadowRadius: 20,elevation: 10,},
emoji: { fontSize: 64 },title: {fontSize: 30,fontWeight: '800',color: '#FFFFFF',textAlign: 'center',marginBottom: 16,lineHeight: 38,},
subtitle: {fontSize: 16,color: 'rgba(255,255,255,0.85)',textAlign: 'center',lineHeight: 26,},
bottom: {position: 'absolute',
bottom: 0,left: 0,right: 0,paddingBottom: 50,paddingHorizontal: 24,paddingTop: 20,alignItems: 'center',gap: 20,},
dotsRow: { flexDirection: 'row', gap: 8 },
dot: { height: 8, borderRadius: 4 },
dotActive: { width: 28, backgroundColor: '#FFFFFF' },
dotInactive: { width: 8, backgroundColor: 'rgba(255,255,255,0.4)' },
nextBtn: {backgroundColor: '#FFFFFF',borderRadius: 16,paddingVertical: 18,paddingHorizontal: 40,width: '100%',alignItems: 'center',shadowColor: '#000',shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,shadowRadius: 12,elevation: 6,},
nextBtnText: { fontSize: 17, fontWeight: '800' },})