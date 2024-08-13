import { RANDOM_COLORS, RANDOM_FRUITS } from '@/constants'

function getRandomElement(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateUniqueVisitorName() {
  const randomColor = getRandomElement(RANDOM_COLORS)
  const randomFruit = getRandomElement(RANDOM_FRUITS)

  return {
    color: randomColor,
    fruit: randomFruit,
    name: `${randomColor} ${randomFruit}`,
  }
}

export const getNameInitials = (name?: string) => {
  if (!name) return ''

  const rgx = /(\b\w)/g
  const initials = Array.from(name.matchAll(rgx)) || []
  return (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase()
}
