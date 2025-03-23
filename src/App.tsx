import { useEffect, useState } from 'react'
import Menu from './components/Menu';
import ChatSections from './components/ChatSection';
import ChatSender from './components/ChatSender';
import { Chat } from './utile/types';

import "./index.css"
import Ai from './utile/getai_response';


export const modelTable = {
  "2.0 Flash": "gemini-2.0-flash",
  "1.5 Flash": "gemini-1.5-flash"
};
const ai = new Ai("deepseek-r1");

function App() {
  const [chats, setChats] = useState<Chat[]>();
  const [model, setModel] = useState<string>("2.0 Flash");

  return (
    <main className="min-w-[310px] w-full h-screen overflow-hidden bg-zinc-900">
      <Menu
        className=""
        model={model}
        setModel={setModel}
        availableModel={Object.keys(modelTable)}
      />
      <ChatSections
        chats={chats}
      />
      <ChatSender
        setChats={setChats}
        ai={ai}
      />
    </main>
  )
}

export default App



