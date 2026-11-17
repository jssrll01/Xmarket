/* eslint-disable */
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary.jsx'
import './MiniHost.css'

const Watch = lazy(() => import('../pages/Watch.jsx'))
const WatchYT = lazy(() => import('../pages/WatchYT.jsx'))

const isWatchPath = (p) => /^\/(watch|play)\//.test(p)
const portal = (node) => createPortal(node, document.getElementById('root') || document.body)
const yt = () => window.__xmYt
const stateOf = () => {
  try { const p = yt(); return p && p.getPlayerState ? p.getPlayerState() : -1 } catch (e) { return -1 }
}
const cleanTitle = () => (document.title || 'YT PREMIUM').replace(/\s*-\s*YT PREMIUM$/i, '')

// Keeps the player alive when the user leaves the watch page, and shows it as a floating window.
export default function MiniHost() {
  const loc = useLocation()
  const navigate = useNavigate()
  const onWatch = isWatchPath(loc.pathname)
  const [kept, setKept] = useState(null)
  const [playing, setPlaying] = useState(false)
  const drag = useRef(null)

  useEffect(() => { if (onWatch) setKept(loc) }, [onWatch, loc])

  const shown = onWatch ? loc : kept
  const mini = !!shown && !onWatch
  const active = !!shown
  const path = shown ? shown.pathname : ''

  useLayoutEffect(() => {
    document.body.classList.toggle('yt-mini', mini)
    if (mini) {
      try { if (document.fullscreenElement) Promise.resolve(document.exitFullscreen()).catch(() => {}) } catch (e) {}
      try { if (window.screen.orientation && window.screen.orientation.unlock) window.screen.orientation.unlock() } catch (e) {}
    }
  }, [mini])
  useEffect(() => () => document.body.classList.remove('yt-mini'), [])

  // Lock-screen / notification controls + state polling
  useEffect(() => {
    if (!active) return undefined
    const ms = navigator.mediaSession
    let lastTitle = ''
    const tick = () => {
      const st = stateOf()
      const pl = st === 1 || st === 3
      setPlaying(pl)
      if (!ms) return
      try {
        ms.playbackState = st === -1 ? 'none' : pl ? 'playing' : 'paused'
        const t = cleanTitle()
        if (t !== lastTitle && window.MediaMetadata) {
          lastTitle = t
          ms.metadata = new window.MediaMetadata({ title: t, artist: 'YT PREMIUM' })
        }
      } catch (e) {}
    }
    tick()
    const id = setInterval(tick, 700)
    const set = (name, fn) => { try { if (ms) ms.setActionHandler(name, fn) } catch (e) {} }
    const seek = (d) => { try { const p = yt(); p.seekTo(Math.max(0, p.getCurrentTime() + d), true) } catch (e) {} }
    set('play', () => { try { yt().playVideo() } catch (e) {} })
    set('pause', () => { try { yt().pauseVideo() } catch (e) {} })
    set('seekbackward', (d) => seek(-((d && d.seekOffset) || 10)))
    set('seekforward', (d) => seek((d && d.seekOffset) || 10))
    return () => {
      clearInterval(id)
      ;['play', 'pause', 'seekbackward', 'seekforward'].forEach((n) => set(n, null))
      try { if (ms) { ms.playbackState = 'none'; ms.metadata = null } } catch (e) {}
    }
  }, [active, path])

  // If the browser pauses the video just because the app went to the background, resume it
  useEffect(() => {
    if (!active) return undefined
    const timers = []
    const onVis = () => {
      timers.forEach(clearTimeout)
      timers.length = 0
      if (!document.hidden || stateOf() !== 1) return
      ;[300, 1200, 3500].forEach((ms) => timers.push(setTimeout(() => {
        if (document.hidden && stateOf() === 2) { try { yt().playVideo() } catch (e) {} }
      }, ms)))
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      timers.forEach(clearTimeout)
    }
  }, [active])

  const expand = () => { if (kept) navigate(kept.pathname + (kept.search || ''), { state: kept.state }) }
  const close = () => setKept(null)
  const toggle = () => {
    const p = yt()
    try { if (stateOf() === 1) p.pauseVideo(); else p.playVideo() } catch (e) {}
  }
  const stop = (e) => e.stopPropagation()

  const down = (e) => {
    const cs = getComputedStyle(document.body)
    drag.current = {
      x: e.clientX, y: e.clientY, moved: false,
      r: parseFloat(cs.getPropertyValue('--xm-r')) || 10,
      b: parseFloat(cs.getPropertyValue('--xm-b')) || 84
    }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch (er) {}
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.moved && Math.abs(dx) + Math.abs(dy) < 6) return
    d.moved = true
    const r = Math.min(Math.max(4, d.r - dx), window.innerWidth - 140)
    const b = Math.min(Math.max(4, d.b - dy), window.innerHeight - 110)
    document.body.style.setProperty('--xm-r', r + 'px')
    document.body.style.setProperty('--xm-b', b + 'px')
  }
  const up = () => {
    const d = drag.current
    drag.current = null
    if (d && !d.moved) expand()
  }

  if (!shown) return null

  return (
    <>
      <Suspense fallback={null}>
        <Routes location={shown}>
          <Route path="/watch/:id" element={<ErrorBoundary><Watch /></ErrorBoundary>} />
          <Route path="/play/:vid" element={<ErrorBoundary><WatchYT /></ErrorBoundary>} />
          <Route path="*" element={null} />
        </Routes>
      </Suspense>
      {mini && portal(
        <div className="xm-mini" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { drag.current = null }}>
          <div className="xm-mini__bar">
            <button type="button" aria-label={playing ? 'Pause' : 'Play'} onPointerDown={stop} onPointerUp={stop} onClick={toggle}>{playing ? '❚❚' : '▶'}</button>
            <button type="button" aria-label="Expand" onPointerDown={stop} onPointerUp={stop} onClick={expand}>⤢</button>
            <button type="button" aria-label="Close" onPointerDown={stop} onPointerUp={stop} onClick={close}>✕</button>
          </div>
        </div>
      )}
    </>
  )
}
