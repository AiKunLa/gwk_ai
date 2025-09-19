<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="onSubmit" class="form">
        <div class="field">
            <label for="">用户名</label>
            <input type="text" v-model="username" placeholder="请输入用户名">
        </div>
        <div class="field">
            <label for="">密码</label>
            <input type="password" v-model="password" placeholder="请输入密码">
        </div>
        <button type="submit">登录</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { login } from '@/api/login'

const router = useRouter()
const userStore = useUserStore()

const username = ref('admin')
const password = ref('123456')
const error = ref('')

const onSubmit = async () => {
  error.value = ''
  try {
    const data = await login({ username: username.value, password: password.value })
    // 兼容 mock 返回 { code, data } 或已拦截成 data
    const token = (data as any)?.token ?? (data as any)?.data?.token
    const name = (data as any)?.username ?? (data as any)?.data?.username ?? username.value
    if (!token) throw new Error('登录失败')
    userStore.setToken(token)
    userStore.setUsername(name)
    router.push('/')
  } catch (e: any) {
    error.value = e?.message || '登录失败'
  }
}
</script>

<style scoped>
.login { padding: 24px; max-width: 360px; margin: 40px auto; }
.form { display: grid; gap: 12px; }
.field { display: grid; gap: 6px; }
.error { color: #c00; margin-top: 12px; }
</style>