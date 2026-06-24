import {

  Routes,

  Route,

  Navigate

} from 'react-router-dom'

import SidebarNav from '../components/SidebarNav'

import { sembrarDatosDemo } from '../services/seedDemoData'

import Datos from './Datos'

import EjerciciosEstres from '../ejercicios/EjerciciosEstres'

import EstadoAnimo from '../estadoAnimo/EstadoAnimo'

import HistorialPage from '../historial/HistorialPage'

import Perfil from '../perfil/Perfil'

import ChatPage from '../chat/ChatPage'



import './Dashboard.css'
import '../styles/app-ui.css'



function DashboardApp() {

  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuario') || 'null'
    ) as { id_usuario?: number } | null

    if (usuario?.id_usuario) {
      sembrarDatosDemo(usuario.id_usuario)
    }
  } catch {
    /* ignorar */
  }

  const cerrarSesion = () => {



    localStorage.removeItem(

      'usuario'

    )



    window.location.href =

      '/'



  }



  return (



    <div className="dashboard-layout">



      <SidebarNav

        onLogout={cerrarSesion}

      />



      <main className="dashboard-main">



        <Routes>



          <Route

            index

            element={

              <Navigate

                to="inicio"

                replace

              />

            }

          />



          <Route

            path="inicio"

            element={<Datos />}

          />



          <Route

            path="ejercicios"

            element={

              <EjerciciosEstres />

            }

          />



          <Route

            path="estado-animo"

            element={<EstadoAnimo />}

          />



          <Route

            path="historial"

            element={<HistorialPage />}

          />



          <Route

            path="asistente"

            element={<ChatPage />}

          />



          <Route

            path="perfil"

            element={<Perfil />}

          />



        </Routes>



      </main>



    </div>



  )



}



export default DashboardApp


