interface FiltroFechasProps {
  fechaDesde: string
  fechaHasta: string
  onFechaDesdeChange: (valor: string) => void
  onFechaHastaChange: (valor: string) => void
  onLimpiar: () => void
}

function FiltroFechas({
  fechaDesde,
  fechaHasta,
  onFechaDesdeChange,
  onFechaHastaChange,
  onLimpiar
}: FiltroFechasProps) {

  return (

    <div className="filtro-fechas">

      <div className="filtro-campo">

        <label htmlFor="fecha-desde">
          Desde
        </label>

        <input
          id="fecha-desde"
          type="date"
          value={fechaDesde}
          onChange={(e) =>
            onFechaDesdeChange(
              e.target.value
            )
          }
        />

      </div>

      <div className="filtro-campo">

        <label htmlFor="fecha-hasta">
          Hasta
        </label>

        <input
          id="fecha-hasta"
          type="date"
          value={fechaHasta}
          onChange={(e) =>
            onFechaHastaChange(
              e.target.value
            )
          }
        />

      </div>

      <button
        type="button"
        className="btn-secundario filtro-limpiar"
        onClick={onLimpiar}
      >
        Limpiar filtros
      </button>

    </div>

  )

}

export default FiltroFechas
