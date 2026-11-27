import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function DetalleVacante() {
  const { id } = useParams()
  const { sesion } = useAuth()

  const [vacante, setVacante] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarVacante() {
      const { data, error } = await supabase
        .from('vacantes')
        .select('*, empresa:perfiles(nombre)')
        .eq('id', id)
        .single()

      if (!error) {
        setVacante(data)
      }

      setCargando(false)
    }

    cargarVacante()
  }, [id])

  async function postularme() {
    if (!sesion) {
      setMensaje('Inicia sesión para postularte.')
      return
    }

    const { error } = await supabase
      .from('solicitudes')
      .insert({
        vacante_id: vacante.id,
        candidato_id: sesion.user.id
      })

    if (error?.code === '23505') {
      setMensaje('Ya te postulaste a esta vacante.')
    } else if (error) {
      setMensaje('Tu registro aún no ha sido aprobado por AMAC. Por favor espera.')
    } else {
      setMensaje('¡Listo! Tu solicitud fue enviada.')
    }
  }

  if (cargando) {
    return <p role="status">Cargando vacante...</p>
  }

  if (!vacante) {
    return <p>No se encontró la vacante.</p>
  }

  return (
    <section className="seccion">

      <div className="seccion-centrada">
        <h1>Detalle de la vacante</h1>
        <p>Conoce más sobre esta oportunidad laboral.</p>
      </div>

      <article className="tarjeta">

        <header>
          <h2>{vacante.titulo}</h2>

          <p className="empresa">
            {vacante.empresa?.nombre}
          </p>

          <span className="etiqueta">
            {vacante.categoria}
          </span>
        </header>

        <div className="panel">
          <h3>Información general</h3>

          <p>
            <strong>Sueldo:</strong>{' '}
            ${Number(vacante.sueldo).toLocaleString('es-MX')} mensuales
          </p>

          <p>
            <strong>Ubicación:</strong> {vacante.ubicacion}
          </p>

          <p>
            <strong>Horario:</strong> {vacante.horario}
          </p>
        </div>

        <div>
          <h3>Descripción</h3>
          <p>{vacante.descripcion || 'No se especificó una descripción.'}</p>
        </div>

        <div>
          <h3>Requisitos</h3>
          <p>{vacante.requisitos || 'No se especificaron requisitos.'}</p>
        </div>

        <div>
          <h3>Prestaciones</h3>
          <p>{vacante.prestaciones || 'No se especificaron prestaciones.'}</p>
        </div>

        <div className="acciones">

          {vacante.telefono_contacto && (
            <a
              className="boton boton-secundario"
              href={`tel:${vacante.telefono_contacto}`}
            >
              Llamar a la empresa
            </a>
          )}

          <button onClick={postularme}>
            Postularme
          </button>

        </div>

        {mensaje && (
          <p className="mensaje" role="status">
            {mensaje}
          </p>
        )}

      </article>
    </section>
  )
}