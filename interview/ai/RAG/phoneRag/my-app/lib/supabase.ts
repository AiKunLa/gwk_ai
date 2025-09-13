import { createClient } from "@supabase/supabase-js";
import { config } from "./config";

// 创建并导出Supabase客户端实例
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// 导出createClient函数以便在需要时创建自定义客户端
export { createClient } from "@supabase/supabase-js";