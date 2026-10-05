import { useRef, useState } from 'react'
import './App.css'

type Status = { type: 'idle' | 'busy' | 'ok' | 'error'; message: string }

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' })
  const [uploaded, setUploaded] = useState<string[]>([])

  function pick(selected: FileList | null) {
    if (!selected) return
    setFiles(Array.from(selected))
    setStatus({ type: 'idle', message: '' })
  }

  async function upload() {
    if (!files.length) return
    const form = new FormData()
    files.forEach((file) => form.append('files', file))
    setStatus({ type: 'busy', message: `Uploading ${files.length} file(s)…` })
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      const data = (await res.json()) as { files: string[] }
      setUploaded(data.files)
      setStatus({ type: 'ok', message: `Uploaded ${data.files.length} file(s).` })
      setFiles([])
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Upload failed',
      })
    }
  }

  return (
    <main className="card">
      <h1>Uploads</h1>
      <p className="hint">
        Files land in the shared <code>uploads</code> folder.
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => pick(e.target.files)}
      />
      <button
        className="pick"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        Select files
      </button>

      {files.length > 0 && (
        <ul className="filelist">
          {files.map((file) => (
            <li key={file.name}>
              <span>{file.name}</span>
              <span className="size">{(file.size / 1024).toFixed(1)} KB</span>
            </li>
          ))}
        </ul>
      )}

      <button
        className="send"
        type="button"
        disabled={!files.length || status.type === 'busy'}
        onClick={upload}
      >
        {status.type === 'busy' ? 'Uploading…' : 'Upload'}
      </button>

      {status.message && (
        <p className={`status ${status.type}`}>{status.message}</p>
      )}

      {uploaded.length > 0 && (
        <ul className="saved">
          {uploaded.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
