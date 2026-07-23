import {
  useState
} from 'react'

import {
  useLocation
} from 'react-router-dom'

import {
  obtenerUsuarioSesion
} from '../../utils/sesionUsuario'

import {
  normalizarEstadoSuscripcion
} from '../../functions/meditacionF/meditacionTypes'

import type {
  VistaMeditacion
} from '../../functions/meditacionF/meditacionTypes'

import {
  useEstadoMeditacion
} from '../../functions/meditacionF/useEstadoMeditacion'

import GuiaMeditacion from './components/GuiaMeditacion'

import HistorialMeditacion from './components/HistorialMeditacion'

import HistorialPremiumBloqueado from './components/HistorialPremiumBloqueado'

import TabsMeditacion from './components/TabsMeditacion'

import TemporizadorMeditacion from './components/TemporizadorMeditacion'

import './Meditacion.css'
import './PremiumMeditacionAcciones.css'

interface MeditacionProps {
  onIrSuscripcion: (
    vista: VistaMeditacion
  ) => void
}

function esVistaMeditacion(
  valor: unknown
): valor is VistaMeditacion {
  return (
    valor === 'temporizador' ||
    valor === 'guia' ||
    valor === 'historial'
  )
}

function Meditacion({
  onIrSuscripcion
}: MeditacionProps) {
  const location =
    useLocation()

  const estadoNavegacion =
    location.state as {
      vistaMeditacion?: unknown
    } | null

  const vistaInicial =
    esVistaMeditacion(
      estadoNavegacion
        ?.vistaMeditacion
    )
      ? estadoNavegacion
        .vistaMeditacion
      : 'temporizador'
  const [
    vistaActiva,
    setVistaActiva
  ] = useState<VistaMeditacion>(
    vistaInicial
  )

  const usuario =
    obtenerUsuarioSesion()

  const idUsuario =
    usuario?.id_usuario ?? null

  const {
    estadoMeditacion,
    cargandoEstado,
    errorEstado,
    cargarEstado,
    actualizarEstadoMeditacion
  } = useEstadoMeditacion(
    idUsuario
  )

  const estadoLocal =
    normalizarEstadoSuscripcion(
      usuario?.estado_suscripcion
    )

  /*
   * El estado recibido desde el servidor
   * tiene prioridad sobre el localStorage.
   */
  const esPremium =
    estadoMeditacion?.esPremium ??
    (
      estadoLocal === 'premium'
    )

  const premiumConfirmado =
    estadoMeditacion?.esPremium === true

  const textoPlan =
    cargandoEstado &&
    !estadoMeditacion
      ? 'Consultando'
      : esPremium
        ? 'Premium'
        : 'Free'

  /*
   * Si no existe un ID válido, se detiene
   * el renderizado del módulo.
   */
  if (
    idUsuario === null ||
    idUsuario <= 0
  ) {
    return (
      <div className="meditacion-page">
        <div className="meditacion-contenedor">
          <section className="meditacion-panel">
            <div className="meditacion-panel-icono">
              ⚠️
            </div>

            <div className="meditacion-panel-contenido">
              <span className="meditacion-panel-etiqueta">
                Sesión requerida
              </span>

              <h2>
                No se encontró un usuario
                activo
              </h2>

              <p>
                Cierra la sesión actual y
                vuelve a iniciar para usar
                el módulo de Meditación.
              </p>
            </div>
          </section>
        </div>
      </div>
    )
  }

  /*
   * Después de la validación anterior,
   * esta constante siempre será number.
   */
  const idUsuarioSeguro: number =
    idUsuario

  function renderHistorial() {
    if (
      cargandoEstado &&
      !estadoMeditacion
    ) {
      return (
        <section className="meditacion-panel">
          <div className="meditacion-panel-icono">
            ◷
          </div>

          <div className="meditacion-panel-contenido">
            <span className="meditacion-panel-etiqueta">
              Consultando cuenta
            </span>

            <h2>
              Comprobando el acceso al
              historial
            </h2>

            <p>
              Espera un momento mientras
              validamos tu plan directamente
              con el servidor.
            </p>
          </div>
        </section>
      )
    }

    if (
      errorEstado &&
      !estadoMeditacion
    ) {
      return (
        <section className="meditacion-panel">
          <div className="meditacion-panel-icono">
            ⚠️
          </div>

          <div className="meditacion-panel-contenido">
            <span className="meditacion-panel-etiqueta">
              No fue posible validar el plan
            </span>

            <h2>
              El historial está temporalmente
              deshabilitado
            </h2>

            <p>
              {errorEstado}
            </p>

            <div className="meditacion-limites-resumen">
              <button
                type="button"
                onClick={() => {
                  void cargarEstado()
                }}
              >
                Reintentar consulta
              </button>
            </div>
          </div>
        </section>
      )
    }

    if (!premiumConfirmado) {
      return (
        <HistorialPremiumBloqueado
          onIrTemporizador={() => {
            setVistaActiva(
              'temporizador'
            )
          }}
          onIrGuia={() => {
            setVistaActiva(
              'guia'
            )
          }}
          onIrSuscripcion={() => {
            onIrSuscripcion(
              'historial'
            )
          }}
        />
      )
    }

    return (
      <HistorialMeditacion
        idUsuario={
          idUsuarioSeguro
        }
        activo={
          vistaActiva ===
          'historial'
        }
      />
    )
  }

  return (
    <div className="meditacion-page">
      <div className="meditacion-contenedor">

        <header className="meditacion-encabezado">
          <div className="meditacion-encabezado-texto">
            <span className="meditacion-sobretitulo">
              Bienestar y concentración
            </span>

            <h1>
              🧘 Módulo de Meditación
            </h1>

            <p>
              Utiliza el temporizador,
              consulta guías escritas y
              revisa el progreso de tus
              sesiones.
            </p>
          </div>

          <div
            className={
              esPremium
                ? (
                  'meditacion-plan ' +
                  'meditacion-plan-premium'
                )
                : (
                  'meditacion-plan ' +
                  'meditacion-plan-free'
                )
            }
          >
            <span>
              Plan
            </span>

            <strong>
              {textoPlan}
            </strong>
          </div>
        </header>

        <TabsMeditacion
          vistaActiva={
            vistaActiva
          }
          onCambiarVista={
            setVistaActiva
          }
        />

        <div
          className="meditacion-vista"
          role="tabpanel"
          hidden={
            vistaActiva !==
            'temporizador'
          }
        >
          <TemporizadorMeditacion
            idUsuario={
              idUsuarioSeguro
            }
            estadoMeditacion={
              estadoMeditacion
            }
            cargandoEstado={
              cargandoEstado
            }
            errorEstado={
              errorEstado
            }
            onRecargarEstado={
              cargarEstado
            }
            onActualizarEstado={
              actualizarEstadoMeditacion
            }
            onIrSuscripcion={() => {
              onIrSuscripcion(
                'temporizador'
              )
            }}
          />
        </div>

        <div
          className="meditacion-vista"
          role="tabpanel"
          hidden={
            vistaActiva !==
            'guia'
          }
        >
          <GuiaMeditacion
            idUsuario={
              idUsuarioSeguro
            }
            esPremium={
              esPremium
            }
            onIrSuscripcion={() => {
              onIrSuscripcion(
                'guia'
              )
            }}
          />
        </div>

        <div
          className="meditacion-vista"
          role="tabpanel"
          hidden={
            vistaActiva !==
            'historial'
          }
        >
          {renderHistorial()}
        </div>

      </div>
    </div>
  )
}

export default Meditacion