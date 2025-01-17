<script setup>
const route = useRoute()
const props = defineProps({
  nav: {
    type: Object,
    required: true
  },
  isSubNav: {
    type: Boolean,
    default: false
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
  <div v-if="(nav.title.length > 0) && (!isSubNav || nav.page === false)" class="collapse-box">
      <NuxtLink :to="nav.path" :class="[
        route.path.startsWith(nav.path) ? 'text-gray-700 font-bold' : 'text-gray-500 hover:text-gray-700'
      ]">
        <i v-if="nav.page === false" class="bi bi-caret-right mr-2" />
        <i v-else class="bi bi-caret-right-fill mr-2" />
        {{ nav.title }}
      </NuxtLink>
    <div v-if="nav.page === false" class="collapse-children flex flex-col gap-1" :class="{ open: checkExpanded(nav.path) }">
      <NavChild v-for="childNav in nav.children" :key="childNav.path" :nav="childNav" :isSubNav="true" />
    </div>
  </div>
</template>