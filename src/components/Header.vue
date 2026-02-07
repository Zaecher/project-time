<script setup lang="ts">
import { NavigationMenuItem } from "@nuxt/ui"
import { useLocalStorage } from "@vueuse/core"

const workHoursPerDay = useLocalStorage("workHoursPerDay", 0)
const overtimeBaseline = useLocalStorage("overtimeBaseline", 0)
const onlyShowCurrentWeek = useLocalStorage("onlyShowCurrentWeek", false)
const rounded = useLocalStorage("rounded", false)
const showRecommendedTimestamps = useLocalStorage(
  "showRecommendedTimestamps",
  false,
)

const items = ref<NavigationMenuItem[]>([
  {
    label: "Track Time",
    icon: "fa7-solid:stopwatch",
    to: "/",
    class: "px-5",
  },
  {
    label: "Statistics",
    icon: "fa7-solid:chart-line",
    to: "/statistics/",
    class: "px-5",
  },
])

const overtime = computed(() => overtimeBaseline.value)
const open = ref(workHoursPerDay.value === 0)
</script>
<template>
  <UHeader
    title="Project Time Tracker"
    :ui="{ title: 'items-center' }"
  >
    <template #title>
      <h1 class="text-nowrap">Project Time Tracker</h1>
      <UNavigationMenu
        color="neutral"
        :items="items"
      />
    </template>
    <template #right>
      <OvertimeBalance
        :balance="overtime"
        v-if="workHoursPerDay !== 0"
      />
      <span class="w-5" />
      <UPopover
        arrow
        modal
        portal
        v-model:open="open"
      >
        <UButton
          icon="fa7-solid:gear"
          label="Configuration"
          variant="subtle"
          color="neutral"
          class="cursor-pointer"
        />
        <template #content>
          <div class="flex flex-col w-65 py-5 gap-3">
            <USwitch
              v-model="rounded"
              label="15 min resolution"
              color="success"
              class="px-5"
            />
            <USwitch
              v-model="showRecommendedTimestamps"
              label="Recommend timestamps"
              color="success"
              class="px-5"
            />
            <USwitch
              v-model="onlyShowCurrentWeek"
              label="Only show current week"
              color="success"
              class="px-5"
            />
            <USeparator />
            <div
              class="flex items-center gap-2 justify-between px-5 py-1"
              :class="{ 'bg-red-400': workHoursPerDay === 0 }"
            >
              <UIcon name="fa7-solid:business-time" />
              <UFormField
                label="Work hours per day"
                orientation="horizontal"
                class="w-full"
              >
                <UInput
                  v-model:model-value="workHoursPerDay"
                  placeholder="8"
                  class="w-12"
                />
              </UFormField>
            </div>
            <div class="flex items-center gap-2 justify-between px-5 py-1">
              <UIcon name="fa7-solid:piggy-bank" />
              <UFormField
                label="Overtime baseline"
                orientation="horizontal"
                class="w-full"
              >
                <UInput
                  v-model:model-value="overtimeBaseline"
                  placeholder="0"
                  class="w-12"
                />
              </UFormField>
            </div>
            <USeparator />
            <UButton icon="fa7-solid:trash" color="error" label="Delete data older than 14 days" class="mx-2 cursor-pointer" />
          </div>
        </template>
      </UPopover>
      <UButton
        label="View on GitHub"
        to="https://github.com/fabianmp/project-time"
        target="_blank"
        icon="fa7-brands:github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
      <UColorModeButton
        title="Swich color mode"
        class="cursor-pointer"
      />
    </template>
  </UHeader>
</template>
