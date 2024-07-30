import React from 'react'
import { Star } from 'lucide-react'

const RatingStar = () => {
  return <Star className={'w-8 h-8 hover:fill-[#ec9f1c] cursor-pointer'} strokeWidth={1.25} color={'#ec9f1c'}/>
}

const Ratings = () => {
  return (
    <div className={'grid grid-cols-5 gap-1 w-full'}>
      <RatingStar />
      <RatingStar />
      <RatingStar />
      <RatingStar />
      <RatingStar />
    </div>
  )
}

export default Ratings
