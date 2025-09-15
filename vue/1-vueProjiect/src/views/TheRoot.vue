<template>
  <div>
    <!-- 渲染路由匹配到的组件 -->
    <router-view></router-view>
    <div class="footer h-12">
      <TabBar class="fixed bottom-0 left-0 right-0">
      </TabBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TabBar from '@/views/layout/TabBar.vue'
const count = ref(0);



</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: white;
}
</style>
