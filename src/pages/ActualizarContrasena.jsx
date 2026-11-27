import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function ActualizarContrasena() {
  const [contrasena, setContrasena] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function actualizar(e) {
    e.preventDefault()
    setMensaje('')

    if (contrasena !== confirmacion) {
      setMensaje('Las contraseñas no coinciden.')
      return
    }

    if (contrasena.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setCargando(true)

    const { error } = await supabase.auth.updateUser({
      password: contrasena
    })

    if (error) {
      setMensaje(error.message)
      setCargando(false)
      return
    }

    setMensaje('Tu contraseña se actualizó correctamente.')
    setCargando(false)

    setTimeout(() => navigate('/'), 2000)
  }

  return (
    <section>
      <h1>Actualizar contraseña</h1>

      <form onSubmit={actualizar}>
        <label htmlFor="contrasena">
          Nueva contraseña
        </label>
        <input
          id="contrasena"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          minLength="6"
          required
        />

        <label htmlFor="confirmacion">
          Confirmar contraseña
        </label>
        <input
          id="confirmacion"
          type="password"
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
          minLength="6"
          required
        />

        <button type="submit" disabled={cargando}>
          {cargando ? 'Actualizando...' : 'Guardar contraseña'}
        </button>
      </form>

      {mensaje && <p role="alert">{mensaje}</p>}
    </section>
  )
}