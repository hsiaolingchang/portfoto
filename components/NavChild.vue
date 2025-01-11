<script setup>
const route = useRoute()
const expandedSections = ref({})
const props = defineProps({
  nav: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div v-if="nav.page === false" class="collapse-box">
    <div @click="expandedSections[nav.title] = !expandedSections[nav.title]"
      class="text-gray-500 font-bold cursor-pointer hover:text-gray-700 flex items-center">
      <i :class="[
        'bi bi-caret-right-fill mr-2',
        expandedSections[nav.title] ? 'rotate-90' : ''
      ]" />
      {{ nav.title }}
    </div>
    <div class="collapse-children flex flex-col mt-2" :class="{ open: expandedSections[nav.title] }">
      <NavChild v-for="childNav in nav.children" :key="childNav.path" :nav="childNav" />
    </div>
  </div>
  <div v-else-if="nav.title.length > 0">
    <div class="flex items-center">
      <NuxtLink :to="nav.path" :class="[
        'font-bold',
        route.path === nav.path ? 'text-gray-700' : 'text-gray-500 hover:text-gray-700'
      ]">
        <i class="bi bi-caret-right mr-2" />{{ nav.title }}
      </NuxtLink>
    </div>
  </div>
</template>