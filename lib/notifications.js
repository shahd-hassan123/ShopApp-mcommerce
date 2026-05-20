import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
Notifications.setNotificationHandler({
handleNotification: async () => ({
shouldShowAlert: true,
shouldPlaySound: true,
shouldSetBadge: true,
}),
})
export async function registerForPushNotifications() {
if (!Device.isDevice) {alert('Push notifications only work on a real device!')
return null}
const { status: existingStatus } = await Notifications.getPermissionsAsync()
let finalStatus = existingStatus
if (existingStatus !== 'granted') {
const { status } = await Notifications.requestPermissionsAsync()
finalStatus = status}
if (finalStatus !== 'granted') {
alert('Permission denied for push notifications!')
return null}
const token = await Notifications.getExpoPushTokenAsync()
return token.data}
export async function sendLocalNotification(title, body) {
await Notifications.scheduleNotificationAsync({
content: {title,body,sound: true,},
trigger: null, 
})
}