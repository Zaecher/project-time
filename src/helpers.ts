import { add, intervalToDuration, startOfDay } from "date-fns"
import { Timestamp, Workday } from "./model"
import { useLocalStorage } from "@vueuse/core"

const rounded = useLocalStorage("rounded", false)
const workHoursPerDay = useLocalStorage("workHoursPerDay", 0)

export function roundDate(date: Date) {
  const timestamp = new Date(date)
  if (rounded.value) {
    timestamp.setMinutes(Math.round(timestamp.getMinutes() / 15) * 15)
  }
  timestamp.setSeconds(0, 0)
  return timestamp
}

export function round(value: number, decimals: number = 2) {
  const factor = 10 * decimals
  return Math.round(value * factor) / factor
}

export function getDuration(start: Date, end: Date) {
  if (!start || !end) {
    return undefined
  }
  const duration = intervalToDuration({
    start: start,
    end: end,
  })
  return round((duration.hours ?? 0) + (duration.minutes ?? 0) / 60, 2)
}

export function createWorkday(timestamps: Timestamp[]) {
  for (const [i, ts] of timestamps.entries()) {
    if (i > 0) {
      const previous = timestamps[i - 1]
      previous.duration = getDuration(previous.timestamp, ts.timestamp)
      ts.isLast = i === timestamps.length - 1
    }
  }
  const totalHours =
    timestamps.length > 1
      ? (getDuration(
          timestamps[0].timestamp,
          timestamps[timestamps.length - 1].timestamp,
        ) ?? 0)
      : 0
  return <Workday>{
    date: startOfDay(timestamps[0].timestamp),
    timestamps,
    totalHours,
    balance: round(totalHours - workHoursPerDay.value),
    projectTimes: [],
  }
}

export function parseWorkdayNew(timestamps: Timestamp[]) {
  const workday = <Workday>{}
  const roundedTimestamps = []
  for (const [i, timestamp] of timestamps.entries()) {
    roundedTimestamps.push({
      timestamp: timestamp.timestamp,
      roundedTimestamp: roundDate(timestamp.timestamp),
      project: timestamp.project,
      description: timestamp.description,
      duration: this.getDuration(
        roundDate(timestamp.timestamp),
        roundDate(dayEntries[i + 1]?.timestamp ?? timestamp.timestamp),
      ),
      isBreak: this.isBreak(timestamp),
      isProjectMissing:
        timestamp.project === "None" && i !== dayEntries.length - 1,
    })
  }
  const workSegments = []
  const projectTimes = new Map()
  for (const [i, entry] of roundedTimestamps.entries()) {
    const m = projectTimes.get(entry.project)
    if (!m) {
      projectTimes.set(entry.project, {
        duration: entry.duration,
        descriptions: [entry.description],
      })
    } else {
      m.duration += entry.duration
      m.descriptions.push(entry.description)
    }
    if (workSegments.length === 0) {
      workSegments.push({
        start: entry.roundedTimestamp,
        end: undefined,
        break: this.isBreak(entry),
        icon: this.getIcon(entry),
      })
    } else {
      const segment = workSegments[workSegments.length - 1]
      if (
        segment.break !== this.isBreak(entry) ||
        (segment.break && entry.project !== roundedTimestamps[i - 1].project)
      ) {
        segment.end = entry.roundedTimestamp
        workSegments.push({
          start: entry.roundedTimestamp,
          end: undefined,
          break: this.isBreak(entry),
          icon: this.getIcon(entry),
        })
      } else if (
        entry.project === "None" &&
        i === roundedTimestamps.length - 1
      ) {
        const segment = workSegments[workSegments.length - 1]
        segment.end = entry.roundedTimestamp
      }
    }
  }
  const allProjectTimes = Array.from(projectTimes.entries())
  this.calculatedDays.push({
    date,
    timestamps: roundedTimestamps,
    workSegments,
    totalTime: roundedTimestamps
      .filter((e) => !this.isBreak(e))
      .reduce((s, e) => {
        return s + e.duration
      }, 0),
    projectTimes: allProjectTimes
      .filter(
        ([project, _]) =>
          !internalProjects.map((i) => i.name).includes(project),
      )
      .sort(([a, _a], [b, _b]) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      )
      .map(([project, entry]) => ({
        project,
        duration: entry.duration,
        description: entry.descriptions.filter((d) => d).join("; "),
      })),
  })
}

export function toDays(timestamps: Timestamp[]) {
  const days = new Map<string, Timestamp[]>()
  for (const ts of timestamps) {
    const date = ts.timestamp.toISOString().substring(0, 10)
    const day = days.get(date)
    if (!day) {
      days.set(date, [ts])
    } else {
      day.push(ts)
    }
  }
  return days
}

export function getStartOfWeek() {
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
  startOfWeek.setHours(0)
  startOfWeek.setMinutes(0)
  startOfWeek.setSeconds(0, 0)
  return startOfWeek
}

export function getStartOfMonth() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export function getDays(from: Date, to?: Date) {
  const end = to ?? new Date()
  const temp = new Date(from.getTime())
  temp.setHours(0)
  temp.setMinutes(0)
  temp.setSeconds(0, 0)
  const days = [temp]
  while (temp < end) {
    add(temp, { days: 1 })
    days.push(temp)
  }
}
