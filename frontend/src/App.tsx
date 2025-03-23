import { useEffect, useState } from 'react'
import Menu from './components/Menu';
import ChatSections from './components/ChatSection';
import ChatSender from './components/ChatSender';
import { Chat } from './utile/types';

import "./index.css"
import Ai from './utile/getai_response';

const model = [

  "gpt-3.5-turbo",
  "gpt-4",
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4o-audio",
  "o1",
  "o1-mini",
  "o3-mini",
  "GigaChat:latest",
  "meta-ai",
  "llama-2-7b",
  "llama-3-8b",
  "llama-3-70b",
  "llama-3.1-8b",
  "llama-3.1-70b",
  "llama-3.1-405b",
  "llama-3",
  "llama-3.2-1b",
  "llama-3.2-3b",
  "llama-3.2-11b",
  "llama-3.2-90b",
  "llama-3.3-70b",
  "mixtral-8x7b",
  "mixtral-8x22b",
  "mistral-nemo",
  "mixtral-small-24b",
  "hermes-3",
  "phi-3.5-mini",
  "phi-4",
  "wizardlm-2-7b",
  "wizardlm-2-8x22b",
  "gemini-2.0",
  "gemini-exp",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-thinking",
  "gemini-2.0-pro",
  "claude-3-haiku",
  "claude-3-sonnet",
  "claude-3-opus",
  "claude-3.5-sonnet",
  "claude-3.7-sonnet",
  "claude-3.7-sonnet-thinking",
  "reka-core",
  "blackboxai",
  "command-r",
  "command-r-plus",
  "command-r7b",
  "command-a",
  "qwen-1.5-7b",
  "qwen-2-72b",
  "qwen-2-vl-7b",
  "qwen-2.5",
  "qwen-2.5-72b",
  "qwen-2.5-coder-32b",
  "qwen-2.5-1m",
  "qwen-2-5-max",
  "qwq-32b",
  "qvq-72b",
  "pi",
  "deepseek-chat",
  "deepseek-v3",
  "deepseek-r1",
  "grok-3",
  "grok-3-r1",
  "sonar-pro",
  "sonar-reasoning",
  "sonar-reasoning-pro",
  "r1-1776",
  "nemotron-70b",
  "dbrx-instruct",
  "glm-4",
  "MiniMax",
  "yi-34b",
  "dolphin-2.6",
  "dolphin-2.9",
  "airoboros-70b",
  "lzlv-70b",
  "minicpm-2.5",
  "tulu-3-405b",
  "olmo-2-13b",
  "tulu-3-1-8b",
  "tulu-3-70b",
  "olmoe-0125",
  "lfm-40b",
  "evil",
  "sdxl-turbo",
  "sd-3.5",
  "flux",
  "flux-pro",
  "flux-dev",
  "flux-schnell",
  "dall-e-3",
  "midjourney"]
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



