import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import TarjetaVacante from '../components/TarjetaVacante'

export default function ListadoVacantes() {
  const [vacantes, setVacantes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [horario, setHorario] = useState('')
  const [categoria, setCategoria] = useState('')
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      setCargando(true)

      let consulta = supabase
        .from('vacantes')
        .select('*, empresa:perfiles(nombre)')
        .eq('estado', 'activa')
        .order('creada_en', { ascending: false })

      if (busqueda) {
        consulta = consulta.or(
          `titulo.ilike.%${busqueda}%,ubicacion.ilike.%${busqueda}%`
        )
      }

      if (horario) {
        consulta = consulta.eq('horario', horario)
      }

      if (categoria) {
        consulta = consulta.eq('categoria', categoria)
      }

      const { data, error } = await consulta

      if (!error) {
        setVacantes(data)
      }

      setCargando(false)
    }

    cargar()
  }, [busqueda, horario, categoria])

  useEffect(() => {
    async function cargarCategorias() {
      const { data, error } = await supabase
        .from('vacantes')
        .select('categoria')
        .eq('estado', 'activa')

      if (!error && data) {
        const categoriasUnicas = [
          ...new Set(data.map(v => v.categoria).filter(Boolean))
        ]

        setCategorias(categoriasUnicas)
      }
    }

    cargarCategorias()
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero-contenido">
          <div>
            <h1>Encuentra nuevas oportunidades laborales</h1>

            <p>
              En AMAC conectamos a personas con experiencia
              con empresas que valoran su talento y conocimientos.
            </p>

            <a href="#vacantes" className="boton">
              Explorar vacantes
            </a>
          </div>

          <div className="hero-imagen">
            <h2>Tu experiencia tiene valor</h2>
            <p>
              Descubre oportunidades para continuar
              desarrollándote profesionalmente.
            </p>
          </div>
        </div>
      </section>

      <section className="buscador">
        <div className="filtros">
          <div className="formulario-campo">
            <label htmlFor="busqueda">Buscar vacante</label>
            <input
              id="busqueda"
              type="text"
              placeholder="Buscar por puesto o ubicación"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="formulario-campo">
            <label htmlFor="horario">Filtrar por horario</label>
            <select
              id="horario"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            >
              <option value="">Todos los horarios</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Medio tiempo">Medio tiempo</option>
              <option value="Fines de semana">Fines de semana</option>
            </select>
          </div>

          <div className="formulario-campo">
            <label htmlFor="categoria">Filtrar por categoría</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>

              {categorias.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="seccion" id="vacantes">
        <div className="seccion-centrada">
          <h2>Oportunidades laborales</h2>
          <p>
            Explora las vacantes disponibles y encuentra
            una oportunidad que se adapte a ti.
          </p>
        </div>

        {cargando && (
          <p role="status">Cargando vacantes…</p>
        )}

        {!cargando && vacantes.length === 0 && (
          <p>No hay vacantes para mostrar.</p>
        )}

        <div className="rejilla-vacantes">
          {vacantes.map(v => (
            <TarjetaVacante key={v.id} vacante={v} />
          ))}
        </div>
      </section>

      <section className="seccion">
        <div className="panel">
          <h2>¿Tienes una empresa?</h2>

          <p>
            Publica tus oportunidades laborales y conecta
            con personas que pueden aportar su experiencia
            y talento a tu organización.
          </p>

          <Link to="/registro-empresa" className="boton">
            Registrar empresa
          </Link>
        </div>
      </section>
    </>
  )
}