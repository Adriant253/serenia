export interface UsuarioSesion {
  id_usuario: number
  nombre: string
  email: string
  fecha_nacimiento?: string
  fecha_registro?: string
  estado_suscripcion?: string
}

export function obtenerUsuarioSesion(): UsuarioSesion | null {
  try {
    const datos = localStorage.getItem('usuario')

    if (!datos) {
      return null
    }

    return JSON.parse(datos) as UsuarioSesion
  } catch {
    return null
  }
}

export function guardarUsuarioSesion(
  usuario: Record<string, unknown>
): void {
  localStorage.setItem(
    'usuario',
    JSON.stringify(usuario)
  )
}
