import React from 'react'

const Loading = ({ isLoading, start }) => {
  if (isLoading)
    return (
      <div className="text-gray-400">
        Thinking... ({(new Date().getTime() - startTime.getTime()) / 1000} s)
      </div>
    )
  return (
    <div className="text-sm text-gray-400">
      Replied in {replyTime.toFixed(2)} s
    </div>
  )
}

export default Loading
