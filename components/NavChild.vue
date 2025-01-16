<script setup>
const route = useRoute()
const props = defineProps({
  nav: {
    type: Object,
    required: true
  }
})
const checkExpanded = (path) => {
  if (route.path.startsWith(path)) {
    return true
  }
  return false
}
</script>

<template>
  <div v-if="nav.page === false" class="collapse-box">
      <NuxtLink :to="nav.path" :class="[
        route.path === nav.path ? 'text-gray-700' : 'text-gray-500 hover:text-gray-700'
      ]">
        <i class="bi bi-caret-right mr-2" />{{ nav.title }}
      </NuxtLink>
    <div class="collapse-children flex flex-col gap-1" :class="{ open: checkExpanded(nav.path) }">
      <NavChild v-for="childNav in nav.children" :key="childNav.path" :nav="childNav" />
    </div>
  </div>
  <div v-else-if="nav.title.length > 0">
    <div class="flex items-center">
      <NuxtLink :to="nav.path" :class="[
        route.path === nav.path ? 'text-gray-700' : 'text-gray-500 hover:text-gray-700'
      ]">
        <i class="bi bi-caret-right-fill mr-2" />{{ nav.title }}
      </NuxtLink>
    </div>
  </div>
</template>