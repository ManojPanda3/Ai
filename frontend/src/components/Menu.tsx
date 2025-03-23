import { useState } from 'react';
import { cn } from '../utile/cn'
import { ChevronDown, Menu as MenuIcon, PencilLine, Plus } from "lucide-react"
import MenuSidebar from './MenuSidebar';
import ModelSelector from './ModelSelector';

function Menu({ model, setModel, availableModel, className }) {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [isModelSelectorOpen, setModelSelector] = useState<boolean>(false);

  return (
    <>
      {isMenuOpen && (
        <MenuSidebar
          setIsMenuOpen={setMenuOpen}
        />
      )
      }
      {isModelSelectorOpen && (
        <ModelSelector
          models={availableModel}
          setModel={setModel}
          setModelSelector={setModelSelector}
          currentModel={model}
        />
      )
      }

      <section
        className={
          cn([
            "flex text-white items-center py-3 px-1 justify-between p-0 m-0 w-full transform-gpu transition-all relative z-1 overflow-y-hidden",
            className.trim()
          ])
        }
      >
        <div className="flex items-center p-0 m-0 justify-between z-0">
          <span className="p-2 cursor-pointer hover:bg-zinc-700 rounded-full duration-200"
            onClick={() => setMenuOpen((n: boolean) => !n)}
          >
            <MenuIcon color="white" className="h-5 w-5" />
          </span>
          <button
            className="text-left w-auto flex flex-col cursor-pointer hover:bg-gray-800 rounded-lg px-[8px] py-1 duration-300 relative"
            onClick={() => setModelSelector(n => !n)}
          >
            <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Gemini</p>
            <span className="flex gap-1 justify-between items-center text-gray-400 fill-gray-400 text-sm font-semibold">
              {model}
              <ChevronDown className="text-sm h-4 w-4" strokeWidth={3} />
            </span>
          </button>
        </div>
        <div className="flex gap-1 items-center  m-2 ">
          <span className="bg-zinc-700 rounded-full hover:bg-zinc-600 cursor-pointer duration-300 p-1">
            <Plus />
          </span>
        </div>
      </section >
    </>
  )
}

export default Menu;
