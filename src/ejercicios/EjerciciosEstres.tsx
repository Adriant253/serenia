import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  EJERCICIOS,
  obtenerEjercicioPorId,
  type CategoriaEjercicio,
  type Ejercicio
} from '../data/ejerciciosData'

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

  const [ejercicioActivo, setEjercicioActivo] =
    useState<Ejercicio | null>(null)

  const [categoriaActiva, setCategoriaActiva] =
    useState<CategoriaEjercicio | 'todos'>('todos')

  const [progreso, setProgreso] =
    useState<ProgresoEjercicios>(
      obtenerProgreso
    )

  useEffect(() => {
    if (!ejercicioParam) {
      return
    }

    const ejercicio =
      obtenerEjercicioPorId(ejercicioParam)

    if (ejercicio) {
      setEjercicioActivo(ejercicio)
    }
  }, [ejercicioParam])

  const ejerciciosFiltrados = useMemo(() => {

    if (categoriaActiva === 'todos') {
      return EJERCICIOS
    }

    return EJERCICIOS.filter(
      (ejercicio) =>
        ejercicio.categoria ===
        categoriaActiva
    )

  }, [categoriaActiva])

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

      <ProgresoUsuario
        progreso={progreso}
      />

      <CatalogoEjercicios
        ejercicios={ejerciciosFiltrados}
        categoriaActiva={categoriaActiva}
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

    </div>

  )

}

export default EjerciciosEstres
