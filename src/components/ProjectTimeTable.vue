<script setup lang="ts">
import { TableColumn } from "@nuxt/ui"
import { SystemProjects, Timestamp, Workday } from "../model"
import { useProjectTimeStore } from "../store"
const UButton = resolveComponent("UButton")
const UIcon = resolveComponent("UIcon")

const { day } = defineProps<{
  day: Workday
}>()

const { deleteTimestamp } = await useProjectTimeStore()

const columns: TableColumn<Timestamp>[] = [
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => {
      return new Date(row.getValue("timestamp")).toISOString().substring(11, 16)
    },
    meta: {
      class: {
        td: "w-20 text-center",
      },
    },
  },
  {
    header: "Duration",
    meta: {
      class: {
        td: "w-20 text-center",
      },
    },
  },
  {
    accessorKey: "project",
    header: "Project",
    meta: {
      class: {
        td: "w-120",
      },
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    meta: {
      class: {
        td: "text-right",
      },
    },
    cell: ({ row }) => {
      return h(UButton, {
        icon: "fa7-solid:trash",
        color: "error",
        variant: "ghost",
        class: "cursor-pointer p-1",
        onClick: async () => await deleteRow(row.original),
      })
    },
  },
]

const meta = {
  class: {
    tr: (row: any) => {
      for (const project of SystemProjects) {
        if (row.original.project === project.name) {
          return project.rowColor
        }
      }
      return ""
    },
  },
}

async function deleteRow(timestamp: Timestamp) {
  await deleteTimestamp(timestamp.timestamp)
}
</script>

<template>
  <UTable
    :data="day.timestamps"
    :columns="columns"
    :ui="{ td: 'p-1.5', th: 'py-1' }"
    :meta="meta"
  >
  </UTable>
</template>
