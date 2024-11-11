import { createClient } from "@supabase/supabase-js";

// Get Supabase URL and Service Role Key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL or Service Role Key is not defined in the environment variables.");
}

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Export the client for use in other modules
export { supabase };
