import { useRef, useState } from 'react'
import './LandingCarousel.css'

const photos = [
  { src: '/crew/crew-kip-1.jpeg', alt: 'A crew reunida no pódio do Kartódromo Internacional de Palmela.' },
  { src: '/crew/podio-kip.jpeg', alt: 'Nuno à esquerda, Tomás ao centro e Tiago à direita, com os seus troféus.' },
  { src: '/crew/crew-kip-2.jpeg', alt: 'Outra fotografia do grupo no pódio do KIP.' },
]

function LandingCarousel() {
  const [current, setCurrent] = useState(0)
  const touchStart = useRef(null)
  const move = (direction) => setCurrent((index) => (index + direction + photos.length) % photos.length)

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  const handleTouchEnd = (event) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const end = event.changedTouches[0]
    const distanceX = end.clientX - start.x
    const distanceY = end.clientY - start.y
    if (Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY)) {
      move(distanceX < 0 ? 1 : -1)
    }
  }

  return (
    <section className="container crew-carousel" id="inicio" aria-label="Fotografias da crew" aria-roledescription="carrossel" onKeyDown={handleKeyDown}>
      <div className="crew-carousel-frame" onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }} onTouchEnd={handleTouchEnd} onTouchCancel={() => { touchStart.current = null }}>
        {photos.map((photo, index) => (
          <div className="crew-carousel-slide" key={photo.src} hidden={index !== current} role="group" aria-roledescription="diapositivo" aria-label={`${index + 1} de ${photos.length}`}>
            <img src={photo.src} alt={photo.alt} width="6000" height="4000" loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} />
          </div>
        ))}
        <button className="crew-carousel-arrow is-previous" type="button" aria-label="Fotografia anterior" onClick={() => move(-1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button>
        <button className="crew-carousel-arrow is-next" type="button" aria-label="Fotografia seguinte" onClick={() => move(1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
      </div>
      <div className="crew-carousel-footer">
        <div className="crew-carousel-dots" role="group" aria-label="Escolher fotografia">
          {photos.map((photo, index) => <button key={photo.src} type="button" aria-label={`Ver fotografia ${index + 1}`} aria-pressed={current === index} onClick={() => setCurrent(index)}><span /></button>)}
        </div>
        <span className="crew-carousel-count" role="status" aria-label={`Fotografia ${current + 1} de ${photos.length}`}>{String(current + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
      </div>
    </section>
  )
}

export default LandingCarousel
