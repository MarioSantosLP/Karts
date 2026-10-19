import { useState } from 'react'
import { drivers } from '../../data/drivers'
import { defaultSession, sessions } from '../../data/season'
import { tracks } from '../../data/tracks'
import { formatDate, formatGap, formatLap, padNumber } from '../../format'
import DriverPortrait from '../drivers/DriverPortrait'
import SelectMenu from '../shared/SelectMenu'
import { getBestValue, getResultStats } from './comparison'
import './DriverComparison.css'

const colors = ['#75c9dd', '#f5bf73', '#b5a4ff']
const meetings = Array.from(sessions.reduce((groups, session) => {
  const id = `${session.trackId}:${session.date}`
  if (!groups.has(id)) groups.set(id, { id, trackId: session.trackId, date: session.date, sessions: [] })
  groups.get(id).sessions.push(session)
  return groups
}, new Map()).values()).sort((a, b) => b.date.localeCompare(a.date))

const timeMetric = (value) => formatLap(value)
const metrics = [
  { key: 'position', label: 'Posição final', format: (value) => `${value}.º`, direction: 'min' },
  { key: 'bestLap', label: 'Melhor volta', format: timeMetric, direction: 'min' },
  { key: 'average', label: 'Média das voltas', format: timeMetric, direction: 'min' },
  { key: 'median', label: 'Mediana das voltas', format: timeMetric, direction: 'min' },
  { key: 'consistency', label: 'Regularidade', format: (value) => `${value.toFixed(3)} s`, direction: 'min' },
  { key: 'laps', label: 'Voltas realizadas', format: String, direction: 'max' },
  { key: 'speedKmh', format: (value) => `${value.toFixed(2)} km/h`, direction: 'max' },
  { key: 'idealLap', label: 'Volta ideal', format: timeMetric, direction: 'min' },
  { key: 'kartNumber', label: 'Kart nesta sessão', format: (value) => `#${padNumber(value)}` },
]

function DriverLabel({ entry }) {
  return <span className="comparison-driver-label"><i style={{ background: entry.color }} aria-hidden="true" />{entry.driver.name}</span>
}

function LapChart({ entries }) {
  const available = entries.filter((entry) => entry.stats)
  const allLaps = available.flatMap((entry) => entry.stats.lapTimes)
  if (!allLaps.length) return null
  const maxLaps = Math.max(...available.map((entry) => entry.stats.lapTimes.length))
  const low = Math.min(...allLaps)
  const high = Math.max(...allLaps)
  const padding = Math.max((high - low) * 0.1, 0.5)
  const min = Math.max(0, low - padding)
  const max = high + padding
  const plot = { x: 86, y: 22, width: 870, height: 230 }
  const x = (index) => plot.x + index / Math.max(1, maxLaps - 1) * plot.width
  const y = (time) => plot.y + (max - time) / (max - min) * plot.height
  const ticks = [...new Set([1, Math.ceil(maxLaps / 2), maxLaps])]

  return <div className="comparison-chart">
    <svg viewBox="0 0 990 300" role="img" aria-labelledby="lap-chart-title lap-chart-description">
      <title id="lap-chart-title">Evolução dos tempos por volta</title>
      <desc id="lap-chart-description">Cada linha representa um piloto. Quanto mais baixo o tempo, mais rápida a volta. Os valores individuais estão na tabela volta a volta.</desc>
      {[0, 1, 2, 3].map((tick) => {
        const time = min + (max - min) * tick / 3
        return <g key={tick}><line x1={plot.x} x2={plot.x + plot.width} y1={y(time)} y2={y(time)} className="comparison-chart-grid" /><text x={plot.x - 14} y={y(time) + 4} textAnchor="end">{formatLap(time)}</text></g>
      })}
      {ticks.map((lap) => <text key={lap} x={x(lap - 1)} y="282" textAnchor="middle">V{padNumber(lap)}</text>)}
      {available.map((entry) => <g key={entry.driver.id} style={{ color: entry.color }}>
        <polyline points={entry.stats.lapTimes.map((time, index) => `${x(index)},${y(time)}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={entry.slot === 1 ? '8 4' : entry.slot === 2 ? '2 5' : undefined} />
        {entry.stats.lapTimes.map((time, index) => <circle key={index} cx={x(index)} cy={y(time)} r="3.5" fill="currentColor"><title>{entry.driver.name} · volta {index + 1}: {formatLap(time)}</title></circle>)}
      </g>)}
    </svg>
    <div className="comparison-chart-legend">{entries.map((entry) => <span key={entry.driver.id}><DriverLabel entry={entry} />{!entry.stats && <small>sem resultados</small>}</span>)}</div>
  </div>
}

function MetricsTable({ entries, sessionType }) {
  return <div className="comparison-scroll" tabIndex={0} role="region" aria-label="Comparação de estatísticas; desliza para ver todos os pilotos">
    <table className="comparison-table">
      <caption className="comparison-sr">Estatísticas dos pilotos na sessão selecionada</caption>
      <thead><tr><th scope="col">Na mesma sessão</th>{entries.map((entry) => <th scope="col" key={entry.driver.id}><DriverLabel entry={entry} /></th>)}</tr></thead>
      <tbody>{metrics.map((metric) => {
        const best = metric.direction ? getBestValue(entries.map((entry) => entry.stats?.[metric.key]), metric.direction) : null
        const label = metric.key === 'speedKmh' ? sessionType === 'race' ? 'Velocidade média da corrida' : 'Velocidade máxima alcançada' : metric.label
        return <tr key={metric.key}><th scope="row">{label}{metric.key === 'consistency' && <small>Menor desvio = voltas mais próximas</small>}{metric.key === 'idealLap' && <small>Combinação dos melhores setores</small>}</th>{entries.map((entry) => {
          const value = entry.stats?.[metric.key]
          const isBest = best !== null && Number.isFinite(value) && Math.abs(value - best) < 0.000001
          return <td key={entry.driver.id} className={isBest ? 'is-best' : undefined}>{Number.isFinite(value) ? metric.format(value) : <span className="comparison-unavailable">—</span>}{isBest && <span className="comparison-sr"> · melhor valor entre os selecionados</span>}</td>
        })}</tr>
      })}</tbody>
    </table>
  </div>
}

function SectorComparison({ entries }) {
  return <div className="comparison-sector-grid">{[0, 1, 2].map((sector) => {
    const values = entries.map((entry) => entry.stats?.sectors?.[sector])
    const best = getBestValue(values)
    const max = Math.max(...values.filter(Number.isFinite), 1)
    return <article className="comparison-sector" key={sector}>
      <h3><span>S{sector + 1}</span> Setor {sector + 1}</h3>
      {entries.map((entry, index) => <div className="comparison-sector-row" key={entry.driver.id}>
        <div><span>{entry.driver.name}</span><strong className={best !== null && values[index] === best ? 'is-best' : undefined}>{Number.isFinite(values[index]) ? `${values[index].toFixed(3)} s` : '—'}</strong></div>
        <div className="comparison-sector-bar" aria-hidden="true"><span style={{ width: Number.isFinite(values[index]) ? `${values[index] / max * 100}%` : '0%', background: entry.color }} /></div>
      </div>)}
    </article>
  })}</div>
}

function LapTable({ entries }) {
  const maxLaps = Math.max(...entries.map((entry) => entry.stats?.lapTimes.length ?? 0), 0)
  return <details className="comparison-lap-details">
    <summary><span>Ver volta a volta<small>Tempos e setores de cada piloto</small></span><span>{maxLaps} voltas <b aria-hidden="true">⌄</b></span></summary>
    <div className="comparison-scroll" tabIndex={0} role="region" aria-label="Tabela de voltas e setores; desliza para ver todos os pilotos">
      <table className="comparison-table comparison-lap-table">
        <caption className="comparison-sr">Tempos e setores por número da volta</caption>
        <thead><tr><th scope="col">Volta</th>{entries.map((entry) => <th scope="col" key={entry.driver.id}><DriverLabel entry={entry} /></th>)}</tr></thead>
        <tbody>{Array.from({ length: maxLaps }, (_, lap) => {
          const best = getBestValue(entries.map((entry) => entry.stats?.lapTimes[lap]))
          return <tr key={lap}><th scope="row">V{padNumber(lap + 1)}</th>{entries.map((entry) => {
            const time = entry.stats?.lapTimes[lap]
            const sectors = entry.stats?.lapSectors?.[lap]
            return <td key={entry.driver.id} className={best !== null && time === best ? 'is-best' : undefined}>
              {time === undefined ? <span className="comparison-unavailable">—</span> : sectors ? <details className="comparison-lap-sectors">
                <summary aria-label={`${entry.driver.name}, volta ${lap + 1}, ${formatLap(time)}. Setores`}>{formatLap(time)}<span aria-hidden="true">⌄</span></summary>
                <dl>{sectors.map((value, index) => <div key={index}><dt>S{index + 1}</dt><dd>{value.toFixed(3)} s</dd></div>)}</dl>
              </details> : formatLap(time)}
            </td>
          })}</tr>
        })}</tbody>
      </table>
    </div>
    <p className="comparison-note">Carrega num tempo com seta para abrir os setores. “—” indica dados não disponíveis. A comparação segue o número da volta, não a posição dos pilotos em pista.</p>
  </details>
}

function DriverComparison() {
  const [meetingId, setMeetingId] = useState(`${defaultSession.trackId}:${defaultSession.date}`)
  const [sessionType, setSessionType] = useState(defaultSession.type)
  const [selected, setSelected] = useState([defaultSession.results[0]?.driverId ?? '', defaultSession.results[1]?.driverId ?? '', ''])
  const meeting = meetings.find(({ id }) => id === meetingId) ?? meetings[0]
  const session = meeting.sessions.find((item) => item.type === sessionType) ?? meeting.sessions[0]
  const entries = selected.flatMap((id, slot) => {
    const driver = drivers.find((item) => item.id === id)
    return driver ? [{ driver, slot, color: colors[slot], stats: getResultStats(session.results.find((result) => result.driverId === id)) }] : []
  })
  const fastest = Math.min(...entries.filter((entry) => entry.stats).map((entry) => entry.stats.bestLap))
  const hasComparison = entries.length >= 2

  const selectDriver = (slot, id) => {
    setSelected((current) => id && current.some((value, index) => index !== slot && value === id) ? current : current.map((value, index) => index === slot ? id : value))
  }

  return <div className="comparison-page">
    <div className="container">
      <header className="comparison-heading">
        <a className="comparison-back" href="#pilotos">← Voltar aos pilotos</a>
        <p className="eyebrow"><span className="tiny-square" /> A crew, lado a lado</p>
        <h1 data-page-heading tabIndex={-1}>Quem ganha <span>em quê?</span></h1>
        <p>Escolhe até três pilotos. Os tempos contam o resto.</p>
      </header>
      <section className="comparison-filters" aria-label="Escolher GP e sessão">
        <div className="comparison-meeting-label"><label id="compare-meeting-label" htmlFor="compare-meeting">Dia de pista</label><SelectMenu id="compare-meeting" labelId="compare-meeting-label" value={meeting.id} onChange={setMeetingId} options={meetings.map((item) => ({ value: item.id, label: `${tracks[item.trackId].name} · ${formatDate(item.date)} ${item.date.slice(0, 4)}` }))} /></div>
        <div className="session-switch" role="group" aria-label="Sessão a comparar">
          {[...meeting.sessions].sort((a, b) => Number(b.type === 'race') - Number(a.type === 'race')).map((item) => <button type="button" key={item.id} aria-pressed={session.id === item.id} onClick={() => setSessionType(item.type)}>{item.name}</button>)}
        </div>
      </section>
      <section className="comparison-selectors" aria-label="Escolher até três pilotos">
        {selected.map((id, slot) => {
          const entry = entries.find((item) => item.slot === slot)
          return <article key={slot} className={`comparison-slot${entry ? ' is-selected' : ''}`} style={{ '--comparison-color': colors[slot], '--driver-accent': entry?.driver.accent ?? colors[slot] }}>
            <div className="comparison-slot-top"><label id={`compare-driver-${slot}-label`} htmlFor={`compare-driver-${slot}`}>Piloto {padNumber(slot + 1)}</label>{entry && <button type="button" className="comparison-remove" aria-label={`Retirar ${entry.driver.name} da comparação`} onClick={() => selectDriver(slot, '')}>×</button>}</div>
            <SelectMenu id={`compare-driver-${slot}`} labelId={`compare-driver-${slot}-label`} value={id} onChange={(value) => selectDriver(slot, value)} options={[{ value: '', label: slot === 2 ? 'Adicionar terceiro piloto' : 'Selecionar piloto' }, ...drivers.map((driver) => ({ value: driver.id, label: `#${padNumber(driver.number)} · ${driver.name}`, disabled: selected.some((value, index) => index !== slot && value === driver.id) }))]} />
            {entry ? <div className="comparison-slot-body">
              <div><a href={`#piloto/${entry.driver.id}`} className="comparison-profile-link">Ver perfil ↗</a><strong>{entry.stats ? formatLap(entry.stats.bestLap) : '—'}</strong><p>{!entry.stats ? 'Sem resultados nesta sessão' : entry.stats.bestLap === fastest && entries.filter((item) => item.stats).length >= 2 ? 'Melhor volta entre os selecionados' : 'Melhor volta da sessão'}</p>{entry.stats && <span className="comparison-gap">{entry.stats.bestLap === fastest ? 'Referência' : `${formatGap(entry.stats.bestLap - fastest)} s face à referência`}</span>}</div>
              <div className="comparison-portrait" aria-hidden="true"><DriverPortrait driver={entry.driver} /></div>
            </div> : <div className="comparison-slot-empty"><span aria-hidden="true">＋</span><p>Mais um rival para a conversa.</p></div>}
          </article>
        })}
      </section>
      <p className="comparison-selection-status" role="status">{entries.length} de 3 pilotos selecionados · {session.name}</p>
      {hasComparison ? <>
        <section className="comparison-panel" aria-labelledby="comparison-metrics-title">
          <div className="comparison-panel-heading"><div><p className="eyebrow">01 / Frente a frente</p><h2 id="comparison-metrics-title">Os números da sessão.</h2></div><span className="comparison-best-key"><i aria-hidden="true" /> Melhor entre os selecionados</span></div>
          <MetricsTable entries={entries} sessionType={session.type} />
          <p className="comparison-note">Média, mediana e regularidade consideram todas as voltas registadas. A regularidade é o desvio padrão dos tempos. A volta ideal junta os melhores S1, S2 e S3 de voltas diferentes e só aparece quando esses dados estão disponíveis.</p>
        </section>
        <section className="comparison-panel" aria-labelledby="comparison-chart-heading">
          <div className="comparison-panel-heading"><div><p className="eyebrow">02 / Volta após volta</p><h2 id="comparison-chart-heading">O ritmo de cada um.</h2></div><span className="comparison-panel-hint">Tempo por volta · mais baixo é mais rápido</span></div>
          <LapChart entries={entries} />
          <LapTable entries={entries} />
        </section>
        <section className="comparison-panel" aria-labelledby="comparison-sectors-title">
          <div className="comparison-panel-heading"><div><p className="eyebrow">03 / Curva a curva</p><h2 id="comparison-sectors-title">Onde se ganha tempo.</h2></div><span className="comparison-panel-hint">Setores da melhor volta de cada piloto</span></div>
          <SectorComparison entries={entries} />
        </section>
      </> : <div className="comparison-empty-state"><span aria-hidden="true">↔</span><h2>Falta companhia na grelha.</h2><p>Seleciona pelo menos dois pilotos para começar a comparação.</p></div>}
      <footer className="comparison-footer"><a href="#pilotos">← Voltar à crew</a><span>Boas voltas. Melhores histórias.</span></footer>
    </div>
  </div>
}

export default DriverComparison
