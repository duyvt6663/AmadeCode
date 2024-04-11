import React, { useEffect, useState } from 'react'
import { ProblemDescription } from './problem_description'
import Chat from './chat';

export function LeftPanel(
		{ 
			problem, 
			_solved 
		}: { 
			problem: any; 
			_solved: boolean 
		}
) {
	const [tabID, setTabID] = useState("Description")

	return (
		<div className='bg-dark-layer-1'>
				{/* Description Tab */}
				<div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
					<div
						className='bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer hover:bg-dark-gray-6'
						onClick={() => setTabID("Description")}
					>
						Description
					</div>
					{/* TODO: Add more tabs */}
					{/* Mock Interview Tab */}
					<div
						className='bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer hover:bg-dark-gray-6'
						onClick={() => setTabID("Mock Interview")}
					>
						Assistant
					</div>
				</div>
				
				{/* Tab Content */}
				<div style={{ display: tabID === 'Description' ? 'block' : 'none' }}>
					<ProblemDescription problem={problem} _solved={_solved}/>
				</div>
				<div style={{ display: tabID === 'Mock Interview' ? 'block' : 'none' }}>
					<Chat />
				</div>
		</div>
	)
}