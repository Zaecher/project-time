<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core"
import { SystemProjects } from "../model"

const { project } = defineProps<{
  project: string
}>()

const projects = useLocalStorage<string[]>("projects", [])
const currentProject = ref(project)

const projectOptions = ref([
  ...SystemProjects.map((p) => ({
    label: p.name,
    value: p.name,
    icon: p.icon,
    class: p.textColor,
  })),
  ...projects.value.map((p) => ({
    label: p,
    value: p,
    icon: "fa7-solid:briefcase",
  })),
])

const icon = computed(
  () =>
    projectOptions.value.find((item) => item.value === currentProject.value)
      ?.icon,
)
</script>

<template>
  <USelect
    v-model="currentProject"
    :items="projectOptions"
    value-key="value"
    :icon="icon"
    variant="ghost"
    class="w-full"
  />
</template>
