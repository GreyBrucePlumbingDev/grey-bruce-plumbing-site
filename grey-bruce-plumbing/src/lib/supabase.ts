import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// check if supabase is connected
export const checkSupabaseConnection = async () => {
    try {
        // ping system health endpoint
        const { error } = await supabase.from('_health').select('*').limit(1)

        if (error) {
            console.error('Supabase connection error: ', error.message)
            return false
        }

        console.log('supabase connection successful!')
        return true
    } catch (err) {
        console.error('supabase connection error: ', err)
        return false
    }
}

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)