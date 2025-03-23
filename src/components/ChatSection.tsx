import { Chat } from '../utile/types'
import MessageBox from './MessageBox'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function ChatSections({ chats }: {
  chats: Chat[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevChatsLengthRef = useRef<number>(0)

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chats) {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }

      prevChatsLengthRef.current = chats.length
    }
  }, [chats])

  return (
    <div
      ref={scrollRef}
      className="h-[83vh] pb-24 text-white px-6 truncate overflow-x-hidden overflow-y-scroll custom-scrollbar"
    >
      <AnimatePresence>
        {chats?.length > 0 && chats.map((chat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: "easeOut"
            }}
          >
            <MessageBox chat={chat} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ChatSections
