import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function PublicarVacante() {
  const { perfil } = useAuth()
  const navigate = useNavigate()

  const [titulo, setTitulo] = useState('')
  const [sueldo, setSueldo] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [horario, setHorario] = useState('Matutino')
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [requisitos, setRequisitos] = useState('')
  const [prestaciones, setPrestaciones] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function publicar(e) {
    e.preventDefault()
    setMensaje('')

    if (!perfil) {
      setMensaje('No se encontró el perfil de la empresa.')
      return
    }

    setCargando(true)

    const { error } = await supabase
      .from('vacantes')
      .insert({
        empresa_id: perfil.id,
        titulo,
        sueldo: Number(sueldo),
        ubicacion,
        horario,
        categoria,
        descripcion,
        requisitos,
        prestaciones,
        telefono_contacto: telefono.trim() || null
      })

    if (error) {
      console.error('Error al publicar:', error)
      setMensaje('No se pudo publicar la vacante. Verifica los datos y permisos.')
      setCargando(false)
      return
    }

    navigate('/empresa/vacantes')
  }

  return (
    <>
      <section className="seccion-centrada">
        <h1>Publicar nueva vacante</h1>
        <p>
          Comparte una oportunidad laboral y encuentra
          personas con experiencia para tu empresa.
        </p>
      </section>

      <section className="formulario-contenedor">

        <form className="formulario" onSubmit={publicar}>

          <fieldset>
            <legend>Información general</legend>

            <div className="formulario-campo">
              <label htmlFor="titulo">
                Título de la vacante
              </label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="formulario-campo">
              <label htmlFor="categoria">Categoría</label>
              <input
                id="categoria"
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              />
            </div>

            <div className="formulario-campo">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                rows="4"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Condiciones laborales</legend>

            <div className="formulario-campo">
              <label htmlFor="sueldo">Sueldo mensual</label>
              <input
                id="sueldo"
                type="number"
                min="0.01"
                step="0.01"
                value={sueldo}
                onChange={(e) => setSueldo(e.target.value)}
                required
              />
            </div>

            <div className="formulario-campo">
              <label htmlFor="ubicacion">Ubicación</label>
              <input
                id="ubicacion"
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                required
              />
            </div>

            <div className="formulario-campo">
              <label htmlFor="horario">Horario</label>
              <select
                id="horario"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                required
              >
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Medio tiempo">Medio tiempo</option>
                <option value="Fines de semana">Fines de semana</option>
              </select>
            </div>
          </fieldset>

          <fieldset>
            <legend>Requisitos y prestaciones</legend>

            <div className="formulario-campo">
              <label htmlFor="requisitos">Requisitos</label>
              <textarea
                id="requisitos"
                rows="4"
                value={requisitos}
                onChange={(e) => setRequisitos(e.target.value)}
                required
              />
            </div>

            <div className="formulario-campo">
              <label htmlFor="prestaciones">Prestaciones</label>
              <textarea
                id="prestaciones"
                rows="4"
                value={prestaciones}
                onChange={(e) => setPrestaciones(e.target.value)}
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Información de contacto</legend>

            <div className="formulario-campo">
              <label htmlFor="telefono">
                Teléfono de contacto (opcional)
              </label>
              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
              <small>
                Si proporcionas un teléfono, los candidatos
                podrán comunicarse directamente con tu empresa.
              </small>
            </div>
          </fieldset>

          <button type="submit" disabled={cargando}>
            {cargando ? 'Publicando...' : 'Publicar vacante'}
          </button>

        </form>

        {mensaje && (
          <p className="mensaje" role="alert">
            {mensaje}
          </p>
        )}

      </section>
    </>
  )
}