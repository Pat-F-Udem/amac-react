import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RegistroCandidato() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [edad, setEdad] = useState('')
  const [colonia, setColonia] = useState('')
  const [experiencia, setExperiencia] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function registrar(e) {
    e.preventDefault()
    setMensaje('')

    if (!aceptaTerminos) {
      setMensaje('Debes aceptar los términos y condiciones para registrarte.')
      return
    }

    setCargando(true)

    const { error } = await supabase.auth.signUp({
      email: correo,
      password: contrasena,
      options: {
        data: {
          rol: 'candidato',
          nombre,
          telefono,
          edad: Number(edad),
          colonia,
          experiencia
        }
      }
    })

    if (error) {
      setMensaje('No se pudo completar el registro. Verifica tus datos.')
    } else {
      setMensaje('Registro completado. Ya puedes iniciar sesión.')
    }

    setCargando(false)
  }

  return (
    <>
      <section className="seccion-centrada">
        <h1>¡Únete a AMAC!</h1>
        <p>
          Crea tu cuenta y encuentra nuevas oportunidades laborales.
        </p>
      </section>

      <section className="formulario-contenedor">
        <form className="formulario" onSubmit={registrar}>

          <fieldset>
            <legend>Datos personales</legend>

            <div className="formulario-campo">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="formulario-campo">
              <label htmlFor="edad">Edad</label>
              <input
                id="edad"
                type="number"
                min="18"
                max="120"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Información de contacto</legend>

            <div className="formulario-campo">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="formulario-campo">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <div className="formulario-campo">
              <label htmlFor="contrasena">Contraseña</label>
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

          <fieldset>
            <legend>Domicilio</legend>

            <div className="formulario-campo">
              <label htmlFor="colonia">Colonia</label>
              <input
                id="colonia"
                type="text"
                value={colonia}
                onChange={(e) => setColonia(e.target.value)}
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Experiencia laboral</legend>

            <div className="formulario-campo">
              <label htmlFor="experiencia">
                Describe tu experiencia laboral
              </label>
              <textarea
                id="experiencia"
                rows="4"
                value={experiencia}
                onChange={(e) => setExperiencia(e.target.value)}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Términos y condiciones</legend>

            <div className="formulario-checkbox">
              <input
                id="terminos"
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                required
              />

              <label htmlFor="terminos">
                Acepto los términos y condiciones.
              </label>
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