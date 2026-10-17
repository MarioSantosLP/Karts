import { useEffect, useId, useRef } from 'react'
import './TrackMap.css'

const racers = [
  { color: '#71ddff', duration: 8, offset: -1.2 },
  { color: '#eff8ff', duration: 8.8, offset: -4.4 },
  { color: '#4388ff', duration: 9.6, offset: -7.4 },
]

function TrackMap({ track, paused = false, variant = 'hero' }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const svgRef = useRef(null)
  const { x, y, angle } = track.startFinish
  const [left, top, width, height] = track.viewBox.split(/\s+/).map(Number)
  const padding = 44
  const viewBox = `${left - padding} ${top - padding} ${width + padding * 2} ${height + padding * 2}`

  useEffect(() => {
    const svg = svgRef.current
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePlayback = () => {
      if (paused || motionPreference.matches) {
        svg?.pauseAnimations?.()
      } else {
        svg?.unpauseAnimations?.()
      }
    }

    updatePlayback()
    motionPreference.addEventListener('change', updatePlayback)
    return () => motionPreference.removeEventListener('change', updatePlayback)
  }, [paused])

  return (
    <svg
      ref={svgRef}
      className="track-map"
      data-variant={variant}
      data-paused={paused}
      viewBox={viewBox}
      role="img"
      aria-label={`Traçado do ${track.name}`}
    >
      <defs>
        <linearGradient id={`${id}-edge`} x1="0" y1="1" x2="0.8" y2="0">
          <stop offset="0" stopColor="#2257b4" />
          <stop offset="0.5" stopColor="#498edc" />
          <stop offset="1" stopColor="#7bc9ed" />
        </linearGradient>
        <linearGradient id={`${id}-road`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#152c47" />
          <stop offset="1" stopColor="#0a172a" />
        </linearGradient>
        <filter id={`${id}-ambient`} x="-15%" y="-20%" width="130%" height="140%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id={`${id}-kart-glow`} x="-150%" y="-200%" width="400%" height="500%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id={`${id}-checker`} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#e8f4ff" />
          <rect width="6" height="6" fill="#11263b" />
          <rect x="6" y="6" width="6" height="6" fill="#11263b" />
        </pattern>
      </defs>

      <g className="track-stage">
        <path className="track-depth track-depth-far" d={track.path} />
        <path className="track-depth track-depth-near" d={track.path} />
        <path className="track-ambient" d={track.path} filter={`url(#${id}-ambient)`} />
        <path className="track-edge" d={track.path} stroke={`url(#${id}-edge)`} />
        <path className="track-surface" d={track.path} stroke={`url(#${id}-road)`} />
        <path className="track-lane" d={track.path} pathLength="1000" />
        <path className="track-route" d={track.path} pathLength="1" />

        <g className="start-finish" transform={`translate(${x} ${y}) rotate(${angle})`}>
          <rect x="-9" y="-19" width="18" height="38" fill={`url(#${id}-checker)`} />
          <line x1="-13" y1="-25" x2="13" y2="-25" />
          <line x1="-13" y1="25" x2="13" y2="25" />
        </g>

        {racers.map((racer, index) => (
          <g
            key={racer.color}
            className="track-racer"
            style={{ '--kart-color': racer.color }}
            aria-hidden="true"
          >
            <g filter={`url(#${id}-kart-glow)`}>
              <path className="track-racer-trail trail-far" d="M-46 0H-24" />
              <path className="track-racer-trail trail-near" d="M-24 0H-8" />
            </g>
            <rect className="track-racer-wheel" x="-6" y="-9" width="4" height="18" rx="2" />
            <rect className="track-racer-wheel" x="5" y="-7" width="3" height="14" rx="1.5" />
            <rect className="track-racer-body" x="-8" y="-4.5" width="18" height="9" rx="3.5" />
            <rect className="track-racer-cockpit" x="-2" y="-3" width="6" height="6" rx="2" />
            <circle className="track-racer-light" cx="9" cy="0" r="2" />
            <animateMotion
              id={`${id}-racer-${index}`}
              dur={`${racer.duration}s`}
              begin={`${racer.offset}s`}
              repeatCount="indefinite"
              rotate="auto"
              path={track.path}
            />
          </g>
        ))}
      </g>
    </svg>
  )
}

export default TrackMap
