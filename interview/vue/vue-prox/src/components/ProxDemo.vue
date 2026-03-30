<template>
    <div>
        <h2>Proxy 演示</h2>
        <div>{{ message }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Proxy Demo')
</script>

<style scoped>
div {
    padding: 1rem;
}
</style>