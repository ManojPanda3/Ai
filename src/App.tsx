import { useState } from 'react'

function App() {
  const [chats, setChats] = useState<string[]>([]);
  return (
    <main>
      <Menu />
      <section>
        <ChatSection
          chats={chats}
        />
        <ChatSender
          setChats
        />
      </section>
    </main>
  )
}

export default App
