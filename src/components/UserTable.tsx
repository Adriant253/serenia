// UserTable.tsx
import { useEffect, useState } from 'react'
import {
  obtenerUsuarios,
  buscarUsuariosPorCiudad
} from '../services/usuarioService'

interface Direccion {
  calle: string
  ciudad: string
  estado: string
  codigo_postal: string
}

interface Usuario {
  id_usuario: number
  nombre: string
  correo: string
  direcciones: Direccion[]
}

function agruparUsuarios(data: any[]): Usuario[] {
  const mapa = new Map<number, Usuario>()

  for (const fila of data) {
    if (!mapa.has(fila.id_usuario)) {
      mapa.set(fila.id_usuario, {
        id_usuario: fila.id_usuario,
        nombre: fila.nombre,
        correo: fila.correo,
        direcciones: []
      })
    }

    mapa.get(fila.id_usuario)!.direcciones.push({
      calle: fila.calle,
      ciudad: fila.ciudad,
      estado: fila.estado,
      codigo_postal: fila.codigo_postal
    })
  }

  return Array.from(mapa.values())
}

function UserTable() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [ciudadFiltro, setCiudadFiltro] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarTodos()
  }, [])

  async function cargarTodos() {
    try {
      setCargando(true)
      const data = await obtenerUsuarios()
      setUsuarios(agruparUsuarios(data))
    } catch (error) {
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  async function filtrarPorCiudad() {
    if (!ciudadFiltro.trim()) {
      cargarTodos()
      return
    }

    try {
      setCargando(true)
      const data = await buscarUsuariosPorCiudad(ciudadFiltro)
      setUsuarios(agruparUsuarios(data))
    } catch (error) {
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="table-container">
      <h1>Usuarios</h1>

      <div
        style={{
          marginBottom: '1rem',
          display: 'flex',
          gap: '0.5rem'
        }}
      >
        <input
          type="text"
          placeholder="Filtrar por ciudad..."
          value={ciudadFiltro}
          onChange={(e) => setCiudadFiltro(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && filtrarPorCiudad()
          }
        />

        <button onClick={filtrarPorCiudad}>
          Buscar
        </button>

        <button onClick={cargarTodos}>
          Ver todos
        </button>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Direcciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>

                  <td>
                    {usuario.direcciones
                      .filter(
                        (dir) =>
                          dir.calle ||
                          dir.ciudad ||
                          dir.estado ||
                          dir.codigo_postal
                      )
                      .map((dir, i) => {
                        const direccionTexto = [
                          dir.calle,
                          dir.ciudad,
                          dir.estado
                        ]
                          .filter(
                            (valor) =>
                              valor &&
                              valor.trim() !== ''
                          )
                          .join(', ')

                        return (
                          <div
                            key={i}
                            style={{
                              borderBottom:
                                i <
                                usuario.direcciones.length - 1
                                  ? '1px dashed #ccc'
                                  : 'none',
                              paddingBottom: '4px',
                              marginBottom: '4px'
                            }}
                          >
                            {direccionTexto}

                            {dir.codigo_postal &&
                              dir.codigo_postal.trim() !== '' &&
                              ` (${dir.codigo_postal})`}
                          </div>
                        )
                      })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UserTable