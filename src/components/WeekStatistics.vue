<script setup lang="ts">
import { round } from "../helpers"
import { WorkWeek } from "../model"

const { week } = defineProps<{
  week: WorkWeek
}>()

const ui = {
  root: "flex-none shadow-lg w-64",
  header: `flex flex-row bg-green-600 font-bold text-white sm:px-2 px-2 sm:py-1 py-1 items-center h-10 gap-2 justify-between`,
  body: "flex flex-col flex-nowrap gap-1 sm:p-0 p-0 sm:py-1 py-1 overflow-x-auto",
  footer: `flex flex-row bg-gray-200 font-bold text-white sm:px-2 px-2 sm:py-1 py-1 items-center justify-between`,
}

const duration = computed(() =>
  round(
    week.days.reduce((total, d) => {
      total += d.totalHours
      return total
    }, 0),
  ),
)
</script>

<template>
  <UCard
    variant="subtle"
    :ui="ui"
  >
    <template #header>
      <IconLabel
        icon="fa7-solid:calendar-week"
        label="Week"
      />
      <IconLabel
        icon="fa7-solid:hourglass-half"
        :label="`${duration}h`"
      />
    </template>
  </UCard>
</template>
