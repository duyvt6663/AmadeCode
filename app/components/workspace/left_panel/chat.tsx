import { useChat } from 'ai/react'
import { useEffect, useRef, useState } from 'react'

import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'

import { SendHorizontalIcon, Zap, MicIcon, MicOffIcon } from 'lucide-react'
// import { useClerk, useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import Microphone from './microphone'


export default function Chat () {
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)

  // const { isLoaded, isSignedIn, user } = useUser()
  // const { openSignIn, session } = useClerk()

  const ref = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      initialMessages: [
        {
          id: Date.now().toString(),
          role: 'system',
          content: 'You are an assistant that gives short answers.'
        }
      ],
      onResponse: response => {
        if (!response.ok) {
          const status = response.status

          switch (status) {
            case 401:
              // openSignIn()
              toast.error('Please sign in to continue', {
                action: {
                  label: 'Sign in',
                  onClick: () => console.log('Sign in')
                }
              })
              break
            case 402:
              toast.error('You have no credits left.', {
                action: {
                  label: 'Get more',
                  onClick: () => setSubscriptionDialogOpen(true)
                }
              })
              break
            default:
              toast.error(error?.message || 'Something went wrong!')
              break
          }
        }
        // session?.reload()
      }
    })

  useEffect(() => {
    if (ref.current === null) return
    ref.current.scrollTo(0, ref.current.scrollHeight)
  }, [messages])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    handleSubmit(e)
  }
  
  return (
    <div className='mx-auto mt-3 w-full max-w-lg'>
        <ScrollArea
            className='mb-2 h-[450px] rounded-md border p-2'
            ref={ref}
        >
        {messages.map(m => (
            <div key={m.id} className='mr-6 whitespace-pre-wrap md:mr-12'>
            {m.role === 'user' && (
                <div className='mb-6 flex gap-3'>
                <Avatar>
                    <AvatarImage src='' />
                    <AvatarFallback className='text-sm'>U</AvatarFallback>
                </Avatar>
                <div className='mt-1.5'>
                    <p className='font-semibold text-green-400'>Duy</p>
                    <div className='mt-1.5 text-sm text-zinc-300'>
                    {m.content}
                    </div>
                </div>
                </div>
            )}

            {m.role === 'assistant' && (
                <div className='mb-6 flex gap-3'>
                  <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback className='bg-emerald-500 text-white'>
                      AI
                      </AvatarFallback>
                  </Avatar>
                  <div className='mt-1.5 w-full'>
                      {/* <div className='flex justify-between'>
                        <p className='font-semibold'>Bot</p>
                        <CopyToClipboard message={m} className='-mt-1' />
                      </div> */}
                      <div className='mt-2 text-sm text-zinc-300'>
                        {m.content}
                      </div>
                  </div>
                </div>
            )}
            </div>
        ))}
        </ScrollArea>

        <form onSubmit={onSubmit} className='relative'>
            <Input
                name='message'
                value={input}
                onChange={handleInputChange}
                placeholder={
                'Ask me anything...'
                }
                className='pr-12 placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500'
            />
              
            {/* Mic button */}
            <Microphone />  

            {/* Submit button */}
            <Button
                size='icon'
                type='submit'
                variant='secondary'
                disabled={false}
                className='absolute right-1 top-1 h-8 w-10'
            >
                <SendHorizontalIcon className='h-5 w-5 text-emerald-500' />
            </Button>
        </form>
    </div>
  )
}
