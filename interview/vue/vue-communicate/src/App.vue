
<!-- 
script setup是Vue 3中的一种编写组件的语法糖。
使用<script setup>可以让你直接在<script>标签内编写组合式API里的代码（比如ref、reactive、import等），
这段区域会自动成为setup()函数的内容。这样写代码更简洁，
不需要显式写export default和setup()，也不用return暴露变量。
lang="ts"表示此处脚本使用TypeScript语法。

本例中，import ParentOne ... 是引入子组件ParentOne，
后面在<template>中就可以直接使用<ParentOne />标签。
-->
<script setup>
import { ref } from 'vue';
import ParentOne from './components/ParentOne.vue';
import ParentTwo from './components/ParentTwo.vue';
const msg = ref('msg1')
const msg2 = ref('msg2')

</script>

<template>
  <div>
    <ParentOne>
    </ParentOne>
    <ParentTwo>
      
    </ParentTwo>

  </div>
</template>

<style scoped>

</style>
