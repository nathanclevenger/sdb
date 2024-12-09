import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './ChatMessage'
import { useChatStore } from '@/lib/chat/store'

export function ChatMessages() {
  const { messages, isStreaming } = useChatStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive or during streaming
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    viewport.scrollTop = viewport.scrollHeight
  }, [messages, isStreaming])

  return (
    <ScrollArea 
      className='flex-1 min-h-0'
      ref={scrollRef}
      viewportRef={viewportRef}
    >
      <div className='flex flex-col h-full'>
        <div className='flex-1' />
        <div className='space-y-4 p-4'>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              isStreaming={isStreaming && message.id === messages[messages.length - 1]?.id}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}