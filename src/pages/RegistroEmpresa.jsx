import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RegistroEmpresa() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [nombre, setNombre] = useState('')
  const [giro, setGiro] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function registrar(e) {
    e.preventDefault()
    setMensaje('')
    setCargando(true)

    const { error } = await supabase.auth.signUp({
      email: correo,
      password: contrasena,
      options: {
        data: {
          rol: 'empresa',
          nombre,
          giro,
          telefono
        }
      }
    })

    if (error) {
      console.error('Error al registrar empresa:', error)
      setMensaje('No se pudo completar el registro. Verifica tus datos.')
    } else {
      setMensaje('Registro completado. Ya puedes iniciar sesión.')
      setCorreo('')
      setContrasena('')
      setNombre('')
      setGiro('')
      setTelefono('')
    }

    setCargando(false)
  }

  return (
    <>
      <section className="seccion-centrada">
        <h1>¡Registra tu empresa en AMAC!</h1>
        <p>
          Crea tu cuenta y encuentra personas con experiencia
          que puedan formar parte de tu equipo.
        </p>
      </section>

      <section className="formulario-contenedor">
        <form className="formulario" onSubmit={registrar}>

          <fieldset>
            <legend>Datos de la empresa</legend>

            <div className="formulario-campo">
              <label htmlFor="nombre">
                Nombre de la empresa
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="formulario-campo">
              <label htmlFor="giro">
                Giro de la empresa
              </label>
              <input
                id="giro"
                type="text"
                value={giro}
                onChange={(e) => setGiro(e.target.value)}
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Información de contacto</legend>

            <div className="formulario-campo">
              <label htmlFor="telefono">
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <div className="formulario-campo">
              <label htmlFor="correo">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
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
                minLength="6"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <small>Debe contener al menos 6 caracteres.</small>
            </div>
          </fieldset>

          <button type="submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarme'}
          </button>

          <Link className="boton boton-secundario" to="/login">
            Ya tengo una cuenta
          </Link>

        </form>

        {mensaje && (
          <p className="mensaje" role="status">
            {mensaje}
          </p>
        )}
      </section>
    </>
  )
}