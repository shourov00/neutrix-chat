import {
  addDays,
  addHours,
  format,
  isAfter,
  isWithinInterval,
  parse,
  parseISO,
  startOfDay,
} from 'date-fns'
import { ChatAwayAdvance } from '@/models/chatModels'

export const checkIfDurationExceeded = (
  startAt: string,
  durationDays: number,
): boolean => {
  if (durationDays === 0) return true

  const startDate = parseISO(startAt)
  const endDate = addDays(startDate, durationDays)
  const currentDate = new Date()
  return isAfter(currentDate, endDate)
}

const formatTime = (hour: number): string => {
  return format(parse(`${hour}:00`, 'H:mm', new Date()), 'ha')
}

const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export const getOfficeHours = (chatAwayAdvance: ChatAwayAdvance) => {
  const today = daysOfWeek[
    new Date().getDay()
  ] as keyof ChatAwayAdvance['officeHours']

  const officeHours = chatAwayAdvance?.officeHours?.[today]

  if (officeHours && officeHours.active) {
    const minTime = formatTime(officeHours.min)
    const maxTime = formatTime(officeHours.max)

    return `${minTime} - ${maxTime}`
  } else {
    return null
  }
}

export const showChatAwayForm = (chatAwayAdvance: ChatAwayAdvance) => {
  const today = daysOfWeek[
    new Date().getDay()
  ] as keyof ChatAwayAdvance['officeHours']

  const officeHours = chatAwayAdvance?.officeHours?.[today]

  const minTimeDate = addHours(startOfDay(new Date()), officeHours?.min)
  const maxTimeDate = addHours(startOfDay(new Date()), officeHours?.max)

  return !(
    officeHours?.active &&
    isWithinInterval(new Date(), { start: minTimeDate, end: maxTimeDate })
  )
}
