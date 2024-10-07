import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://ovfalbwdefhczybpihca.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92ZmFsYndkZWZoY3p5YnBpaGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzMDQ2MTksImV4cCI6MjA0Mzg4MDYxOX0.JO-n6L1S0Jw3UY-amCBCIQTrYHfUHMC52JdZakRcGXk'

const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }