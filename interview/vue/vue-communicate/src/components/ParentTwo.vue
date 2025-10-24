<template>
    <div>
        ParentTwo
        {{ count }}
        <!-- 
            这里确实相当于把回调函数 onMyClick 作为 myClick 事件的响应，通过 v-on（@）语法传递给子组件。
            当子组件触发 emit('myClick') 时，父组件的 onMyClick 会被调用。
         -->
        <ChildTwo @myClick="onMyClick"/>
    </div>
</template>

<script setup>
import ChildTwo from './ChildTwo.vue';
import { ref } from 'vue';
const count = ref(0);
const onMyClick = (msg) => {
    console.log(msg);
    count.value++;
}
</script>

<style>
</style>