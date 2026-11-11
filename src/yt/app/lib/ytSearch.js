/* eslint-disable */
import { supabase } from '../../../lib/supabase'

const TTL_MS = 6 * 60 * 60 * 1000
const PREFIX = 'ytp.search.'
export const searchEnabled = true

const cacheKey = (q, token) => PREFIX + q.toLowerCase().replace(/\s+/g, ' ').trim() + '|' + (token || '')
export function readCache(q, token = '') {
  try {
    const raw = localStorage.getItem(cacheKey(q, token))
    if (!raw) return null
    const { t, data } = JSON.parse(raw)
    if (Date.now() - t > TTL_MS) { localStorage.removeItem(cacheKey(q, token)); return null }
    return data
  } catch { return null }
}
function writeCache(q, token, data) {
  try { localStorage.setItem(cacheKey(q, token), JSON.stringify({ t: Date.now(), data })) } catch {}
}

export async function searchYouTube(q, pageToken = '') {
  const query = q.trim()
  const hit = readCache(query, pageToken)
  if (hit) return hit
  if (pageToken) return { items: [], next: '' }
  const KEY = process.env.REACT_APP_YOUTUBE_API_KEY
  if (KEY) {
    const res = await fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&videoEmbeddable=true&safeSearch=moderate&q=' + encodeURIComponent(query) + '&key=' + KEY)
    const j = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((j.error && j.error.message) || 'Search failed. Try again.')
    const items = (j.items || []).filter((x) => x.id && x.id.videoId).map((x) => ({
      id: x.id.videoId, title: x.snippet.title, channel: x.snippet.channelTitle, duration: '',
      thumb: 'https://img.youtube.com/vi/' + x.id.videoId + '/mqdefault.jpg'
    }))
    const out = { items, next: '' }
    writeCache(query, pageToken, out)
    return out
  }
  const { data, error } = await supabase.rpc('yt_search', { p_q: query })
  if (error || !data) throw new Error('Search failed. Try again.')
  if (data.ok === false) throw new Error(data.error === 'PIN_REQUIRED' ? 'Please enter the PIN again.' : (data.error || 'Search failed. Try again.'))
  const items = (data.items || []).map((x) => ({
    id: x.youtube_id, title: x.title, channel: x.channel, duration: '',
    thumb: 'https://img.youtube.com/vi/' + x.youtube_id + '/mqdefault.jpg'
  }))
  const out = { items, next: '' }
  writeCache(query, pageToken, out)
  return out
}
