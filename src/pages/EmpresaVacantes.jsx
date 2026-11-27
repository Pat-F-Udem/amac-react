import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function EmpresaVacantes() {
  const { perfil } = useAuth()
  const [vacantes, setVacantes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    async function cargarVacantes() {
      if (!perfil) return

      setCargando(true)

      const { data, error } = await supabase
        .from('vacantes')
        .select('*')
        .eq('empresa_id', perfil.id)
        .order('creada_en', { ascending: false })

      if (error) {
        console.error('Error al cargar vacantes:', error)
        setMensaje('No se pudieron cargar las vacantes.')
        setCargando(false)
        return
      }

      const { data: solicitudes, error: errorSolicitudes } = await supabase
        .from('solicitudes')
        .select('vacante_id')

      if (errorSolicitudes) {
        console.error('Error al contar solicitudes:', errorSolicitudes)
        setMensaje('No se pudieron cargar los conteos de solicitudes.')
        setCargando(false)
        return
      }

      const vacantesConConteo = data.map((vacante) => ({
        ...vacante,
        totalSolicitudes: solicitudes.filter(
          (solicitud) => solicitud.vacante_id === vacante.id
        ).length
      }))

      setVacantes(vacantesConConteo)
      setCargando(false)
    }

    cargarVacantes()
  }, [perfil])

  async function cambiarEstado(vacante, nuevoEstado) {
    setMensaje('')
    setActualizando(vacante.id)

    const { error } = await supabase
      .from('vacantes')
      .update({ estado: nuevoEstado })
      .eq('id', vacante.id)
      .eq('empresa_id', perfil.id)

    if (error) {
      console.error('Error al cambiar estado:', error)
      setMensaje('No se pudo actualizar la vacante. Revisa los permisos.')
      setActualizando(null)
      return
    }

    setVacantes((anteriores) =>
      anteriores.map((item) =>
        item.id === vacante.id
          ? { ...item, estado: nuevoEstado }
          : item
      )
    )

    setActualizando(null)
  }

  if (cargando) {
    return <p role="status">Cargando vacantes...</p>
  }

  return (
    <section className="seccion">

      <div className="seccion-centrada">
        <h1>Mis vacantes</h1>
        <p>
          Administra tus publicaciones y consulta
          las solicitudes recibidas.
        </p>

        <Link className="boton" to="/empresa/publicar">
          Publicar nueva vacante
        </Link>
      </div>

      {mensaje && (
        <p className="mensaje" role="alert">
          {mensaje}
        </p>
      )}

      {vacantes.length === 0 ? (
        <div className="panel">
          <h2>Aún no has publicado vacantes</h2>
          <p>
            Publica una oportunidad laboral para comenzar
            a recibir solicitudes.
          </p>
        </div>
      ) : (
        <div className="rejilla-vacantes">

          {vacantes.map((vacante) => (
            <article className="tarjeta-vacante" key={vacante.id}>

              <h2>{vacante.titulo}</h2>

              <p>
                <strong>Sueldo:</strong>{' '}
                ${Number(vacante.sueldo).toLocaleString('es-MX')} mensuales
              </p>

              <p className="ubicacion">
                <strong>Ubicación:</strong> {vacante.ubicacion}
              </p>

              <p>
                <strong>Horario:</strong> {vacante.horario}
              </p>

              <p>
                <strong>Estado:</strong>{' '}
                <span className="estado">
                  {vacante.estado}
                </span>
              </p>

              <div className="panel">
                <p>
                  <strong>Solicitudes recibidas:</strong>{' '}
                  {vacante.totalSolicitudes}
                </p>

                <Link to="/empresa/solicitudes">
                  Ver solicitudes
                </Link>
              </div>

              <div className="acciones">

                {vacante.estado === 'activa' && (
                  <button
                    className="boton-secundario"
                    onClick={() => cambiarEstado(vacante, 'pausada')}
                    disabled={actualizando === vacante.id}
                  >
                    {actualizando === vacante.id ? 'Actualizando...' : 'Pausar'}
                  </button>
                )}

                {vacante.estado === 'pausada' && (
                  <button
                    onClick={() => cambiarEstado(vacante, 'activa')}
                    disabled={actualizando === vacante.id}
                  >
                    {actualizando === vacante.id ? 'Actualizando...' : 'Reactivar'}
                  </button>
                )}

                {vacante.estado !== 'cerrada' && (
                  <button
                    className="boton-peligro"
                    onClick={() => {
                      if (window.confirm('¿Seguro que deseas cerrar esta vacante?')) {
                        cambiarEstado(vacante, 'cerrada')
                      }
                    }}
                    disabled={actualizando === vacante.id}
                  >
                    {actualizando === vacante.id
                      ? 'Actualizando...'
                      : 'Cerrar vacante'}
                  </button>
                )}

              </div>

            </article>
          ))}

        </div>
      )}
    </section>
  )
}