import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function MisSolicitudes() {
  const { sesion } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [cancelando, setCancelando] = useState(null)

  useEffect(() => {
    async function cargarSolicitudes() {
      if (!sesion) return

      const { data, error } = await supabase
        .from('solicitudes')
        .select('id, estatus, creada_en, vacante:vacantes(titulo, empresa:perfiles(nombre))')
        .eq('candidato_id', sesion.user.id)
        .order('creada_en', { ascending: false })

      if (error) {
        console.error('Error al cargar solicitudes:', error)
        setMensaje('No se pudieron cargar tus solicitudes.')
      } else {
        setSolicitudes(data)
      }

      setCargando(false)
    }

    cargarSolicitudes()
  }, [sesion])

  async function cancelarSolicitud(solicitud) {
    const puedeCancelar =
      solicitud.estatus === 'Enviada' ||
      solicitud.estatus === 'En revisión'

    if (!puedeCancelar) return

    const confirmar = window.confirm(
      '¿Seguro que quieres cancelar esta solicitud?'
    )

    if (!confirmar) return

    setMensaje('')
    setCancelando(solicitud.id)

    const { error } = await supabase
      .from('solicitudes')
      .update({ estatus: 'Cancelada' })
      .eq('id', solicitud.id)

    if (error) {
      console.error('Error al cancelar solicitud:', error)
      setMensaje('No se pudo cancelar la solicitud.')
      setCancelando(null)
      return
    }

    setSolicitudes((actuales) =>
      actuales.map((s) =>
        s.id === solicitud.id
          ? { ...s, estatus: 'Cancelada' }
          : s
      )
    )

    setCancelando(null)
  }

  if (cargando) {
    return <p role="status">Cargando solicitudes...</p>
  }

  return (
    <section className="seccion">

      <div className="seccion-centrada">
        <h1>Mis solicitudes</h1>
        <p>
          Consulta el estado de tus postulaciones
          y revisa tus oportunidades laborales.
        </p>
      </div>

      {mensaje && (
        <p className="mensaje" role="alert">
          {mensaje}
        </p>
      )}

      {solicitudes.length === 0 ? (
        <div className="panel">
          <h2>Aún no tienes solicitudes</h2>
          <p>
            Cuando te postules a una vacante,
            podrás consultar aquí su estado.
          </p>
        </div>
      ) : (
        <div className="rejilla-vacantes">

          {solicitudes.map((solicitud) => {
            const puedeCancelar =
              solicitud.estatus === 'Enviada' ||
              solicitud.estatus === 'En revisión'

            return (
              <article className="tarjeta" key={solicitud.id}>

                <h2>{solicitud.vacante?.titulo}</h2>

                <p className="empresa">
                  {solicitud.vacante?.empresa?.nombre}
                </p>

                <p>
                  <strong>Estado:</strong>{' '}
                  <span className="estado">
                    {solicitud.estatus}
                  </span>
                </p>

                <p>
                  <strong>Fecha de solicitud:</strong>{' '}
                  {new Date(solicitud.creada_en).toLocaleDateString('es-MX')}
                </p>

                {puedeCancelar ? (
                  <button
                    className="boton-peligro"
                    onClick={() => cancelarSolicitud(solicitud)}
                    disabled={cancelando === solicitud.id}
                  >
                    {cancelando === solicitud.id
                      ? 'Cancelando...'
                      : 'Cancelar solicitud'}
                  </button>
                ) : (
                  <p>
                    {solicitud.estatus === 'Aceptada' ||
                    solicitud.estatus === 'Rechazada'
                      ? 'Esta solicitud ya no se puede cancelar.'
                      : 'Esta solicitud ya fue cancelada.'}
                  </p>
                )}

              </article>
            )
          })}

        </div>
      )}
    </section>
  )
}