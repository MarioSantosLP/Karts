import { useId } from 'react'
import './TrackMap.css'

// Neon-outline track: a wide accent stroke with a narrower dark stroke on top,
// so only the edges glow.
function TrackMap({ track }) {
  const id = useId()
  const { x, y, angle } = track.startFinish

  return (
    <svg className="track-map" viewBox={track.viewBox} role="img" aria-label={`Traçado do ${track.name}`}>
      <defs>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <pattern id={`${id}-checker`} x="-12" y="-21" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#fff" />
          <rect width="8" height="8" fill="#0b1220" />
          <rect x="8" y="8" width="8" height="8" fill="#0b1220" />
        </pattern>
      </defs>
      <path className="track-glow" d={track.path} filter={`url(#${id}-glow)`} />
      <path className="track-edge" d={track.path} />
      <path className="track-surface" d={track.path} />
      <rect
        x="-12"
        y="-21"
        width="24"
        height="42"
        fill={`url(#${id}-checker)`}
        transform={`translate(${x} ${y}) rotate(${angle})`}
      />
    </svg>
  )
}

export default TrackMap
