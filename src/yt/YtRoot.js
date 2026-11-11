import React, { useMemo } from 'react'
import { RouterProvider, createMemoryRouter, useNavigate } from 'react-router-dom'
import { SettingsProvider } from './app/context/SettingsContext.jsx'
import { MyListProvider } from './app/context/MyListContext.jsx'
import YtInner from './app/App.jsx'
import YtDebug from './YtDebug.js'
import './app/index.css'

function Shell() {
  return (
    <SettingsProvider>
      <MyListProvider>
        <YtInner />
      </MyListProvider>
    </SettingsProvider>
  )
}

export default function YtRoot() {
  const leave = useNavigate()
  const router = useMemo(() => createMemoryRouter([{ path: '*', element: <Shell /> }]), [])
  return (
    <div className="yt-root" data-theme="dark" style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <button type="button" onClick={() => leave('/digital-hub')} aria-label="Exit YouTube Premium"
        style={{ position: 'fixed', top: 'calc(6px + env(safe-area-inset-top, 0px))', right: 6, zIndex: 500, border: 0, borderRadius: 99, padding: '6px 12px', fontSize: 12, fontWeight: 700, background: 'rgba(0,0,0,.6)', color: '#fff' }}>Exit</button>
      <YtDebug><RouterProvider router={router} /></YtDebug>
    </div>
  )
}
