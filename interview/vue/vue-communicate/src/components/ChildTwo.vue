<template>
    <div>
        ChildTwo
        <button @click="onMyClick">点击</button>
        <!-- Vue 会自动在 kebab-case 和 camelCase 之间进行转换！ -->
        <button @click="emit('my-click','hello')">自定义事件</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// 这是“自定义事件”思想，子组件通过 emit 通知父组件，让父组件响应。
// 在 Vue3 setup 语法糖中，使用 defineEmits 来定义自定义事件
const emit = defineEmits(['myClick', 'my-click']);
const onMyClick = () => {
    emit('myClick', 'msg2'); // 子 -> 父通信，把 'msg2' 传递给父组件
}

</script>

<style scoped>

</style>
