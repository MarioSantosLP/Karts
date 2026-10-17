import { useEffect, useId, useRef, useState } from 'react'

// Custom dropdown so the open list matches the site instead of the OS menu.
function DriverSortMenu({ options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    function closeOnOutsideClick(event) {
      if (!menuRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [open])

  function openMenu() {
    setHighlighted(options.findIndex((option) => option.value === value))
    setOpen(true)
  }

  function choose(option) {
    onChange(option.value)
    setOpen(false)
    buttonRef.current.focus()
  }

  function handleKeyDown(event) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        openMenu()
      }
      return
    }
    if (event.key === 'ArrowDown') setHighlighted((i) => (i + 1) % options.length)
    else if (event.key === 'ArrowUp') setHighlighted((i) => (i - 1 + options.length) % options.length)
    else if (event.key === 'Enter' || event.key === ' ') choose(options[highlighted])
    else if (event.key === 'Escape' || event.key === 'Tab') setOpen(false)
    else return
    if (event.key !== 'Tab') event.preventDefault()
  }

  return (
    <div className="drivers-sort" ref={menuRef}>
      <span id={`${listId}-label`}>Ordenar por</span>
      <div className="sort-menu">
        <button
          ref={buttonRef}
          type="button"
          className={`sort-menu-button${open ? ' is-open' : ''}`}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${listId}-label ${listId}-value`}
          aria-activedescendant={open ? `${listId}-${highlighted}` : undefined}
        >
          <span id={`${listId}-value`}>{selected.label}</span>
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" /></svg>
        </button>
        {open && (
          <ul className="sort-menu-list" id={listId} role="listbox" aria-labelledby={`${listId}-label`}>
            {options.map((option, i) => (
              <li
                key={option.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={option.value === value}
                className={i === highlighted ? 'is-highlighted' : undefined}
                onPointerEnter={() => setHighlighted(i)}
                onClick={() => choose(option)}
              >
                {option.label}
                {option.value === value && <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2.5 6.5 2.5 2.5 4.5-5" /></svg>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default DriverSortMenu
