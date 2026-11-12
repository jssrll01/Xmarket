/* eslint-disable */
import { useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import './Search.css'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const setQuery = (value) => setParams(value ? { q: value } : {}, { replace: true })

  return (
    <div className="yt-search">
      <label className="search__field">
        <Icon name="search" size={20} />
        <input
          type="search"
          value={q}
          placeholder="Search YouTube"
          aria-label="Search YouTube"
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </label>
    </div>
  )
}
