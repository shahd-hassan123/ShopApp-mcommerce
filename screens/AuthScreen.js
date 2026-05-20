import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity,Dimensions} from 'react-native'
const { height } = Dimensions.get('window')
export default function AuthScreen({ navigation }) {
return (
<View style={styles.container}>
<View style={styles.bgTop} />
<View style={styles.circle1} />
<View style={styles.circle2} />
<View style={styles.circle3} />
<View style={styles.logoSection}>
<View style={styles.logoCircle}>
<Text style={styles.logoEmoji}>🛍️</Text>
</View>
<Text style={styles.appName}>ShopApp</Text>
<Text style={styles.tagline}>Your premium shopping experience</Text></View>
<View style={styles.featuresRow}>
<View style={styles.featureItem}>
<Text style={styles.featureIcon}>🚀</Text>
<Text style={styles.featureText}>Fast</Text>
</View>
<View style={styles.featureDivider} />
<View style={styles.featureItem}>
<Text style={styles.featureIcon}>🔒</Text>
<Text style={styles.featureText}>Secure</Text>
</View>
<View style={styles.featureDivider} />
<View style={styles.featureItem}>
<Text style={styles.featureIcon}>💎</Text>
<Text style={styles.featureText}>Premium</Text>
</View>
</View>
<View style={styles.buttonsSection}>
<TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
<Text style={styles.loginBtnText}>Sign In</Text>
</TouchableOpacity>
<TouchableOpacity
style={styles.registerBtn}
onPress={() => navigation.navigate('Register')}>
<Text style={styles.registerBtnText}>Create Account</Text></TouchableOpacity>
<Text style={styles.terms}>By continuing you agree to our{' '}<Text style={styles.termsLink}>Terms of Service</Text>
{' '}and{' '}
<Text style={styles.termsLink}>Privacy Policy</Text>
</Text>
</View>
</View>)}
const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#FFFFFF' },
bgTop: {position: 'absolute',top: 0,left: 0,
right: 0,height: height * 0.55,backgroundColor: '#6C63FF',borderBottomLeftRadius: 40,borderBottomRightRadius: 40,},
circle1: {position: 'absolute',width: 200,height: 200,borderRadius: 100,backgroundColor: 'rgba(255,255,255,0.08)',top: -40,right: -40,},
circle2: {position: 'absolute',width: 150,height: 150,borderRadius: 75,backgroundColor: 'rgba(255,255,255,0.06)',top: 100,left: -40,},
circle3: {position: 'absolute',width: 100,height: 100,borderRadius: 50,backgroundColor: 'rgba(255,255,255,0.1)',top: 200,right: 30,},
logoSection: {alignItems: 'center',paddingTop: 100,paddingBottom: 30,},
logoCircle: {width: 110,height: 110,borderRadius: 55,backgroundColor: 'rgba(255,255,255,0.2)',justifyContent: 'center',alignItems: 'center',marginBottom: 16,shadowColor: '#000',shadowOffset: { width: 0, height: 8 },shadowOpacity: 0.2,shadowRadius: 16,elevation: 10,},
logoEmoji: { fontSize: 52 },appName: {fontSize: 38,fontWeight: '800',color: '#FFFFFF',letterSpacing: 1,marginBottom: 8,},
tagline: {fontSize: 15,color: 'rgba(255,255,255,0.8)',fontWeight: '500',},featuresRow: {
flexDirection: 'row',justifyContent: 'center',alignItems: 'center',backgroundColor: '#FFFFFF',marginHorizontal: 32,
borderRadius: 20,padding: 20,shadowColor: '#6C63FF',shadowOffset: { width: 0, height: 8 },shadowOpacity: 0.15,shadowRadius: 20,elevation: 10,marginTop: -20,},
featureItem: { flex: 1, alignItems: 'center', gap: 6 },
featureIcon: { fontSize: 24 },featureText: { fontSize: 12, fontWeight: '700', color: '#1A1A2E' },
featureDivider: { width: 1, height: 30, backgroundColor: '#F0F0F0' },
buttonsSection: {padding: 24,gap: 12,marginTop: 20,},loginBtn: {backgroundColor: '#6C63FF',borderRadius: 16,padding: 18,alignItems: 'center',shadowColor: '#6C63FF',shadowOffset: { width: 0, height: 6 },
shadowOpacity: 0.35,shadowRadius: 12,elevation: 8,},loginBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
registerBtn: {backgroundColor: '#FFFFFF',borderRadius: 16,padding: 18,alignItems: 'center',borderWidth: 2,borderColor: '#6C63FF',},
registerBtnText: { color: '#6C63FF', fontSize: 17, fontWeight: '800' },terms: {
fontSize: 12,color: '#999',textAlign: 'center',marginTop: 8,lineHeight: 20,},termsLink: { color: '#6C63FF', fontWeight: '600' },})