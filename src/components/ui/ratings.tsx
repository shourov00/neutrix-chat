import React, { MouseEventHandler } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  selected: boolean
  onClick: MouseEventHandler<SVGSVGElement>
  onMouseEnter: MouseEventHandler<SVGSVGElement>
  onMouseLeave: MouseEventHandler<SVGSVGElement>
}

const RatingStar = ({
  onClick,
  onMouseEnter,
  onMouseLeave,
  selected,
}: RatingProps) => {
  return (
    <Star
      className={cn(
        'w-8 h-8 hover:fill-[#ec9f1c] cursor-pointer',
        selected && 'fill-[#ec9f1c]',
      )}
      strokeWidth={1.25}
      color={'#ec9f1c'}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
}

interface Props {
  rating?: number
  onRatingStarChange: (star: number) => void
}

const Ratings = ({ rating = 0, onRatingStarChange }: Props) => {
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null)

  const handleMouseEnter = (star: number) => {
    setHoveredRating(star)
  }

  const handleMouseLeave = () => {
    setHoveredRating(null)
  }

  return (
    <div className={'grid grid-cols-5 gap-1 w-full'}>
      {[1, 2, 3, 4, 5].map((star) => (
        <RatingStar
          key={star}
          onClick={() => onRatingStarChange(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          selected={star <= (hoveredRating ?? rating)}
        />
      ))}
    </div>
  )
}

export default Ratings
