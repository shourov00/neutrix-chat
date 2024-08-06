import React, { useState } from 'react'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'

const AwayFromForm = () => {
  return (
    <>
      <Input
        className={
          'mt-2 bg-secondary border-none shadow hover:shadow-lg transition-all placeholder:font-semibold'
        }
        type="text"
        placeholder={'Your first name'}
      />

      <Input
        className={
          'bg-secondary border-none shadow hover:shadow-lg transition-all placeholder:font-semibold'
        }
        type="email"
        placeholder={'Your email (if we get disconnected)'}
      />

      <Textarea
        rows={6}
        className={
          'resize-none bg-secondary border-none shadow hover:shadow-lg transition-all placeholder:font-semibold'
        }
        placeholder={'Question/Comment'}
      />
    </>
  )
}

export default AwayFromForm
