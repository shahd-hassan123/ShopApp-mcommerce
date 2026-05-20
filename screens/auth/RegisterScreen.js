import React, { useState } from 'react'
import {View, Text, TextInput, TouchableOpacity,StyleSheet, Alert, KeyboardAvoidingView, Platform} from 'react-native'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../lib/theme'
export default function RegisterScreen({ navigation }) {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [confirm, setConfirm] = useState('')
const { signUp, loading } = useAuthStore()
const { theme } = useThemeStore()
const handleRegister = async () => {
if (!email || !password || !confirm) {Alert.alert('Error', 'Please fill in all fields')
return}
if (password !== confirm) {Alert.alert('Error', 'Passwords do not match')
return}
if (password.length < 6) {
Alert.alert('Error', 'Password must be at least 6 characters')
return}
const { error } = await signUp(email, password)
if (error) {Alert.alert('Registration Failed', error.message)} else {
Alert.alert('Success! 🎉', 'Account created! Please check your email to confirm.', [
{ text: 'OK', onPress: () => navigation.navigate('Login') }
])}
}
return (
<KeyboardAvoidingView
style={[styles.container, { backgroundColor: theme.background }]}
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
<View style={styles.inner}>
<Text style={styles.logo}>🛍️</Text>
<Text style={[styles.title, { color: theme.text }]}>Create account</Text>
<Text style={[styles.subtitle, { color: theme.textSecondary }]}>Join us today</Text>
<TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
placeholder="Email"
placeholderTextColor={theme.textSecondary}
value={email}
onChangeText={setEmail}
keyboardType="email-address"
autoCapitalize="none"/>
<TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
placeholder="Password"
placeholderTextColor={theme.textSecondary}
value={password}
onChangeText={setPassword}
secureTextEntry/>
<TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.borderInput, color: theme.text }]}
placeholder="Confirm Password"
placeholderTextColor={theme.textSecondary}
value={confirm}       
onChangeText={setConfirm}
secureTextEntry/>
<TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]}
onPress={handleRegister}disabled={loading}>
<Text style={styles.buttonText}>
{loading ? 'Creating account...' : 'Create Account'}
</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('Login')}>
<Text style={[styles.link, { color: theme.textSecondary }]}>
Already have an account? <Text style={styles.linkBold}>Sign In</Text>
</Text>
</TouchableOpacity>
</View>
</KeyboardAvoidingView>)}
const styles = StyleSheet.create({container: { flex: 1 },inner: { flex: 1, justifyContent: 'center', padding: 24 },logo: { fontSize: 56, textAlign: 'center', marginBottom: 8 },
title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 32, marginTop: 4 },
input: {borderRadius: 12,padding: 16,fontSize: 15,marginBottom: 12,borderWidth: 1,},
button: {backgroundColor: '#6C63FF',borderRadius: 12,padding: 16,alignItems: 'center',marginTop: 8,marginBottom: 20,},buttonDisabled: { opacity: 0.6 },
buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },link: { textAlign: 'center', fontSize: 14 },
linkBold: { color: '#6C63FF', fontWeight: '700' },})