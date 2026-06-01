import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://irvohdoacyxbqrsjlhxs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlydm9oZG9hY3l4YnFyc2psaHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxODY3MjgsImV4cCI6MjA5NTc2MjcyOH0.751cp7suWTIueYbz9IaGWK-QqbPsUM8SqIaLOSrRuMM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
