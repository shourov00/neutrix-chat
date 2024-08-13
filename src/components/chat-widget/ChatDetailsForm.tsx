import React from 'react'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { SendHorizonal } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/src/components/ui/form'
import { AwayMessage, ChatMessage, Messaging } from '@/models/chatModels'
import { useAddChatRoom } from '@/hooks/useAddChatRoom'

const formSchema = z.object({
  name: z.string().min(2, 'Name is required.').max(255),
  email: z.string().email({ message: 'Invalid email address' }),
  content: z.string().min(1, 'Question/Comment is required.'),
})

interface Props {
  onSendMessage: (message: ChatMessage) => void
  type: 'away' | 'pre-qualification'
  messageForm?: Messaging | AwayMessage
  setShowThanks?: (value: boolean) => void
}

const ChatDetailsForm = ({
  onSendMessage,
  type,
  messageForm,
  setShowThanks,
}: Props) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      content: '',
    },
  })

  const { mutate: mutateNewChatRoom } = useAddChatRoom({ onSendMessage })

  const onSubmit = (values: any) => {
    if (type === 'away') {
      setShowThanks && setShowThanks(true)
      // todo -> send the away message to account owner email
    } else {
      mutateNewChatRoom(values)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col h-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className={
                    'mt-2 bg-secondary border-none shadow hover:shadow-lg transition-all placeholder:font-semibold'
                  }
                  placeholder={messageForm?.preQualification?.nameLabel}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className={
                    'bg-secondary border-none shadow hover:shadow-lg transition-all placeholder:font-semibold'
                  }
                  placeholder={messageForm?.preQualification?.contactLabel}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  rows={6}
                  className={
                    'resize-none bg-secondary border-none shadow hover:shadow-lg transition-all placeholder:font-semibold'
                  }
                  placeholder={messageForm?.preQualification?.questionLabel}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className={'font-bold py-6 w-fit ms-auto'}>
          <SendHorizonal className={'w-5 h-5 mr-2'} />
          {messageForm?.buttonLabel}
        </Button>
      </form>
    </Form>
  )
}

export default ChatDetailsForm
