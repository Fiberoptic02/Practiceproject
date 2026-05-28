import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xpahvudetakqqrduwilx.supabase.co"
const supabaseKey = "sb_publishable_AQtYkDkqzH8PqyUHVHgk0Q_dMOwwQp3";

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
