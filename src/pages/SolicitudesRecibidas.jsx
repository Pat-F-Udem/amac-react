import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function SolicitudesRecibidas() {
  const { perfil } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    async function cargarSolicitudes() {
      if (!perfil) return

      const { data, error } = await supabase
        .from('solicitudes')
        .select(`
          id,
          estatus,
          creada_en,
          vacante:vacantes(titulo),
          candidato:perfiles(nombre, edad, colonia, experiencia)
        `)
        .neq('estatus', 'Cancelada')
        .order('creada_en', { ascending: false })

      if (error) {
        console.error('Error al cargar solicitudes:', error)
        setMensaje('No se pudieron cargar las solicitudes.')
      } else {
        setSolicitudes(data)
      }

      setCargando(false)
    }

    cargarSolicitudes()
  }, [perfil])

  async function cambiarEstatus(solicitud, nuevoEstatus) {
    setMensaje('')
    setActualizando(solicitud.id)

    const { error } = await supabase
      .from('solicitudes')
      .update({ estatus: nuevoEstatus })
      .eq('id', solicitud.id)

    if (error) {
      console.error('Error al cambiar estatus:', error)
      setMensaje('No se pudo actualizar el estatus de la solicitud.')
      setActualizando(null)
      return
    }

    setSolicitudes((actuales) =>
      actuales.map((s) =>
        s.id === solicitud.id
          ? { ...s, estatus: nuevoEstatus }
          : s
      )
    )

    setActualizando(null)
  }

  if (cargando) {
    return <p role="status">Cargando solicitudes...</p>
  }

  return (
    <section className="seccion">

      <div className="seccion-centrada">
        <h1>Solicitudes recibidas</h1>
        <p>
          Consulta los perfiles de las personas interesadas
          en tus oportunidades laborales.
        </p>
      </div>

      {mensaje && (
        <p className="mensaje" role="alert">
          {mensaje}
        </p>
      )}

      {solicitudes.length === 0 ? (
        <div className="panel">
          <h2>No hay solicitudes recibidas</h2>
          <p>
            Cuando alguien se postule a tus vacantes,
            podrás consultar aquí sus datos.
          </p>
        </div>
      ) : (
        <div className="rejilla-vacantes">

          {solicitudes.map((solicitud) => (
            <article className="tarjeta" key={solicitud.id}>

              <h2>{solicitud.vacante?.titulo}</h2>

              <span className="etiqueta">
                {solicitud.estatus}
              </span>

              <div className="panel">
                <h3>Datos del candidato</h3>

                <p>
                  <strong>Nombre:</strong>{' '}
                  {solicitud.candidato?.nombre || 'No disponible'}
                </p>

                <p>
                  <strong>Edad:</strong>{' '}
                  {solicitud.candidato?.edad ?? 'No especificada'}
                </p>

                <p>
                  <strong>Colonia:</strong>{' '}
                  {solicitud.candidato?.colonia || 'No especificada'}
                </p>

                <p>
                  <strong>Experiencia:</strong>{' '}
                  {solicitud.candidato?.experiencia || 'No especificada'}
                </p>
              </div>

              <p>
                <strong>Fecha de solicitud:</strong>{' '}
                {new Date(solicitud.creada_en).toLocaleDateString('es-MX')}
              </p>

              <div className="formulario-campo">
                <label htmlFor={`estatus-${solicitud.id}`}>
                  Cambiar estatus
                </label>

                <select
                  id={`estatus-${solicitud.id}`}
                  value={solicitud.estatus}
                  onChange={(e) =>
                    cambiarEstatus(solicitud, e.target.value)
                  }
                  disabled={actualizando === solicitud.id}
                >
                  <option value="Enviada">Enviada</option>
                  <option value="En revisión">En revisión</option>
                  <option value="Aceptada">Aceptada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>

              {actualizando === solicitud.id && (
                <p role="status">Actualizando estatus...</p>
              )}

            </article>
          ))}

        </div>
      )}
    </section>
  )
}