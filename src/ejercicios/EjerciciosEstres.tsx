import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { CategoriaEjercicio } from '../data/ejerciciosData'

import {
  CATEGORIAS,
  obtenerEjercicioPorId,
  obtenerEjercicios,
  type Ejercicio
} from '../services/ejerciciosService'

import {
  obtenerProgreso,
  type ProgresoEjercicios
} from '../services/progresoService'

import CatalogoEjercicios from './components/CatalogoEjercicios'
import GuiaPasoAPaso from './components/GuiaPasoAPaso'
import ProgresoUsuario from './components/ProgresoUsuario'

import './Ejercicios.css'

function EjerciciosEstres() {

  const [searchParams, setSearchParams] =
    useSearchParams()

  const ejercicioParam =
    searchParams.get('ejercicio')

  const [ejercicios, setEjercicios] =
    useState<Ejercicio[]>([])

  const [cargandoEjercicios, setCargandoEjercicios] =
    useState(true)

  const [ejercicioActivo, setEjercicioActivo] =
    useState<Ejercicio | null>(null)

  const [categoriaActiva, setCategoriaActiva] =
    useState<CategoriaEjercicio | 'todos'>('todos')

  const [progreso, setProgreso] =
    useState<ProgresoEjercicios>({
      completados: {},
      totalCompletados: 0,
      historial: []
    })

  const [cargandoProgreso, setCargandoProgreso] =
    useState(true)

  useEffect(() => {
    let activo = true

    obtenerEjercicios()
      .then((lista) => {
        if (activo) {
          setEjercicios(lista)
        }
      })
      .finally(() => {
        if (activo) {
          setCargandoEjercicios(false)
        }
      })

    obtenerProgreso()
      .then((datos) => {
        if (activo) {
          setProgreso(datos)
        }
      })
      .finally(() => {
        if (activo) {
          setCargandoProgreso(false)
        }
      })

    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    if (!ejercicioParam) {
      setEjercicioActivo(null)
      return
    }

    let activo = true

    obtenerEjercicioPorId(ejercicioParam)
      .then((ejercicio) => {
        if (activo && ejercicio) {
          setEjercicioActivo(ejercicio)
        }
      })

    return () => {
      activo = false
    }
  }, [ejercicioParam])

  const ejerciciosFiltrados = useMemo(() => {

    if (categoriaActiva === 'todos') {
      return ejercicios
    }

    return ejercicios.filter(
      (ejercicio) =>
        ejercicio.categoria ===
        categoriaActiva
    )

  }, [categoriaActiva, ejercicios])

  const volverCatalogo = () => {
    setEjercicioActivo(null)
    setSearchParams({})
  }

  if (ejercicioActivo) {

    return (

      <GuiaPasoAPaso
        ejercicio={ejercicioActivo}
        onVolver={volverCatalogo}
        onProgresoActualizado={
          setProgreso
        }
      />

    )

  }

  return (

    <div className="ejercicios-container">

      <div className="ejercicios-hero">

        <h1 className="ejercicios-titulo">
          Ejercicios de estrés laboral
        </h1>

        <p className="ejercicios-subtitulo">
          Técnicas prácticas para usar durante tu
          jornada: antes de reuniones, bajo presión
          o al cerrar el día.
        </p>

      </div>

      {cargandoEjercicios ? (

        <p className="progreso-vacio">
          Cargando catálogo desde la base de datos...
        </p>

      ) : (

        <>

          <ProgresoUsuario
            progreso={progreso}
            cargando={cargandoProgreso}
            totalEjercicios={ejercicios.length}
          />

          <CatalogoEjercicios
            ejercicios={ejerciciosFiltrados}
            progreso={progreso}
            categoriaActiva={categoriaActiva}
            categorias={CATEGORIAS}
            onCategoriaChange={
              setCategoriaActiva
            }
            onSeleccionar={(ejercicio) => {
              setEjercicioActivo(ejercicio)
              setSearchParams({
                ejercicio: ejercicio.id
              })
            }}
          />

        </>

      )}

    </div>

  )

}

export default EjerciciosEstres
