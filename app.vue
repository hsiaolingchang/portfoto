<script setup>
import info from '@/public/info.json'
import { useWindowSize } from '@vueuse/core'
const { data: navContents } = await useAsyncData('navContents', () => {
  return queryCollectionNavigation('content')
})
const isMenuOpen = ref(false)
const openMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const { data: windowSize } = useAsyncData('windowSize', () => useWindowSize())
</script>

<template>

  <Head>
    <Title>{{ info.title }}</Title>
    <Meta name="description" :content="info.description" />
  </Head>
  <div class="container mx-auto max-w-screen-lg">
    <div v-if="windowSize.width < 768" class="sticky top-0 left-0 w-screen z-50">
      <div @click="openMenu()" class="me-4 text-[2rem] text-right bg-white">
        <i class="bi bi-list"></i>
      </div>
      <div v-if="isMenuOpen" class="fixed top-10 left-0 w-screen bg-white p-8 shadow-md fade-in-on-open">
        <div class="flex flex-col items-center">
          <a href="/">
            <NuxtImg :src="info.avatar" class="rounded w-32 mb-4" />
          </a>
          <h1 class="mb-1">{{ info.name }}</h1>
          <div class="mb-1"><a :href="`mailto:${info.email}`">{{ info.email }}</a></div>
          <div class="mb-3"><a :href="`tel:${info.phone}`">{{ info.phone }}</a></div>
          <div class="flex flex-wrap gap-2 text-2xl">
            <a v-if="info.instagram" :href="info.instagram" target="_blank" class="text-gray-600 font-bold">
              <i class="bi bi-instagram"></i></a>
            <a v-if="info.facebook" :href="info.facebook" target="_blank" class="text-gray-600 font-bold">
              <i class="bi bi-facebook"></i></a>
            <a v-if="info.twitter" :href="info.twitter" target="_blank" class="text-gray-600 font-bold">
              <i class="bi bi-twitter-x"></i></a>
            <a v-if="info.linkedin" :href="info.linkedin" target="_blank" class="text-gray-600 font-bold">
              <i class="bi bi-linkedin"></i></a>
            <a v-if="info.github" :href="info.github" target="_blank" class="text-gray-600 font-bold">
              <i class="bi bi-github"></i></a>
          </div>
        </div>
        <hr>
        <div class="flex flex-col gap-1 text-lg">
          <NavChild v-for="nav in navContents" :key="nav.path" :nav="nav" />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-12 py-8 px-5">
      <div v-if="windowSize.width >= 768" class="sticky top-10">
        <div class="flex flex-col gap-4">
          <a href="/">
            <NuxtImg :src="info.avatar" class="rounded w-32 md:w-40" />
          </a>
          <div>
            <h1 class="mb-1">{{ info.name }}</h1>
            <div class="mb-1"><a :href="`mailto:${info.email}`">{{ info.email }}</a></div>
            <div class="mb-3"><a :href="`tel:${info.phone}`">{{ info.phone }}</a></div>
            <div class="flex flex-wrap gap-2 text-2xl">
              <a v-if="info.instagram" :href="info.instagram" target="_blank" class="text-gray-600 font-bold">
                <i class="bi bi-instagram"></i></a>
              <a v-if="info.facebook" :href="info.facebook" target="_blank" class="text-gray-600 font-bold">
                <i class="bi bi-facebook"></i></a>
              <a v-if="info.twitter" :href="info.twitter" target="_blank" class="text-gray-600 font-bold">
                <i class="bi bi-twitter-x"></i></a>
              <a v-if="info.linkedin" :href="info.linkedin" target="_blank" class="text-gray-600 font-bold">
                <i class="bi bi-linkedin"></i></a>
              <a v-if="info.github" :href="info.github" target="_blank" class="text-gray-600 font-bold">
                <i class="bi bi-github"></i></a>
            </div>
          </div>
        </div>
        <hr>
        <div class="flex flex-col gap-1">
          <NavChild v-for="nav in navContents" :key="nav.path" :nav="nav" />
        </div>
      </div>
      <div class="min-w-0 min-h-0">
        <NuxtPage :info="info" :navContents="navContents" />
      </div>
    </div>
  </div>
</template>
