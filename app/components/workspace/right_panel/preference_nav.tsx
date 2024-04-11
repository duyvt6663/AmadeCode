import React, { useEffect, useState } from 'react'
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSetting,
} from 'react-icons/ai'
import { ISettings } from '@/app/components/workspace/right_panel/playground'
import { Settings } from '@/app/components/modals/settings'
import { LanguageSelector } from './language_selector'

export function PreferenceNav({
  settings,
  setSettings,
}: {
  settings: ISettings
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>
}) {
  const [isFullScreen, setFullScreen] = useState(false)
  const [language, setLanguage] = useState('javascript')

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
  }

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }

  useEffect(() => {
    function exitHandler(e: any) {
      if (!document.fullscreenElement) {
        setFullScreen(false)
        return
      }
      setFullScreen(true)
    }

    if (document.addEventListener) {
      document.addEventListener('fullscreenchange', exitHandler)
      document.addEventListener('webkitfullscreenchange', exitHandler)
      document.addEventListener('mozfullscreenchange', exitHandler)
      document.addEventListener('MSFullscreenChange', exitHandler)
    }
  }, [isFullScreen])

  return (
    <div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full z-50'>
      <div className='flex flex-col justify-end items-center text-white h-full'>
        <div className='text-xs text-label-2 dark:text-dark-label-2'>
          {/* JavaScript */}
          <LanguageSelector language={language} onSelect={handleLanguageChange} />
        </div>

      </div>

      <div className='flex items-center m-2'>
        <button
          className='preferenceBtn group'
          onClick={() =>
            setSettings({ ...settings, settingsModalIsOpen: true })
          }>
          <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
            <AiOutlineSetting />
          </div>
          <div className='preferenceBtn-tooltip'>Settings</div>
        </button>

        <button className='preferenceBtn group' onClick={handleFullScreen}>
          <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
            {!isFullScreen ? (
              <AiOutlineFullscreen />
            ) : (
              <AiOutlineFullscreenExit />
            )}
          </div>
          <div className='preferenceBtn-tooltip'>Full Screen</div>
        </button>
      </div>
      {settings.settingsModalIsOpen && (
        <Settings settings={settings} setSettings={setSettings} />
      )}
    </div>
  )
}
