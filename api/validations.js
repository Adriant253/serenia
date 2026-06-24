export function validarEmailServidor(email) {
  if (!email || typeof email !== 'string') {
    return 'El correo es obligatorio'
  }

  const valor = email.trim()

  if (!valor) {
    return 'El correo es obligatorio'
  }

  if (/\s/.test(valor)) {
    return 'El correo no puede contener espacios'
  }

  if (!valor.includes('@')) {
    return 'El correo debe incluir @'
  }

  const cantidadArroba =
    (valor.match(/@/g) || []).length

  if (cantidadArroba !== 1) {
    return 'El correo solo puede tener un @'
  }

  const [local, dominio] = valor.split('@')

  if (!local || !dominio) {
    return 'Ingresa un correo válido (ejemplo: nombre@correo.com)'
  }

  if (!dominio.includes('.')) {
    return 'El correo debe incluir una extensión como .com'
  }

  if (
    dominio.startsWith('.') ||
    dominio.endsWith('.')
  ) {
    return 'El dominio del correo no es válido'
  }

  if (dominio.includes('..')) {
    return 'El dominio del correo no es válido'
  }

  const extension =
    dominio.split('.').pop() ?? ''

  if (extension.length < 2) {
    return 'La extensión del correo debe ser válida (ejemplo: .com)'
  }

  if (!/^[a-zA-Z0-9.-]+$/.test(dominio)) {
    return 'El dominio del correo no es válido'
  }

  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  if (!regex.test(valor)) {
    return 'Formato de correo inválido'
  }

  return null
}
