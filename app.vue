<script setup>
const { data: info } = await useAsyncData('info', () => {
  return queryCollection('common').where('stem', '=', 'info').first()
})
const { data: contents } = await useAsyncData('contents', async () => {
  const allContents = await queryCollection('content').all()
  const contents = allContents.filter(content => content.path !== '/')
  return contents
})
const { data: navContents } = await useAsyncData('navContents', () => {
  return queryCollectionNavigation('content')
})
</script>

<template>

  <Head>
    <Title>{{ info.title }}</Title>
    <Meta name="description" :content="info.description" />
  </Head>
  <div class="container mx-auto py-10 px-5 min-h-screen">
    <div class="grid grid-cols-[30%_1fr] gap-12">
      <div>
        <div class="sticky top-10">
          <a href="/"><img :src="info.avatar" class="rounded mb-4 w-40"></a>
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
          <hr>
          <div class="flex flex-col gap-2">
            <NavChild v-for="nav in navContents" :key="nav.title" :nav="nav" />
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <NuxtPage :info="info" />
      </div>
    </div>
  </div>
</template>
