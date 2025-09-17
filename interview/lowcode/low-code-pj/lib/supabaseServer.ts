import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { config as dotenvConfig } from 'dotenv'

// 仅在服务端加载 .env 变量
dotenvConfig()

// 读取并校验环境变量（带回退）
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)')
}

if (!supabaseKey) {
  throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY)')
}

// 服务端 Supabase 客户端（可使用非公开变量）
export const supabaseServer = createClient(supabaseUrl, supabaseKey)


