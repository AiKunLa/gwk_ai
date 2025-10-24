<template>
    <div>
        {{ msg1 }}
        {{ msg2 }}
        {{ msg3 }}
    </div>
</template>

<script >
import { ref } from 'vue';

export default {
    // props: 父组件传递过来的数据
    props: ['msg1', 'msg2', 'msg3'],
}


</script>

<style scoped>  
</style>