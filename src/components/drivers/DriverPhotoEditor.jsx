import { useRef, useState } from 'react'
import { useDriverPhoto } from '../../hooks/useDriverPhoto'

function preparePhoto(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      try {
        const scale = Math.min(1, 900 / Math.max(image.naturalWidth, image.naturalHeight))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Image conversion unavailable')
        context.fillStyle = '#101c2b'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', .85))
      } catch (error) {
        reject(error)
      } finally {
        URL.revokeObjectURL(url)
      }
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Invalid image'))
    }
    image.src = url
  })
}

function DriverPhotoEditor({ driver }) {
  const [photo, savePhoto] = useDriverPhoto(driver.id)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const input = useRef(null)

  async function uploadPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage('Escolhe uma foto JPG, PNG ou WebP.')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessage('A foto deve ter até 8 MB.')
      return
    }
    setBusy(true)
    setMessage('')
    try {
      const prepared = await preparePhoto(file)
      savePhoto(prepared)
      setMessage('Foto atualizada neste navegador.')
    } catch {
      setMessage('Não foi possível guardar a foto. Tenta outra imagem ou verifica o espaço do navegador.')
    } finally {
      setBusy(false)
    }
  }

  function removePhoto() {
    try {
      savePhoto(null)
      setMessage('Foto removida.')
    } catch {
      setMessage('Não foi possível remover a foto neste navegador.')
    }
  }

  return (
    <div className="driver-photo-editor">
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} aria-label={`Escolher foto de ${driver.name}`} className="photo-file-input" tabIndex={-1} />
      <div className="photo-editor-actions">
        <button className="photo-upload-button" type="button" onClick={() => input.current?.click()} disabled={busy}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 6 2-3h4l2 3h4v14H4V6h4Z" /><circle cx="12" cy="12" r="4" /></svg>
          {busy ? 'A guardar…' : photo ? 'Alterar foto' : 'Adicionar foto'}
        </button>
        {photo && <button className="photo-remove-button" type="button" onClick={removePhoto} disabled={busy} aria-label={`Remover foto de ${driver.name}`}>Remover</button>}
      </div>
      <p className="photo-storage-note">JPG, PNG ou WebP · até 8 MB. Guardada neste navegador.</p>
      <p className="photo-feedback" role="status">{message}</p>
    </div>
  )
}

export default DriverPhotoEditor
