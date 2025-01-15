<script setup>
import info from '@/public/info.json'
const { data: navContents } = await useAsyncData('navContents', () => {
  return queryCollectionNavigation('content')
})
</script>

<template>

  <Head>
    <Title>{{ info.title }}</Title>
    <Meta name="description" :content="info.description" />
  </Head>
  <div class="container mx-auto py-10 px-5">
    <div class="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-12">
      <div>
        <div class="sticky top-10">
          <div class="flex flex-col max-md:items-center">
            <a href="/">
              <NuxtImg :src="info.avatar" class="rounded mb-4 w-40" />
            </a>
            <h1 class="mb-1">{{ info.name }}</h1>
            <div class="mb-1"><a :href="`mailto:${info.email}`">{{ info.email }}</a></div>
            <div class="mb-3"><a :href="`tel:${info.phone}`">{{ info.phone }}</a></div>
            <div class="flex flex-wrap gap-2 text-2xl">
              <a v-if="info.instagram" :href="info.instagram" target="_blank" class="text-gray-500 font-bold">
                <i class="bi bi-instagram"></i></a>
              <a v-if="info.facebook" :href="info.facebook" target="_blank" class="text-gray-500 font-bold">
                <i class="bi bi-facebook"></i></a>
              <a v-if="info.twitter" :href="info.twitter" target="_blank" class="text-gray-500 font-bold">
                <i class="bi bi-twitter-x"></i></a>
              <a v-if="info.linkedin" :href="info.linkedin" target="_blank" class="text-gray-500 font-bold">
                <i class="bi bi-linkedin"></i></a>
              <a v-if="info.github" :href="info.github" target="_blank" class="text-gray-500 font-bold">
                <i class="bi bi-github"></i></a>
            </div>
          </div>
          <hr>
          <div class="flex flex-col gap-2">
            <NavChild v-for="nav in navContents" :key="nav.path" :nav="nav" />
          </div>
        </div>
      </div>
      <div class="flex">
        <NuxtPage :info="info" :navContents="navContents" />
      </div>
    </div>
  </div>
</template>
