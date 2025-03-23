import { CircleCheck } from 'lucide-react';
import React, { useRef } from 'react'

const ModelSelector = ({ currentModel, models, setModel, setModelSelector }) => {
  const selectorRef = useRef<HTMLDivElement | null>(null)

  function closeModelSelector() {
    if (!selectorRef) return;
    selectorRef.current.classList.remove('animate-bounceUp');
    selectorRef.current.classList.add('animate-bounceDown');
    setTimeout(() => {
      setModelSelector(false);
    }, 300);
  }
  function handleClose(e: any) {
    const child = e.target.children[0];
    if (!child || child !== selectorRef.current) return;
    closeModelSelector();
  }
  return (
    <section className='h-screen w-full bg-[rgba(20,20,20,0.4)] z-2 absolute bottom-0 left-0 flex justify-center items-end'
      onMouseDown={handleClose}
    >
      <div
        ref={selectorRef}
        className="max-w-[720px]  w-full  max-h-[600px] float-botom bg-white animate-bounceUp rounded-t-2xl bg-zinc-800 text-white overflow-hidden"
      >
        <div className="w-full full flex flex-col items-center justify-end my-8">
          {models?.length && models.map((model, index) => {
            return (<div key={model + index} className="p-2 hover:bg-zinc-700 w-8/10 rounded-md cursor-pointer flex justify-between " onClick={() => {
              setModel(model)
              closeModelSelector();
            }}>
              {model} {model === currentModel && <CircleCheck className="text-green-400" />}
            </div>)
          })}
        </div>
      </div>
    </section>
  )
}

export default ModelSelector
