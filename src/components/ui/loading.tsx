import React from 'react'
import { cn } from '@/lib/utils'
import { RotateCw } from 'lucide-react'

const Loading = ({ className }: { className?: string }) => {
  return (
    <RotateCw
      className={cn(
        'neutrix-mr-2 neutrix-h-4 neutrix-w-4 neutrix-animate-spin',
        className,
      )}
    />
  )
}

export default Loading
