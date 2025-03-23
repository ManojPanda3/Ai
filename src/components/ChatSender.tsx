import React, { useRef, useEffect, useState } from 'react'
import { Chat } from '../utile/types'
import { Mic, Plus, SendHorizontalIcon } from 'lucide-react'
import Ai from '../utile/getai_response';


function ChatSender({ setChats, ai }: { setChats: React.Dispatch<React.SetStateAction<Chat[]>>, ai: Ai | null }) {
  const [message, setMessage] = useState<string>("");
  const [rows, setRows] = useState<number>(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';

    const lineHeight = 24;
    const newRows = Math.min(Math.ceil(textarea.scrollHeight / lineHeight), 5);

    if (message.trim() === '') {
      setRows(1);
      textarea.style.height = `${lineHeight}px`;
    } else {
      setRows(newRows || 1);
      const maxHeight = lineHeight * 5;
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  function handleMessageSend() {
    if (message.trim()) {
      setChats(n => {
        if (n?.length)
          return [...n, {
            content: message, role: "user"
          }]
        else
          return [{
            content: message, role: "user"
          }]
      });
      ai.get_response(message).then((response: string) => {
        setChats((n: Chat[]) => {
          return [...n, {
            content: response,
            role: "assistant"
          }]
        })
      }).catch((error) => { console.error(error) })
      setMessage("");
      setRows(1);
    }
  }

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const prompt: string = e.target.value;
    setMessage(prompt);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend();
    }
  };

  return (
    <section
      className="min-w-[320px] absolute z-0 bottom-0 w-full p-4 pt-0 flex justify-center"
      style={{
        background: "linear-gradient(0deg, rgba(27,23,24,1) 75%, rgba(27,23,24,0.8506876227897839) 100%) "
      }}
    >
      <div className="w-full max-w-[48rem] flex items-center border border-gray-600 p-4 text-white rounded-full custom-scrollbar"
        style={{
          borderRadius: (rows > 1 && "10px")
        }}
      >
        <Plus
          className="cursor-pointer"
          size={22}
        />
        <textarea
          ref={textareaRef}
          placeholder='Ask Gemini'
          value={message}
          className={
            `resize-none bg-transparent placeholder-gray-300
            focus:outline-none focus:ring-none mx-2 flex-grow`
          }
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          rows={rows}
          style={{
            overflow: rows > 4 ? 'auto' : 'hidden',
          }}
        />
        {message.length ?
          <SendHorizontalIcon
            onClick={handleMessageSend}
            className="cursor-pointer"
            size={22}
          /> : <Mic
            size={22}
          />
        }
      </div>
    </section >
  )
}

export default ChatSender
