import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function iniciarSesion(e) {
    e.preventDefault()
    setMensaje('')
    setCargando(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena
    })

    if (error) {
      console.error('Error al iniciar sesión:', error)
      setMensaje(error.message)
    } else {
      navigate('/')
    }

    setCargando(false)
  }

  async function recuperarContrasena() {
    setMensaje('')

    if (!correo) {
      setMensaje('Primero escribe tu correo electrónico.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(correo, {
      redirectTo: `${window.location.origin}/actualizar-contrasena`
    })

    if (error) {
      setMensaje(error.message)
    } else {
      setMensaje('Te enviamos un enlace para restablecer tu contraseña.')
    }
  }

  return (
    <>
      <section className="seccion-centrada">
        <h1>¡Bienvenido a AMAC!</h1>
        <p>
          Inicia sesión para encontrar nuevas oportunidades laborales.
        </p>
      </section>

      <section className="formulario-contenedor">
        <form className="formulario" onSubmit={iniciarSesion}>

          <div className="formulario-campo">
            <label htmlFor="correo">
              Correo electrónico
            </label>

            <input
              id="correo"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="formulario-campo">
            <label htmlFor="contrasena">
              Contraseña
            </label>

            <input
              id="contrasena"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

        </form>

        <div className="acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={recuperarContrasena}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <p>
          ¿Aún no tienes cuenta?{' '}
          <Link to="/registro">Regístrate aquí</Link>
        </p>

        <p>
          ¿Tienes una empresa?{' '}
          <Link to="/registro-empresa">
            Registra tu empresa
          </Link>
        </p>

        {mensaje && (
          <p className="mensaje" role="alert">
            {mensaje}
          </p>
        )}
      </section>
    </>
  )
}