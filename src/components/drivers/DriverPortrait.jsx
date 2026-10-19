import { useDriverPhoto } from '../../hooks/useDriverPhoto'

function DriverPortrait({ driver, priority = false }) {
  const [photo] = useDriverPhoto(driver.id)

  const portrait = photo || driver.portrait

  const defaultStyle = driver.portraitType === 'photo' ? ' is-photo' : ` is-cutout${driver.portraitType === 'wide-cutout' ? ' is-wide-cutout' : ''}`

  if (portrait) return <img className={`driver-portrait-image${!photo && driver.portrait ? defaultStyle : ''}`} src={portrait} alt={`Foto de ${driver.name}`} loading={priority ? 'eager' : 'lazy'} />

  return (
    <div className="driver-portrait-placeholder" role="img" aria-label={`Foto de ${driver.name} ainda não adicionada`}>
      <svg viewBox="0 0 320 400" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`helmet-${driver.id}`} x1="70" y1="100" x2="260" y2="310" gradientUnits="userSpaceOnUse"><stop stopColor="currentColor" stopOpacity=".32" /><stop offset="1" stopColor="currentColor" stopOpacity=".04" /></linearGradient>
        </defs>
        <circle cx="160" cy="172" r="103" stroke="currentColor" strokeOpacity=".09" />
        <circle cx="160" cy="172" r="125" stroke="currentColor" strokeOpacity=".04" strokeDasharray="3 8" />
        <path d="M41 400v-46c0-36 20-58 64-72l26-10h58l26 10c44 14 64 36 64 72v46" fill={`url(#helmet-${driver.id})`} stroke="currentColor" strokeOpacity=".22" />
        <path d="m125 278 35 28 35-28m-35 28v94M74 328l31 15-8 57m149-72-31 15 8 57" stroke="currentColor" strokeOpacity=".17" />
        <path d="M81 192c-3-14-3-40 5-63 10-31 36-51 74-51s64 20 74 51c8 23 8 49 5 63l-12 48c-4 19-19 32-38 35h-58c-19-3-34-16-38-35l-12-48Z" fill="#101c2b" stroke="currentColor" strokeOpacity=".38" strokeWidth="1.5" />
        <path d="M88 143c35-17 109-17 144 0l-9 57c-36 10-90 10-126 0l-9-57Z" fill={`url(#helmet-${driver.id})`} stroke="currentColor" strokeOpacity=".5" />
        <path d="M107 150c28-8 60-9 86-5m-78 11 35-3" stroke="currentColor" strokeOpacity=".43" strokeWidth="2" strokeLinecap="round" />
        <path d="m98 212 29 13h66l29-13m-95 13 8 30h50l8-30m-47 16h28" stroke="currentColor" strokeOpacity=".3" strokeWidth="2" />
        <path d="M142 89h36l-5 11h-26z" fill="currentColor" fillOpacity=".3" />
      </svg>
      <span className="portrait-placeholder-caption">Foto / por adicionar</span>
    </div>
  )
}

export default DriverPortrait
