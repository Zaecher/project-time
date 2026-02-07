import { createGlobalState, useLocalStorage } from "@vueuse/core"
import { openDB, DBSchema } from "idb"
import { Timestamp, Workday, WorkWeek } from "./model"
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfWeek,
  isWeekend,
  WeekOptions,
} from "date-fns"
import { createWorkday, roundDate } from "./helpers"

const WEEK_OPTIONS = <WeekOptions>{ weekStartsOn: 1 }
const workHoursPerDay = useLocalStorage("workHoursPerDay", 0)

interface ProjectTimeSchema extends DBSchema {
  data: {
    key: Date
    value: Timestamp
  }
}

export const useProjectTimeStore = createGlobalState(async () => {
  const db = await openDB<ProjectTimeSchema>("project-time", 1, {
    upgrade(db, _oldVersion, _newVersion, _transaction, _event) {
      db.createObjectStore("data", { keyPath: "timestamp" })
    },
  })

  const today = endOfDay(new Date())
  const currentProject = ref<string>("None")
  const workWeeks = ref<WorkWeek[]>([])

  function getTimestamps(
    allTimestamps: Timestamp[],
    minDate?: Date,
    maxDate?: Date,
  ) {
    if (minDate && maxDate) {
      return allTimestamps.filter(
        (t) => t.timestamp > minDate && t.timestamp < maxDate,
      )
    } else if (minDate) {
      return allTimestamps.filter((t) => t.timestamp > minDate)
    } else {
      return allTimestamps
    }
  }

  async function addTimestamp(
    date: Date,
    project: string,
    description?: string,
  ) {
    await db.add("data", <Timestamp>{
      timestamp: roundDate(date),
      project,
      description,
    })
    await loadTimestamps()
  }

  async function deleteTimestamp(timestamp: Date) {
    await db.delete("data", timestamp)
    await loadTimestamps()
  }

  async function loadTimestamps() {
    const allTimestamps = await db.getAll("data")
    allTimestamps.forEach((t) => {
      t.timestamp = roundDate(t.timestamp)
    })

    const weeks = computed(() =>
      eachWeekOfInterval(
        { start: allTimestamps[0].timestamp, end: today },
        WEEK_OPTIONS,
      ),
    )

    function parseWorkday(day: Date) {
      const timestamps = getTimestamps(allTimestamps, day, endOfDay(day))
      if (timestamps.length === 0) {
        return <Workday>{
          date: day,
          timestamps,
          totalHours: 0,
          balance: 0 - workHoursPerDay.value,
          projectTimes: [],
        }
      }
      return createWorkday(timestamps)
    }

    workWeeks.value = weeks.value
      .map((w) => {
        let end = endOfWeek(w, WEEK_OPTIONS)
        let lastDay = end > today ? today : end
        const weekDays = eachDayOfInterval({
          start: w,
          end: lastDay,
        })
          .map(parseWorkday)
          .filter((w) => w.timestamps.length > 0 || !isWeekend(w.date))
        return <WorkWeek>{
          firstDay: w,
          days: weekDays.reverse(),
        }
      })
      .reverse()
  }
  await loadTimestamps()

  return {
    currentProject,
    workWeeks,
    addTimestamp,
    deleteTimestamp,
  }
})
