
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://gyditryslflaxxjupqvi.supabase.co'
const supabaseKey =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGl0cnlzbGZsYXh4anVwcXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODk5OTksImV4cCI6MjA1NDE2NTk5OX0.-r7CfBzqyU18cVcqsg-CEvgloq-30QLisZJt7cgrwyI'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
