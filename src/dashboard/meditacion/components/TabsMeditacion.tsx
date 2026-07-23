import type {
  VistaMeditacion
} from '../../../functions/meditacionF/meditacionTypes'

interface TabsMeditacionProps {
  vistaActiva: VistaMeditacion
  onCambiarVista: (
    vista: VistaMeditacion
  ) => void
}

const tabs: Array<{
  id: VistaMeditacion
  titulo: string
  descripcion: string
}> = [
  {
    id: 'temporizador',
    titulo: 'Temporizador',
    descripcion:
      'Sesiones de concentración y calma'
  },
  {
    id: 'guia',
    titulo: 'Guía de meditación',
    descripcion:
      'Pasos escritos para meditar'
  },
  {
    id: 'historial',
    titulo: 'Historial',
    descripcion:
      'Consulta tus sesiones guardadas'
  }
]

function TabsMeditacion({
  vistaActiva,
  onCambiarVista
}: TabsMeditacionProps) {
  return (
    <div
      className="meditacion-tabs"
      role="tablist"
      aria-label="Secciones de meditación"
    >
      {
        tabs.map((tab) => (
          <button
            className={
              vistaActiva === tab.id
                ? 'meditacion-tab meditacion-tab-activa'
                : 'meditacion-tab'
            }
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={
              vistaActiva === tab.id
            }
            onClick={() => {
              onCambiarVista(tab.id)
            }}
          >
            <span className="meditacion-tab-titulo">
              {tab.titulo}
            </span>

            <span className="meditacion-tab-descripcion">
              {tab.descripcion}
            </span>
          </button>
        ))
      }
    </div>
  )
}

export default TabsMeditacion