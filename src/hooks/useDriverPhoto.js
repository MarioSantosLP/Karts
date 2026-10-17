import { useSyncExternalStore } from 'react'

const prefix = 'apex-crew:driver-photo:v1:'
const changeEvent = 'apex-driver-photo-change'

function subscribe(listener) {
  window.addEventListener(changeEvent, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(changeEvent, listener)
    window.removeEventListener('storage', listener)
  }
}

function readPhoto(driverId) {
  try {
    const photo = localStorage.getItem(prefix + driverId)
    return photo?.startsWith('data:image/jpeg;base64,') ? photo : null
  } catch {
    return null
  }
}

export function useDriverPhoto(driverId) {
  const photo = useSyncExternalStore(subscribe, () => readPhoto(driverId), () => null)

  function savePhoto(value) {
    if (value) localStorage.setItem(prefix + driverId, value)
    else localStorage.removeItem(prefix + driverId)
    window.dispatchEvent(new Event(changeEvent))
  }

  return [photo, savePhoto]
}
