import { addDays, isAfter, parseISO } from 'date-fns'

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
