import { API_BASE } from '../config/api'

export async function obtenerUsuarios() {
  const response = await fetch(
    `${API_BASE}/api/usuarios`
  )
  return await response.json()
}

export async function buscarUsuariosPorCiudad(
  ciudad: string
) {
  const response = await fetch(
    `${API_BASE}/api/usuarios/ciudad/${encodeURIComponent(ciudad)}`
  )
  return await response.json()
}
