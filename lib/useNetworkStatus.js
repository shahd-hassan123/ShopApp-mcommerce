import { useState, useEffect } from 'react'
import * as Network from 'expo-network'
export function useNetworkStatus() {const [isConnected, setIsConnected] = useState(true)
useEffect(() => {checkNetwork()
const interval = setInterval(checkNetwork, 3000)
return () => clearInterval(interval)}, [])
const checkNetwork = async () => {
const state = await Network.getNetworkStateAsync()
setIsConnected(state.isConnected && state.isInternetReachable)}
return isConnected}