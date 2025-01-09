<script setup>
import { Swiper, SwiperSlide, useSwiper } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'

defineProps(['info'])
const route = useRoute()
const popup = ref(false)
const initialSlide = ref(0)

const useGalleryImages = async (gallery) => {
  const promises = gallery.map(async (item) => {
    if (item.endsWith('/')) {
      const { data: files } = await useAsyncData(`files-${item}`, () =>
        $fetch('/api/_content/files', {
          params: { prefix: item }
        })
      )
      return files.value || []
    }
    return item
  })

  return (await Promise.all(promises)).flat()
  
}

const { data: page } = await useAsyncData('page', () => queryCollection('content').path(route.path).first())
const { data: galleryImages } = useAsyncData('galleryImages', () => useGalleryImages(page.value?.gallery))
</script>

<template>

  <Head>
    <Title v-if="page?.title">{{ info.title }} | {{ page.title }}</Title>
    <Title v-else>{{ info.title }}</Title>
  </Head>
  <div v-if="popup"
    class="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center p-6">
    <div @click="popup = false" class="absolute top-0 right-0 text-gray-500 cursor-pointer z-10">
      <i class="text-[3rem] bi bi-x"></i>
    </div>
    <swiper :modules="[Navigation, Pagination]" :pagination="{ clickable: true }" :navigation="true"
      :slides-per-view="1" :space-between="30" :loop="true" :initial-slide="initialSlide"
      :autoplay="{ delay: 2500, disableOnInteraction: false }"
      class="w-full h-full">
      <swiper-slide v-for="image in galleryImages" :key="image">
        <img :src="image" class="h-full max-w-full rounded mx-auto">
      </swiper-slide>
    </swiper>
  </div>
  <main v-if="page">
    <h1 v-if="page.title" class="mb-6">{{ page.title }}</h1>
    <img v-if="page.banner" :src="page.banner" class="w-full rounded mb-6">
    <div v-if="galleryImages?.length" class="grid grid-cols-2 lg:grid-cols-3 gap-4 my-8">
      <div v-for="(image, index) in galleryImages" :key="image" class="flex items-center justify-center">
        <img @click="() => { initialSlide = index; popup = true }" :src="image" class="w-full rounded cursor-pointer">
      </div>
    </div>
    <ContentRenderer :value="page" />
  </main>
  <main v-else>
    <h1>404</h1>
  </main>
</template>
