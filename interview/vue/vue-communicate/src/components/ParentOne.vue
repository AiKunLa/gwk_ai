<template>
    <div>
        ParentOne
        <ChildOne :msg1="msg1" :msg2="msg2" :msg3="msg3"></ChildOne>
    </div>
</template>

<script >
import { ref } from 'vue';
import ChildOne from './ChildOne.vue';
export default {
    // 这里是 options API 和 composition API 的混用写法，实际上 Vue 3 推荐只用其中一种。
    // 如果你用 setup()，就不要写 data() 了，反之亦然。
    // 简单来说，data() 是 Vue 2（选项式 API）用的，
    // setup() 是 Vue 3（组合式 API）用的。
    // 推荐只留 setup：

    setup() {
        const msg1 = ref('msg1');
        const msg2 = ref('msg2');
        const msg3 = ref('msg3');
        return {
            msg1,
            msg2,
            msg3,
        }
    },
    components: {
        ChildOne,
    }
}
</script>

<style scoped>  
</style>