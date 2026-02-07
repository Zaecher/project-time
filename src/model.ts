export interface Timestamp {
  timestamp: Date
  project: string
  description?: string
  duration?: number
  isBreak?: boolean
  isLast?: boolean
}

export interface WorkSegment {
  start: Date
  end?: Date
  break: boolean
  icon: string
}

export interface ProjectTime {
  duration: number
  project: string
  description?: string
}

export interface Workday {
  date: Date
  totalHours: number
  balance: number
  timestamps: Timestamp[]
  projectTimes: ProjectTime[]
}

export interface WorkWeek {
  firstDay: Date
  days: Workday[]
}

type Color =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "neutral"

interface ProjectProps {
  name: string
  icon: string
  color: Color
  rowColor: string
  textColor: string
}

export const SystemProjects: ProjectProps[] = [
  {
    name: "None",
    icon: "fa7-solid:stop",
    color: "error",
    rowColor: "bg-red-300",
    textColor: "text-red-600",
  },
  {
    name: "Out-of-Office",
    icon: "fa7-solid:calendar-times",
    color: "neutral",
    rowColor: "bg-gray-300",
    textColor: "text-gray-600",
  },
  {
    name: "Lunch",
    icon: "fa7-solid:utensils",
    color: "success",
    rowColor: "bg-green-300",
    textColor: "text-green-600",
  },
  {
    name: "Break",
    icon: "fa7-solid:coffee",
    color: "success",
    rowColor: "bg-green-300",
    textColor: "text-green-600",
  },
]
