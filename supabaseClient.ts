import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lpghpgmjcoesphmqwrld.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZ2hwZ21qY29lc3BobXF3cmxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjE5MDQ4MywiZXhwIjoyMDU3NzY2NDgzfQ.rh_L-isHwML17DR3FR419-2nrWiF2qBEUGfdUZ6-3Kk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Set to false for React Native
  },
});