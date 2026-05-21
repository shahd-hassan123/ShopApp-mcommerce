import React, { useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as Linking from 'expo-linking'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'
import { registerForPushNotifications } from './lib/notifications'
import { useThemeStore } from './lib/theme'
import { useCartStore } from './store/cartStore'
import { useLanguageStore } from './lib/languageStore'
import NetworkBanner from './components/NetworkBanner'
import OnboardingScreen from './screens/OnboardingScreen'
import AuthScreen from './screens/AuthScreen'
import LoginScreen from './screens/auth/LoginScreen'
import RegisterScreen from './screens/auth/RegisterScreen'
import ProductsScreen from './screens/ProductsScreen'
import ScannerScreen from './screens/ScannerScreen'
import CartScreen from './screens/CartScreen'
import StoreLocatorScreen from './screens/StoreLocatorScreen'
import OrderHistoryScreen from './screens/OrderHistoryScreen'
import WishlistScreen from './screens/WishlistScreen'
import CurrencyScreen from './screens/CurrencyScreen'
import SettingsScreen from './screens/SettingsScreen'
import ProductDetailScreen from './screens/ProductDetailScreen'
import PaymentScreen from './screens/PaymentScreen'
import LanguageScreen from './screens/LanguageScreen'
import AddProductScreen from './screens/AddProductScreen'
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const prefix = Linking.createURL('/')
const linking = {prefixes: [prefix, 'shopapp://'],
config: {
screens: {Home: 'home',Cart: 'cart',Scanner: 'scanner',StoreLocator: 'stores',OrderHistory: 'orders',Wishlist: 'wishlist',Currency: 'currency',},},}
function MainTabs() {const { theme } = useThemeStore()
const { getTotalItems } = useCartStore()
const { t } = useLanguageStore()
return (
<Tab.Navigator
screenOptions={{headerShown: false,tabBarStyle: {backgroundColor: theme.background,borderTopColor: theme.border,borderTopWidth: 1,height: 85,paddingBottom: 20,paddingTop: 8,},
tabBarActiveTintColor: '#6C63FF',
tabBarInactiveTintColor: theme.textSecondary,
tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },}}>
<Tab.Screen name="Shop"
component={ProductsScreen}
options={{tabBarIcon: () => <Text style={{ fontSize: 22 }}>🛍️</Text>,
tabBarLabel: t.shop,}}/>
<Tab.Screen
name="Wishlist"
component={WishlistScreen}
options={{tabBarIcon: () => <Text style={{ fontSize: 22 }}>❤️</Text>,tabBarLabel: t.wishlist,}}/>
<Tab.Screen
name="Cart"
component={CartScreen}
options={{tabBarIcon: () => (
<View style={{backgroundColor: '#6C63FF',width: 52, height: 52,borderRadius: 26,justifyContent: 'center',alignItems: 'center',marginBottom: 8,shadowColor: '#6C63FF',
shadowOffset: { width: 0, height: 4 },shadowOpacity: 0.4,shadowRadius: 8,elevation: 8,}}>
<Text style={{ fontSize: 22 }}>🛒</Text></View>
),
tabBarLabel: '',
tabBarBadge: getTotalItems() > 0 ? getTotalItems() : undefined,
tabBarBadgeStyle: { backgroundColor: '#FF4444', color: '#FFFFFF', fontSize: 10 },}}/>
<Tab.Screen
name="Orders"
component={OrderHistoryScreen} options={{
tabBarIcon: () => <Text style={{ fontSize: 22 }}>📋</Text>,
tabBarLabel: t.orders,}} />
<Tab.Screen
name="Settings"
component={SettingsScreen}
options={{tabBarIcon: () => <Text style={{ fontSize: 22 }}>👤</Text>,tabBarLabel: t.profile,}}/>
</Tab.Navigator>)}
function AuthStack() {
return (<Stack.Navigator screenOptions={{ headerShown: false }}>
<Stack.Screen name="Onboarding" component={OnboardingScreen} />
<Stack.Screen name="Auth" component={AuthScreen} />
<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="Register" component={RegisterScreen} />
</Stack.Navigator>)}
function AppStack() {
return (<Stack.Navigator screenOptions={{ headerShown: false }}>
<Stack.Screen name="MainTabs" component={MainTabs} />
<Stack.Screen name="StoreLocator" component={StoreLocatorScreen} />
<Stack.Screen name="Currency" component={CurrencyScreen} />
<Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
<Stack.Screen name="Scanner" component={ScannerScreen} />
<Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
<Stack.Screen name="Payment" component={PaymentScreen} />
<Stack.Screen name="Language" component={LanguageScreen} />
<Stack.Screen name="AddProduct" component={AddProductScreen} />
</Stack.Navigator>)}

export default function App() {const { session, setSession } = useAuthStore()
const { theme, loadTheme } = useThemeStore()
const { loadLanguage } = useLanguageStore()
useEffect(() => {supabase.auth.getSession().then(({ data: { session } }) => {setSession(session)})
const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
setSession(session)})
registerForPushNotifications()
loadTheme()
loadLanguage()
return () => {subscription.unsubscribe()}
  },[])
return (<View style={[styles.container, { backgroundColor: theme.background }]}>
<NetworkBanner />
<NavigationContainer linking={linking}>
{session ? <AppStack /> : <AuthStack />}
</NavigationContainer>
</View>)}
const styles = StyleSheet.create({container: { flex: 1 },})