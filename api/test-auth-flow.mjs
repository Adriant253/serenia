const API = 'http://localhost:3000'

const email = `test_${Date.now()}@serenia.test`
const password = 'password123'
const tokenEsperado = 'ABCD1234'

async function request(path, body) {
  const response = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  return response.json()
}

console.log('1. Registro de usuario de prueba...')
const registro = await request('/api/registro', {
  nombre: 'Usuario Prueba',
  email,
  contrasena: password,
  fecha_nacimiento: '2000-01-01'
})

if (registro.success !== 1) {
  console.error('Registro falló:', registro)
  process.exit(1)
}

console.log('2. Login con credenciales válidas...')
const loginOk = await request('/api/login', {
  email,
  contrasena: password
})

if (loginOk.success !== 1) {
  console.error('Login falló:', loginOk)
  process.exit(1)
}

console.log('3. Solicitar recuperación...')
const recuperacion = await request('/api/solicitar-recuperacion', {
  email,
  token: tokenEsperado
})

if (recuperacion.success !== 1) {
  console.error('Recuperación falló:', recuperacion)
  process.exit(1)
}

console.log('4. Cambiar contraseña con token...')
const nuevaPassword = 'nuevaPass123'
const cambio = await request('/api/cambiar-contrasena', {
  email,
  token: tokenEsperado,
  nuevaContrasena: nuevaPassword
})

if (cambio.success !== 1) {
  console.error('Cambio de contraseña falló:', cambio)
  process.exit(1)
}

console.log('5. Login con contraseña anterior (debe fallar)...')
const loginViejo = await request('/api/login', {
  email,
  contrasena: password
})

if (loginViejo.success !== 0) {
  console.error('Login con contraseña vieja no falló como esperado')
  process.exit(1)
}

console.log('6. Login con contraseña nueva...')
const loginNuevo = await request('/api/login', {
  email,
  contrasena: nuevaPassword
})

if (loginNuevo.success !== 1) {
  console.error('Login con contraseña nueva falló:', loginNuevo)
  process.exit(1)
}

console.log('Flujo completo OK para', email)
