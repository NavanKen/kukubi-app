import { createClient } from "@supabase/supabase-js";
import environment from "@/config/environment";
// import { Database } from "@/types/database.types";

const supabase = createClient(
  environment.SUPABASE_URL || "",
  environment.SUPABASE_KEY || ""
);

export default supabase;
