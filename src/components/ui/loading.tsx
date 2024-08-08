import React from 'react'
import { cn } from '@/lib/utils'
import { RotateCw } from 'lucide-react'

const Loading = ({ className }: { className?: string }) => {
  return <RotateCw className={cn('mr-2 h-4 w-4 animate-spin', className)} />
}

export default Loading
