import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
const supabaseUrl = "https://zwcdtdgwwsrffvbsljdn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3Y2R0ZGd3d3NyZmZ2YnNsamRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNDA2NDQsImV4cCI6MjA5MzcxNjY0NH0.RCYDxqSEAFsS6uPUE88x_LmcLvq-arUVZ9Y1QasZQMs"
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
auth: {storage: AsyncStorage,autoRefreshToken: true,persistSession: true,detectSessionInUrl: false,},})