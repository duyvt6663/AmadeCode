'use client'

import Split from 'react-split'
import { ProblemDescription } from '@/app/components/workspace/left_panel/problem_description'
import { LeftPanel } from '@/app/components/workspace/left_panel/left_panel'
import { Playground } from '@/app/components/workspace/right_panel/playground'
import ReactConfetti from 'react-confetti'
import useWindowSize from '@/app/hooks/useWindowSize'
import { useState } from 'react'

export function Workspace({ problem }: { problem: any }) {
  const { width, height } = useWindowSize()
  const [success, setSucess] = useState(false)
  const [solved, setSolved] = useState(false)

  return (
    <Split className='split' minSize={0} direction='horizontal'>
      <LeftPanel problem={problem} _solved={solved} />
      <div className='bg-dark-fill-2'>
        <Playground
          problem={problem}
          setSuccess={setSucess}
          setSolved={setSolved}
        />
        {success && (
          <ReactConfetti
            gravity={0.3}
            tweenDuration={4000}
            width={width - 1}
            height={height - 1}
          />
        )}
      </div>
    </Split>
  )
}
