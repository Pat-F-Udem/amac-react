import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Encabezado() {
  const { perfil } = useAuth()
  const navigate = useNavigate()

  async function cerrarSesion() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="encabezado">
      <div className="contenedor encabezado-contenido">

        <Link to="/" className="logo">
          AMAC
        </Link>

        <nav className="navegacion">
          <ul>
            <li>
              <Link to="/">Vacantes</Link>
            </li>

            {perfil ? (
              <>
                <li>
                  <span>Hola, {perfil.nombre}</span>
                </li>

                {perfil.rol === 'candidato' && (
                  <li>
                    <Link to="/mis-solicitudes">
                      Mis solicitudes
                    </Link>
                  </li>
                )}

                {perfil.rol === 'empresa' && (
                  <>
                    <li>
                      <Link to="/empresa/vacantes">
                        Mis vacantes
                      </Link>
                    </li>

                    <li>
                      <Link to="/empresa/solicitudes">
                        Solicitudes recibidas
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <button onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Iniciar sesión</Link>
                </li>

                <li>
                  <Link to="/registro">Registrarse</Link>
                </li>

                <li>
                  <Link to="/registro-empresa">
                    Registrar empresa
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

      </div>
    </header>
  )
}