import React, { useState } from 'react'
import {View, Text, TextInput, TouchableOpacity,StyleSheet, Alert, KeyboardAvoidingView, Platform} from 'react-native'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../lib/theme'
export default function LoginScreen({ navigation }) {const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const { signIn, loading } = useAuthStore()
const { theme } = useThemeStore()
const handleLogin = async () => {
if (!email || !password) {Alert.alert('Error', 'Please fill in all fields')
return}
const { error } = await signIn(email, password)
if (error) Alert.alert('Login Failed', error.message)}
return (
<KeyboardAvoidingView
style={[styles.container, { backgroundColor: theme.background }]}
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
<View style={styles.inner}>
<Text style={styles.logo}>🛍️</Text>
<Text style={[styles.title, { color: theme.text }]}>Welcome back</Text>
<Text style={[styles.subtitle, { color: theme.textSecondary }]}>Sign in to your account</Text>
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
<TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]}
onPress={handleLogin}
disabled={loading}>
<Text style={styles.buttonText}>
{loading ? 'Signing in...' : 'Sign In'}
</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('Register')}>
<Text style={[styles.link, { color: theme.textSecondary }]}>
Don't have an account? <Text style={styles.linkBold}>Register</Text>
</Text>
</TouchableOpacity>
</View>
</KeyboardAvoidingView>)}
const styles = StyleSheet.create({container: { flex: 1 },inner: { flex: 1, justifyContent: 'center', padding: 24 },logo: { fontSize: 56, textAlign: 'center', marginBottom: 8 },title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 32, marginTop: 4 },
input: {borderRadius: 12,padding: 16,fontSize: 15,marginBottom: 12,borderWidth: 1,},button: {backgroundColor: '#6C63FF',borderRadius: 12,padding: 16,alignItems: 'center',marginTop: 8,marginBottom: 20,},
buttonDisabled: { opacity: 0.6 },
buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
link: { textAlign: 'center', fontSize: 14 },
linkBold: { color: '#6C63FF', fontWeight: '700' },})