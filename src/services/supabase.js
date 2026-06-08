import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dbickxdkgaifzjhqshve.supabase.co";
const supabaseKey = "sb_publishable_DstTLRgXy4Rt2R2KysDcfg_keagLquf";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
