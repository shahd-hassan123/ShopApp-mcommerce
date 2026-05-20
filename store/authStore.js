import { create } from 'zustand'
import { supabase } from '../lib/supabase'
export const useAuthStore = create((set) => ({user: null,session: null,loading: false,
setSession: (session) => set({session,user: session?.user ?? null,}),
signUp: async (email, password) => {
set({ loading: true })
const { data, error } = await supabase.auth.signUp({ email, password })
set({ loading: false })
return { data, error }},
signIn: async (email, password) => {
set({ loading: true })
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
set({ loading: false })
return { data, error }},
signOut: async () => {await supabase.auth.signOut()
set({ user: null, session: null })},}))