# Guía de despliegue — Serenia

Despliega el **frontend en Vercel** y la **API en Render**. La base de datos ya está en Google Cloud SQL.

---

## Paso 1: Subir el código a GitHub

1. Crea un repositorio en [github.com/new](https://github.com/new) (por ejemplo `serenia`).
2. En la carpeta del proyecto, ejecuta:

```bash
git init
git add .
git commit -m "Preparar Serenia para despliegue"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/serenia.git
git push -u origin main
```

---

## Paso 2: Desplegar la API en Render

1. Entra a [render.com](https://render.com) y conecta tu cuenta de GitHub.
2. **New → Blueprint** (o **Web Service** si no ves Blueprint).
3. Selecciona el repo `serenia`. Render detectará `render.yaml`.
4. En **Environment Variables**, agrega:

| Variable | Valor |
|----------|-------|
| `DB_HOST` | IP de tu Cloud SQL |
| `DB_USER` | usuario MySQL |
| `DB_PASSWORD` | contraseña |
| `DB_NAME` | `serenia` |
| `DB_PORT` | `3306` |
| `GOOGLE_CLIENT_ID` | tu client ID |
| `GOOGLE_CLIENT_SECRET` | tu client secret |
| `GOOGLE_CALLBACK_URL` | `https://TU-API.onrender.com/api/auth/google/callback` |
| `FRONTEND_URL` | `https://TU-APP.vercel.app` (la pondrás después del paso 3) |
| `MAIL_USER` | correo Gmail |
| `MAIL_PASS` | contraseña de aplicación de Gmail |

5. Despliega y copia la URL de la API, por ejemplo: `https://serenia-api.onrender.com`
6. Prueba: abre `https://serenia-api.onrender.com/test` — debe decir "API funcionando".

### Cloud SQL — permitir conexión desde Render

En Google Cloud Console → SQL → tu instancia → **Connections → Authorized networks**:

- Agrega `0.0.0.0/0` solo para pruebas, **o**
- La IP de salida de Render (en el dashboard del servicio).

---

## Paso 3: Desplegar el frontend en Vercel

1. Entra a [vercel.com](https://vercel.com) y conecta GitHub.
2. **Import Project** → selecciona `serenia`.
3. Configuración:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://serenia-api.onrender.com` (tu URL de Render) |
| `VITE_GOOGLE_CLIENT_ID` | mismo client ID de Google |

5. Deploy. Copia la URL, por ejemplo: `https://serenia.vercel.app`

---

## Paso 4: Volver a Render y actualizar `FRONTEND_URL`

En Render → tu servicio → Environment:

```
FRONTEND_URL=https://serenia.vercel.app
```

Guarda y espera el redeploy.

---

## Paso 5: Configurar Google OAuth

En [Google Cloud Console](https://console.cloud.google.com/) → APIs y servicios → Credenciales → tu cliente OAuth:

**Orígenes de JavaScript autorizados:**
```
https://serenia.vercel.app
http://localhost:5173
```

**URIs de redirección autorizados:**
```
https://serenia-api.onrender.com/api/auth/google/callback
http://localhost:3000/api/auth/google/callback
```

---

## Paso 6: Probar

1. Abre `https://serenia.vercel.app`
2. Prueba login con correo y contraseña
3. Prueba "Continuar con Google"
4. Prueba recuperar contraseña

---

## Link para compartir

Comparte solo la URL de Vercel:

```
https://serenia.vercel.app
```

---

## Desarrollo local

Copia `.env.example` a `.env` y completa los valores. Luego:

```bash
npm run dev
```

---

## Notas

- El plan gratuito de Render **duerme** la API tras inactividad; el primer acceso puede tardar ~30 s.
- `VITE_*` se inyectan en **build time** en Vercel: si cambias `VITE_API_URL`, haz **Redeploy**.
- No subas `.env` a GitHub (ya está en `.gitignore`).
