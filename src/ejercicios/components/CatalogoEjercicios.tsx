import {
  CATEGORIAS,
  type CategoriaEjercicio,
  type Ejercicio
} from '../../data/ejerciciosData'

import {
  obtenerVecesCompletado
} from '../../services/progresoService'

interface CatalogoEjerciciosProps {
  ejercicios: Ejercicio[]
  categoriaActiva: CategoriaEjercicio | 'todos'
  onCategoriaChange: (
    categoria: CategoriaEjercicio | 'todos'
  ) => void
  onSeleccionar: (
    ejercicio: Ejercicio
  ) => void
}

function CatalogoEjercicios({
  ejercicios,
  categoriaActiva,
  onCategoriaChange,
  onSeleccionar
}: CatalogoEjerciciosProps) {

  const filtros: {
    id: CategoriaEjercicio | 'todos'
    etiqueta: string
  }[] = [
    { id: 'todos', etiqueta: 'Todos' },
    {
      id: 'manejo_crisis',
      etiqueta: CATEGORIAS.manejo_crisis.etiqueta
    },
    {
      id: 'relajacion_muscular',
      etiqueta: CATEGORIAS.relajacion_muscular.etiqueta
    }
  ]

  return (
    <div className="catalogo">

      <div className="catalogo-header">

        <h2 className="seccion-titulo">
          Catálogo de ejercicios
        </h2>

        <p className="seccion-descripcion">
          Elige una técnica de relajación o manejo
          de crisis para aplicar ahora.
        </p>

      </div>

      <div className="catalogo-filtros">

        {filtros.map((filtro) => (

          <button
            key={filtro.id}
            type="button"
            className={
              categoriaActiva === filtro.id
                ? 'filtro-btn activo'
                : 'filtro-btn'
            }
            onClick={() =>
              onCategoriaChange(filtro.id)
            }
          >
            {filtro.etiqueta}
          </button>

        ))}

      </div>

      <div className="catalogo-grid">

        {ejercicios.map((ejercicio) => {

          const veces =
            obtenerVecesCompletado(
              ejercicio.id
            )

          return (

            <article
              key={ejercicio.id}
              className="ejercicio-card"
              onClick={() =>
                onSeleccionar(ejercicio)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' ||
                  e.key === ' '
                ) {
                  onSeleccionar(ejercicio)
                }
              }}
            >

              <div className="ejercicio-card-icono">
                {ejercicio.icono}
              </div>

              <div className="ejercicio-card-contenido">

                <span className="ejercicio-categoria">
                  {
                    CATEGORIAS[
                      ejercicio.categoria
                    ].etiqueta
                  }
                </span>

                <h3>
                  {ejercicio.titulo}
                </h3>

                <p>
                  {ejercicio.descripcion}
                </p>

                <div className="ejercicio-card-meta">

                  <span>
                    ⏱ {ejercicio.duracionEstimada} min
                  </span>

                  <span>
                    📋 {ejercicio.pasos.length} pasos
                  </span>

                  {veces > 0 && (
                    <span className="ejercicio-completado-badge">
                      ✓ {veces}x
                    </span>
                  )}

                </div>

              </div>

            </article>

          )

        })}

      </div>

    </div>
  )

}

export default CatalogoEjercicios
