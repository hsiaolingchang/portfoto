<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/effect-fade'
import { Navigation, EffectFade, Thumbs } from 'swiper/modules'
import images from '@/public/images.json'

defineProps(['info', 'navContents'])
const route = useRoute()
const popup = ref(false)
const initialSlide = ref(0)
const thumbsSwiper = ref(null)
const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper
}
const useGalleryImages = async (gallery) => {
  const promises = gallery.map((item) => {
    if (item.endsWith('/')) {
      return images.filter(img => img.startsWith(item))
    }
    return item
  })

  return (await Promise.all(promises)).flat()
}

watch(popup, (isPopup) => {
  if (isPopup) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
    setThumbsSwiper(null)
  }
})

const { data: page } = await useAsyncData('page', () => queryCollection('content').path(route.path).first())
const { data: currentNav } = await useAsyncData('currentNav', () => {
  return queryCollection('content').where('path', 'LIKE', `${route.path}%`).select('title', 'banner', 'path', 'gallery').all()
})
const { data: galleryImages } = useAsyncData('galleryImages', () => useGalleryImages(page.value?.gallery))
</script>

<template>

  <Head>
    <Title v-if="page?.title">{{ page.title }} - {{ info.title }}</Title>
    <Title v-else>{{ info.title }}</Title>
  </Head>
  <div :class="popup ? 'show' : ''" class="popup-container">
    <div @click="popup = false" class="absolute top-0 right-0 text-gray-500 cursor-pointer z-10">
      <i class="text-[3rem] bi bi-x"></i>
    </div>
    <swiper v-if="popup" :modules="[Navigation, EffectFade, Thumbs]" :thumbs="{ swiper: thumbsSwiper }"
      :navigation="true" :slides-per-view="1" :space-between="30" :loop="true" :initial-slide="initialSlide"
      :effect="'fade'" class="gallery-swiper">
      <swiper-slide v-for="image in galleryImages" :key="image" class="bg-white">
        <div class="flex justify-center items-center h-full w-full">
          <NuxtImg :src="image" class="h-full w-full object-contain m-auto" />
        </div>
      </swiper-slide>
    </swiper>
    <swiper v-if="popup" @swiper="setThumbsSwiper" :modules="[Navigation, Thumbs]" :slides-per-view="'auto'"
      :space-between="10" :watch-slides-progress="true" class="gallery-thumbs">
      <swiper-slide v-for="image in galleryImages" :key="image" class="bg-white" style="width: auto;">
        <div class="flex justify-center items-center h-full aspect-square cursor-pointer">
          <NuxtImg :src="image" class="h-full w-full object-cover m-auto" />
        </div>
      </swiper-slide>
    </swiper>
  </div>
  <main v-if="page">
    <h1 v-if="page.showTitle" class="mb-6">{{ page.title }}</h1>
    <NuxtImg v-if="page.banner" :src="page.banner" class="w-full rounded mb-6" />
    <div v-if="galleryImages?.length" class="grid grid-cols-2 lg:grid-cols-3 gap-4 my-8">
      <div v-for="(image, index) in galleryImages" :key="image" class="aspect-square hover-opacity">
        <NuxtImg @click="() => { initialSlide = index; popup = true }" :src="image"
          class="rounded w-full h-full object-cover cursor-pointer" />
      </div>
    </div>
    <ContentRenderer :value="page" />
  </main>
  <main v-else-if="currentNav.length">
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 my-8">
      <template v-for="nav in currentNav">
        <NuxtLink :to="nav.path">
          <div class="aspect-square relative hover-opacity">
            <NuxtImg v-if="nav.banner" :src="nav.banner" class="w-full h-full object-cover rounded mb-6" />
            <NuxtImg v-else-if="nav.gallery" :src="nav.gallery[0]" class="w-full h-full object-cover rounded mb-6" />
            <div v-else class="w-full h-full bg-gray-200 rounded mb-6"></div>
            <span class="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{{ nav.title }}</span>
          </div>
        </NuxtLink>
      </template>
    </div>
  </main>
  <main v-else>
    <h1>Oh no! 找不到此頁面 :(</h1>
  </main>
</template>
