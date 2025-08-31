import { createClient } from "@supabase/supabase-js";
import environment from "@/config/environment";

const supabase = createClient(
  environment.SUPABASE_URL || "",
  environment.SUPABASE_SERVICE_ROLE || "",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

export const supabaseService = supabase.auth.admin;
