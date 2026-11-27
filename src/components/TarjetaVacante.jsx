import { Link } from 'react-router-dom'

export default function TarjetaVacante({ vacante }) {
  return (
    <article className="tarjeta-vacante">

      <h2>{vacante.titulo}</h2>

      <p className="empresa">
        {vacante.empresa?.nombre}
      </p>

      <span className="etiqueta">
        {vacante.categoria}
      </span>

      <ul className="datos-vacante">
        <li>
          <strong>Sueldo:</strong>{' '}
          ${Number(vacante.sueldo).toLocaleString('es-MX')} mensuales
        </li>

        <li className="ubicacion">
          <strong>Ubicación:</strong> {vacante.ubicacion}
        </li>

        <li>
          <strong>Horario:</strong> {vacante.horario}
        </li>
      </ul>

      <div className="acciones">
        <Link
          className="boton"
          to={`/vacantes/${vacante.id}`}
        >
          Ver vacante
        </Link>
      </div>

    </article>
  )
}