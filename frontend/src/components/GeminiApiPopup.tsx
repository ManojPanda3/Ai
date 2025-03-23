import { X } from "lucide-react";
import { useEffect, useState } from "react"

export const GEMINI_API_STORAGE_KEY = "GEMINI_API"
const GeminiApiPopup = ({ setGeminiApi, setIsGeminiApiPopupOpen, geminiApi }) => {
  const [geminiApiInput, setGeminiApiInput] = useState(geminiApi);
  function handleApiKey(e) {
    if (e.key !== "Enter") return;
    setGeminiApi(e.target.value)
    localStorage.setItem(GEMINI_API_STORAGE_KEY, e.target.value);
    e.target.value = ""
  }

  return (
    <div className="absolute top-0 left-0 z-1 w-full h-screen bg-[rgba(20,20,20,0.4)]">
      <div className="h-1/2 w-1/2 max-w-[500px] max-h-[500px] bg-zinc-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl flex justify-center items-center">
        <X
          className="absolute top-2 right-2 cursor-pointer text-zinc-200 hover:text-red-600 hover:bg-zinc-700 rounded-full transform-gpu transition-all p-1"
          size={24}
          onClick={() => setIsGeminiApiPopupOpen(false)}
        />
        <div className="flex flex-col justify-center items-center text-white">
          <label htmlFor="gemini-api" >
            Enter Your Gemini Api
          </label>
          <input
            name="gemini-api"
            type="text"
            max={39}
            onKeyDown={handleApiKey}
            className="p-2 rounded-full"
            style={{ outline: "2px solid" }}
            value={geminiApiInput}
            onChange={n => setGeminiApiInput(n.target.value)}
          />
        </div>
      </div>
    </div >
  )
}

export default GeminiApiPopup
