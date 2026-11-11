import React from 'react'
import { MemoryRouter, useNavigate, UNSAFE_LocationContext, UNSAFE_NavigationContext, UNSAFE_RouteContext } from 'react-router-dom'
import { SettingsProvider } from './app/context/SettingsContext.jsx'
import { MyListProvider } from './app/context/MyListContext.jsx'
import YtInner from './app/App.jsx'
import YtDebug from './YtDebug.js'
import './app/index.css'

const emptyRoute = { outlet: null, matches: [], isDataRoute: false }

export default function YtRoot() {
  const leave = useNavigate()
  return (
    <div className="yt-root" data-theme="dark" style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <button type="button" onClick={() => leave('/digital-hub')} aria-label="Exit YouTube Premium"
        style={{ position: 'fixed', top: 'calc(6px + env(safe-area-inset-top, 0px))', right: 6, zIndex: 500, border: 0, borderRadius: 99, padding: '6px 12px', fontSize: 12, fontWeight: 700, background: 'rgba(0,0,0,.6)', color: '#fff' }}>Exit</button>
      <YtDebug>
        <UNSAFE_LocationContext.Provider value={null}>
          <UNSAFE_NavigationContext.Provider value={null}>
            <UNSAFE_RouteContext.Provider value={emptyRoute}>
              <MemoryRouter>
                <SettingsProvider>
                  <MyListProvider>
                    <YtInner />
                  </MyListProvider>
                </SettingsProvider>
              </MemoryRouter>
            </UNSAFE_RouteContext.Provider>
          </UNSAFE_NavigationContext.Provider>
        </UNSAFE_LocationContext.Provider>
      </YtDebug>
    </div>
  )
}
