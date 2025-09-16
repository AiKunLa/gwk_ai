<template>
  <div class="home">
    <!-- 顶部背景图 渐变颜色替代 -->
    <div class="top-bg absolute h-36 -z-10 w-screen 
    bg-gradient-to-b from-orange-500 to-white">
    </div>
    <!-- 搜索框 -->
    <van-search
      v-model="searchField"
      placehoder="请输入搜索关键词"
      show-action
      shape="round"
      background="transparent"
      class="mb-2"
    >
      <template #action>
        <div class="text-white">
          <van-icon name="shopping-cart-o" size="1.25rem"/>
        </div>
      </template>
    </van-search>
    <!-- 顶部导航栏 -->
    <main class="flex flex-col space-y-4">
      <header class="w-[calc(100vw-2rem)] min-h-24 bg-white 
      rounded-2xl p-2 shadow-md self-center">
        <section class="topbar flex justify-around mb-3">
          <div 
            v-for="item in topBarState"
            :key="item.title"
            class="topbar-item flex flex-col items-center">
            <div class="topbar-item__icon">
              <van-icon :name="item.icon" size="2rem" />
            </div>
            <div class="topbar-item__text text-xs">
              {{ item.title }}
            </div>
          </div>
        </section>

        <section>
          <h2>最近浏览</h2>
          <RecentlyViewed :items="recentlyViewedState" />
        </section>

      </header>

    
    </main>
  </div>
</template>
<script setup lang="ts">
import { toRefs, ref } from 'vue';
import {
  useHomeStore
} from "../../store/homeStore";
const searchField = ref<string>('');

const { topBarState, navBarState, recentlyViewedState } = toRefs(useHomeStore());

</script>
<style>
</style>