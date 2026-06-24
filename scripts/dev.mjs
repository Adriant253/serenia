import { spawn } from 'node:child_process'
import http from 'node:http'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run(script) {
  const proc = spawn(npm, ['run', script], {
    stdio: 'inherit',
    shell: true,
    env: process.env
  })

  proc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      process.exit(code)
    }
  })

  return proc
}

function esperarApi(intentosMax = 40) {
  return new Promise((resolve, reject) => {
    let intentos = 0

    const revisar = () => {
      const req = http.get(
        'http://localhost:3000/test',
        (res) => {
          res.resume()

          if (res.statusCode === 200) {
            resolve()
            return
          }

          reintentar()
        }
      )

      req.on('error', reintentar)
      req.setTimeout(2000, () => {
        req.destroy()
        reintentar()
      })
    }

    const reintentar = () => {
      intentos += 1

      if (intentos >= intentosMax) {
        reject(
          new Error(
            'La API no arrancó en el puerto 3000. Revisa la conexión a la base de datos.'
          )
        )
        return
      }

      setTimeout(revisar, 1000)
    }

    revisar()
  })
}

console.log('Iniciando API (puerto 3000)...')

run('api')

try {
  await esperarApi()
  console.log('API lista. Iniciando frontend (Vite)...\n')
  run('dev:frontend')
} catch (error) {
  console.error('\nError:', error.message)
  process.exit(1)
}

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))
