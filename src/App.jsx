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
</Routes>
</main>
<Pie />
</>
)
}
