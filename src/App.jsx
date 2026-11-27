import { Routes, Route } from 'react-router-dom'
import Encabezado from './components/Encabezado'
import Pie from './components/Pie'
import RutaProtegida from './components/RutaProtegida'
import ListadoVacantes from './pages/ListadoVacantes'
import DetalleVacante from './pages/DetalleVacante'
import Login from './pages/Login'
import RegistroCandidato from './pages/RegistroCandidato'
import MisSolicitudes from './pages/MisSolicitudes'
import EmpresaVacantes from './pages/EmpresaVacantes'
import SolicitudesRecibidas from './pages/SolicitudesRecibidas'
import PublicarVacante from './pages/PublicarVacante'
import ActualizarContrasena from './pages/ActualizarContrasena'
import RegistroEmpresa from './pages/RegistroEmpresa'
export default function App() {
return (
<>
<Encabezado />
<main id="principal" className="contenedor">
<Routes>
<Route path="/" element={<ListadoVacantes />} />
<Route path="/vacantes/:id" element={<DetalleVacante />} />
<Route path="/login" element={<Login />} />
<Route path="/registro" element={<RegistroCandidato />} />
<Route path="/mis-solicitudes"
element={<RutaProtegida rol="candidato"><MisSolicitudes /></RutaProtegida>} />
<Route path="/empresa/vacantes"
element={<RutaProtegida rol="empresa"><EmpresaVacantes /></RutaProtegida>} />
<Route
  path="/empresa/solicitudes"
  element={
    <RutaProtegida rol="empresa">
      <SolicitudesRecibidas />
    </RutaProtegida>
  }
/>
<Route
  path="/empresa/publicar"
  element={
    <RutaProtegida rol="empresa">
      <PublicarVacante />
    </RutaProtegida>
  }
/>
<Route
  path="/actualizar-contrasena"
  element={<ActualizarContrasena />}
/>
<Route
  path="/registro-empresa"
  element={<RegistroEmpresa />}
/>
</Routes>
</main>
<Pie />
</>
)
}
