import { useState } from 'react'
import { tracks } from '../../data/tracks'
import { drivers } from '../../data/drivers'
import { lastSession } from '../../data/season'
import { getTrackStats } from '../../data/trackStats'
import { formatCount, formatDate, formatLap, padNumber } from '../../format'
import TrackMap from '../shared/TrackMap'
import DriverPortrait from '../drivers/DriverPortrait'
import './TracksPage.css'

function TechnicalStats({ track }) {
  return <dl className="pista-technical-stats">
    <div><dt>Comprimento</dt><dd>{formatCount(track.lengthMeters)}<small>m</small></dd></div>
    <div><dt>Curvas</dt><dd>{track.turns}</dd></div>
    <div><dt>Largura constante</dt><dd>{track.widthMeters}<small>m</small></dd></div>
  </dl>
}

function TrackDirectory() {
  const entries = Object.entries(tracks)
  return <div className="container tracks-directory">
    <header className="pista-page-heading"><p className="eyebrow"><span className="tiny-square" /> O nosso mapa</p><h1 data-page-heading tabIndex={-1}>As pistas <span>da crew.</span></h1><p>Os sítios onde cada volta fica na memória.</p><span className="pista-count">{entries.length} {entries.length === 1 ? 'pista' : 'pistas'}</span></header>
    <div className="pista-catalogue">{entries.map(([id, track]) => {
      const stats = getTrackStats(id)
      return <article className="pista-catalogue-card" key={id}>
        <div className="pista-catalogue-copy">
          <p className="eyebrow">{track.city} · {track.country}</p>
          <h2><a href={`#pista/${track.slug}`}>{track.name}<span aria-hidden="true">↗</span></a></h2>
          <p className="pista-full-name">{track.fullName}</p>
          <TechnicalStats track={track} />
          <div className="pista-catalogue-record"><span>{stats.best ? 'Melhor volta da crew' : 'Ainda por estrear'}</span><strong>{stats.best ? formatLap(stats.best.result.bestLap) : '—'}</strong>{stats.best && <p>{stats.best.result.driver} <span>·</span> {stats.grandsPrix} {stats.grandsPrix === 1 ? 'GP realizado' : 'GPs realizados'}</p>}</div>
          <a className="button button-primary" href={`#pista/${track.slug}`}>Explorar {track.name}<span aria-hidden="true">↗</span></a>
        </div>
        <a className="pista-catalogue-map" href={`#pista/${track.slug}`} aria-label={`Explorar a pista ${track.name}`}><span className="eyebrow">Pista principal</span><TrackMap track={track} paused variant="catalogue" /><span className="pista-visited"><i aria-hidden="true" /> {stats.grandsPrix ? 'Já passámos por aqui' : 'O próximo desafio?'}</span></a>
        <p className="pista-catalogue-source">Dados técnicos: <a href={track.sources[0].url} target="_blank" rel="noreferrer">{track.name} · fonte oficial ↗</a></p>
      </article>
    })}</div>
    <footer className="pista-footer"><a href="#inicio">← Voltar ao início</a><span>Boas voltas. Melhores histórias.</span></footer>
  </div>
}

function TrackProfile({ trackId, track }) {
  const [paused, setPaused] = useState(false)
  const stats = getTrackStats(trackId)
  const recordDriver = drivers.find((driver) => driver.id === stats.best?.result.driverId)
  const isLatestTrack = lastSession.trackId === trackId

  return <div className="pista-profile">
    <div className="container pista-breadcrumb"><a href="#pistas">← Todas as pistas</a><span>{track.city} · {track.country}</span></div>
    <section className="pista-hero" aria-labelledby="pista-title"><div className="container pista-hero-inner">
      <div className="pista-hero-copy"><p className="eyebrow"><span className="tiny-square" /> A pista, por dentro</p><h1 id="pista-title" data-page-heading tabIndex={-1}>{track.name}</h1><p className="pista-full-name">{track.fullName}</p><p className="pista-description">{track.description}</p><div className="pista-actions"><a className="button button-primary" href={track.mapsUrl} target="_blank" rel="noreferrer">Como chegar<span aria-hidden="true">↗</span></a><a className="pista-secondary-link" href={track.website} target="_blank" rel="noreferrer">Site oficial ↗</a></div></div>
      <div className="pista-diagram"><div className="pista-diagram-header"><span className="eyebrow">Pista principal / {track.name}</span><button type="button" className="pista-motion" aria-pressed={paused} aria-label={paused ? 'Retomar animação do traçado' : 'Pausar animação do traçado'} onClick={() => setPaused((value) => !value)}>{paused ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z" /></svg> : <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4h3v12H6zm5 0h3v12h-3z" /></svg>}</button></div><TrackMap track={track} paused={paused} variant="profile" /><div className="pista-diagram-footer"><span>Esquema do traçado</span><span><i aria-hidden="true" /> Linha de meta</span></div></div>
    </div></section>
    <div className="container">
      <section className="pista-specifications" aria-label="Dados técnicos da pista principal"><TechnicalStats track={track} /><p>Fonte: <a href={track.sources[0].url} target="_blank" rel="noreferrer">site oficial do {track.name} ↗</a></p></section>
      <section className="pista-crew-section" aria-labelledby="pista-crew-title">
        <div className="pista-section-heading"><p className="eyebrow">01 / A nossa marca</p><h2 id="pista-crew-title">A crew nesta pista.</h2></div>
        <div className="pista-crew-grid"><article className="pista-record-panel"><div className="pista-record-copy"><p className="eyebrow">Melhor volta da crew</p><strong>{stats.best ? formatLap(stats.best.result.bestLap) : '—'}</strong>{stats.best ? <><a href={`#piloto/${stats.best.result.driverId}`}>{stats.best.result.driver} ↗</a><p>{stats.best.session.name} · {formatDate(stats.best.session.date)} {stats.best.session.date.slice(0, 4)}<br />Kart #{padNumber(stats.best.result.kartNumber)}</p></> : <p>A primeira referência está por fazer.</p>}</div>{recordDriver && <div className="pista-record-portrait" style={{ '--driver-accent': recordDriver.accent }} aria-hidden="true"><DriverPortrait driver={recordDriver} /></div>}</article>
          <dl className="pista-crew-totals"><div><dt>GPs realizados</dt><dd>{stats.grandsPrix}</dd></div><div><dt>Pilotos da crew</dt><dd>{stats.drivers}</dd></div><div><dt>Voltas registadas</dt><dd>{formatCount(stats.laps)}</dd></div><div><dt>Sessões no histórico</dt><dd>{stats.sessions}</dd></div></dl>
        </div>
      </section>
      <section className="pista-information" aria-labelledby="pista-information-title">
        <div className="pista-section-heading"><p className="eyebrow">02 / Fora do cronómetro</p><h2 id="pista-information-title">Antes de ir para a pista.</h2></div>
        <div className="pista-information-grid"><article className="pista-info-card"><span className="pista-info-symbol" aria-hidden="true">↗</span><h3>Frota de aluguer</h3><p>{track.rentalFleet}.</p><a href={track.sources[0].url} target="_blank" rel="noreferrer">Conhecer os karts ↗</a></article>
          {track.juniorTrack && <article className="pista-info-card"><span className="pista-info-symbol" aria-hidden="true">JR</span><h3>Também há pista júnior</h3><p>Um traçado próprio com {formatCount(track.juniorTrack.lengthMeters)} metros e {track.juniorTrack.turns} curvas.</p><a href={track.sources[0].url} target="_blank" rel="noreferrer">Ver pista júnior ↗</a></article>}
          <article className="pista-info-card"><span className="pista-info-symbol" aria-hidden="true">＋</span><h3>No complexo</h3><ul>{track.facilities.map((facility) => <li key={facility}>{facility}</li>)}</ul></article>
        </div>
      </section>
      <div className="pista-history-layout">
        <section className="pista-personal-records" aria-labelledby="pista-records-title"><div className="pista-section-heading"><p className="eyebrow">03 / Referências da malta</p><h2 id="pista-records-title">Os nossos tempos aqui.</h2></div><p className="pista-section-note">Melhor volta registada de cada piloto, entre classificação e corrida.</p>
          {stats.bestLaps.length ? <div className="pista-table-scroll" tabIndex={0} role="region" aria-label={`Recordes pessoais no ${track.name}; desliza para ver todas as colunas`}><table className="pista-records-table"><caption className="pista-sr">Melhores voltas da crew no {track.name}</caption><thead><tr><th scope="col">Pos.</th><th scope="col">Piloto</th><th scope="col">Melhor volta</th><th scope="col">Sessão</th></tr></thead><tbody>{stats.bestLaps.map(({ result, session }, index) => <tr key={result.driverId}><td>{padNumber(index + 1)}</td><td><a href={`#piloto/${result.driverId}`}>{result.driver}<small>#{padNumber(result.number)}</small></a></td><td>{formatLap(result.bestLap)}</td><td>{session.name}</td></tr>)}</tbody></table></div> : <p className="pista-no-results">Ainda não há tempos registados nesta pista.</p>}
        </section>
        <aside className="pista-visit-sidebar"><section aria-labelledby="pista-visits-title"><div className="pista-section-heading"><p className="eyebrow">04 / Dias que ficam</p><h2 id="pista-visits-title">As nossas passagens.</h2></div><div className="pista-visits">{stats.meetings.map((meeting) => <article key={meeting.date} className="pista-visit"><time dateTime={meeting.date}>{formatDate(meeting.date)} <span>{meeting.date.slice(0, 4)}</span></time><p>{meeting.drivers} pilotos · {meeting.laps} voltas</p><div>{meeting.sessions.map((session) => <span key={session.id}>{session.name}</span>)}</div></article>)}{!stats.meetings.length && <p className="pista-no-results">Uma nova pista para a próxima ida da crew.</p>}</div>{isLatestTrack && <a className="pista-inline-link" href="#sessoes">Ver os últimos resultados ↗</a>}</section>
          <section className="pista-contact-card" aria-labelledby="pista-contact-title"><p className="eyebrow">Combinar a próxima</p><h2 id="pista-contact-title">Encontramo-nos aqui.</h2><p>{track.address}</p><a className="pista-map-link" href={track.mapsUrl} target="_blank" rel="noreferrer">Abrir no mapa ↗</a><dl><div><dt>Telefone</dt><dd><a href={`tel:${track.phone.replace(/\s/g, '')}`}>{track.phone}</a></dd></div><div><dt>Email</dt><dd><a href={`mailto:${track.email}`}>{track.email}</a></dd></div><div><dt>Horário publicado</dt><dd>{track.openingHours.map((line) => <span key={line}>{line}</span>)}</dd></div></dl><a className="pista-inline-link" href={track.sources[1].url} target="_blank" rel="noreferrer">Confirmar horários e contactos ↗</a></section>
        </aside>
      </div>
      <section className="pista-sources" aria-label="Fontes da informação"><p>Informação do circuito verificada em {formatDate(track.verifiedOn)} {track.verifiedOn.slice(0, 4)}.</p><div>{track.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div><p>Os tempos e recordes da crew são calculados a partir das nossas sessões registadas.</p></section>
      <footer className="pista-footer"><a href="#pistas">← Todas as pistas</a><span>Boas voltas. Melhores histórias.</span></footer>
    </div>
  </div>
}

function TracksPage({ trackSlug }) {
  if (!trackSlug) return <TrackDirectory />
  const entry = Object.entries(tracks).find(([, track]) => track.slug === trackSlug)
  if (!entry) return <section className="container pista-not-found"><p className="eyebrow">Apex Crew / Pistas</p><h1 data-page-heading tabIndex={-1}>Pista não encontrada.</h1><a className="button button-primary" href="#pistas">Ver as nossas pistas<span aria-hidden="true">↗</span></a></section>
  return <TrackProfile trackId={entry[0]} track={entry[1]} />
}

export default TracksPage
