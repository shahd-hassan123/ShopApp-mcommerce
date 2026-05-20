import * as Battery from 'expo-battery'
export async function shouldSync() {
try {const level = await Battery.getBatteryLevelAsync()
const state = await Battery.getBatteryStateAsync()
console.log('Battery level:', Math.round(level * 100) + '%')
console.log('Battery state:', state)
if (level < 0.15 && state !== Battery.BatteryState.CHARGING) {console.log('Battery too low — skipping sync')
return false}
return true} catch (error) {
console.log('Battery check error:', error)
return true}}
export async function getBatteryInfo() {
try {const level = await Battery.getBatteryLevelAsync()
const state = await Battery.getBatteryStateAsync()
return {level: Math.round(level * 100),
isCharging: state === Battery.BatteryState.CHARGING,
isLow: level < 0.15,}} catch (error) {
return { level: 100, isCharging: false, isLow: false }}
}