<script setup lang="ts">
import { useProjectTimeStore } from "../store"

const { workWeeks } = await useProjectTimeStore()

const page = ref(1)
const currentWeek = computed(() => workWeeks.value[page.value - 1])
</script>

<template>
  <div class="flex flex-row h-full pt-5 gap-5">
    <div class="flex flex-col gap-5 pl-20">
      <ProjectList />
      <WeekStatistics
        v-if="currentWeek"
        :week="currentWeek"
      />
    </div>
    <div class="flex flex-col h-full w-full">
      <div class="flex flex-col gap-5 grow h-full overflow-y-auto pl-5 pr-20">
        <WorkDay
          :key="day.date.getTime()"
          :day="day"
          v-for="day in currentWeek.days"
          v-if="currentWeek"
        />
      </div>
      <UPagination
        v-model:page="page"
        :items-per-page="1"
        :total="workWeeks.length"
        class="w-full flex-0 pr-20 py-5"
        :ui="{
          list: 'justify-center',
          item: 'cursor-pointer',
          first: 'cursor-pointer',
          last: 'cursor-pointer',
          prev: 'cursor-pointer',
          next: 'cursor-pointer',
        }"
      />
    </div>
  </div>
</template>
