import { useEffect, useId, useRef, useState } from 'react'
import './SelectMenu.css'

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT')
}

function SelectMenu({ id, labelId, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const [placement, setPlacement] = useState({ side: 'below', height: 330 })
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const searchRef = useRef({ text: '', time: 0 })
  const listId = useId()
  const valueId = `${listId}-value`
  const selected = options.find((option) => option.value === value)
  const enabled = options.flatMap((option, index) => option.disabled ? [] : [index])

  useEffect(() => {
    if (!open) return
    const closeOutside = (event) => {
      if (!rootRef.current.contains(event.target)) setOpen(false)
    }
    const closeOnResize = () => setOpen(false)
    document.addEventListener('pointerdown', closeOutside)
    window.addEventListener('resize', closeOnResize)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      window.removeEventListener('resize', closeOnResize)
    }
  }, [open])

  useEffect(() => {
    if (!open || !listRef.current) return
    const list = listRef.current
    const option = list.children[highlighted]
    if (!option) return
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight
    }
  }, [open, highlighted])

  function openMenu(index) {
    const rect = triggerRef.current.getBoundingClientRect()
    const below = window.innerHeight - rect.bottom - 14
    const topBoundary = Math.max(12, Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
    const above = Math.max(0, rect.top - topBoundary - 14)
    const side = below < Math.min(options.length * 42 + 12, 220) && above > below ? 'above' : 'below'
    setPlacement({ side, height: Math.max(100, Math.min(330, side === 'above' ? above : below)) })
    const selectedIndex = options.findIndex((option) => option.value === value && !option.disabled)
    setHighlighted(index ?? (selectedIndex >= 0 ? selectedIndex : enabled[0] ?? 0))
    setOpen(true)
  }

  function choose(index) {
    const option = options[index]
    if (!option || option.disabled) return
    onChange(option.value)
    setOpen(false)
    triggerRef.current.focus()
  }

  function handleKeyDown(event) {
    if (event.key === 'Tab') {
      setOpen(false)
      return
    }
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      searchRef.current = { text: '', time: 0 }
      if (!open) {
        openMenu(event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled.at(-1) : undefined)
      } else if (event.key === 'Enter' || event.key === ' ') choose(highlighted)
      else if (event.key === 'Home') setHighlighted(enabled[0] ?? 0)
      else if (event.key === 'End') setHighlighted(enabled.at(-1) ?? 0)
      else {
        const direction = event.key === 'ArrowDown' ? 1 : -1
        const current = enabled.indexOf(highlighted)
        setHighlighted(enabled[(current + direction + enabled.length) % enabled.length] ?? 0)
      }
      return
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      const now = Date.now()
      const text = now - searchRef.current.time < 700 ? searchRef.current.text + event.key : event.key
      searchRef.current = { text, time: now }
      const match = enabled.find((index) => normalize(options[index].label).includes(normalize(text)))
      if (match !== undefined) {
        if (!open) openMenu(match)
        else setHighlighted(match)
      }
    }
  }

  return <div className={`select-menu${open ? ' is-open' : ''}`} ref={rootRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }} style={{ '--select-menu-height': `${placement.height}px` }}>
    <button id={id} ref={triggerRef} type="button" role="combobox" className="select-menu-trigger" aria-expanded={open} aria-haspopup="listbox" aria-controls={listId} aria-labelledby={`${labelId} ${valueId}`} aria-activedescendant={open ? `${listId}-${highlighted}` : undefined} onKeyDown={handleKeyDown} onClick={() => open ? setOpen(false) : openMenu()}>
      <span id={valueId}>{selected?.label ?? 'Selecionar'}</span>
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
    </button>
    {open && <ul ref={listRef} id={listId} className={`select-menu-options opens-${placement.side}`} role="listbox" aria-labelledby={labelId}>
      {options.map((option, index) => <li id={`${listId}-${index}`} key={option.value} role="option" aria-selected={option.value === value} aria-disabled={option.disabled || undefined} className={`select-menu-option${highlighted === index ? ' is-highlighted' : ''}`} onPointerEnter={() => { if (!option.disabled) setHighlighted(index) }} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(index)}>
        <span>{option.label}</span>
        {option.disabled ? <small>Em comparação</small> : option.value === value ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg> : null}
      </li>)}
    </ul>}
  </div>
}

export default SelectMenu
