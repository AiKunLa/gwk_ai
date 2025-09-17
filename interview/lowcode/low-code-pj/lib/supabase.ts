// 初始化supabase客户端
// 用于连接和操作Supabase数据库服务
import { createClient } from "@supabase/supabase-js";

// 创建并导出Supabase客户端实例
// 使用环境变量中的URL和匿名密钥进行连接
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,      // 浏览器可读取：Supabase API URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string  // 浏览器可读取：匿名公钥
)