import {
  useCallback,
  useEffect,
  useState
} from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { LoginForm } from '../components/auth/LoginForm'
import { LandingIllustration } from '../components/landing/LandingIllustration'

import '../styles/Landing.css'

const SECCIONES = [
  { id: 'beneficios', label: 'Beneficios' },
  { id: 'como-funciona', label: 'Cómo funciona' },
  { id: 'bienestar', label: 'Bienestar' }
] as const

function LandingPage() {

  const [searchParams, setSearchParams] =
    useSearchParams()

  const [loginVisible, setLoginVisible] =
    useState(false)

  const [menuAbierto, setMenuAbierto] =
    useState(false)

  const abrirLogin = useCallback(() => {
    setLoginVisible(true)
    setMenuAbierto(false)
  }, [])

  const cerrarLogin = useCallback(() => {
    setLoginVisible(false)
    if (searchParams.get('login')) {
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const irASeccion = useCallback(
    (id: string) => {
      setMenuAbierto(false)

      if (loginVisible) {
        setLoginVisible(false)
        window.setTimeout(() => {
          document
            .getElementById(id)
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
        }, 350)
        return
      }

      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
    },
    [loginVisible]
  )

  useEffect(() => {
    if (searchParams.get('login') === '1') {
      setLoginVisible(true)
    }
  }, [searchParams])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && loginVisible) {
        cerrarLogin()
      }
    }

    window.addEventListener('keydown', onKey)
    return () =>
      window.removeEventListener('keydown', onKey)
  }, [loginVisible, cerrarLogin])

  return (
    <div
      className={
        loginVisible
          ? 'landing landing--login-open'
          : 'landing'
      }
    >

      {loginVisible && (
        <button
          type="button"
          className="landing-backdrop"
          onClick={cerrarLogin}
          aria-label="Cerrar inicio de sesión"
        />
      )}

      <div className="landing-bg">
        <div className="landing-glow landing-glow--accent" />
        <div className="landing-glow landing-glow--blue" />
      </div>

      <header className="landing-nav">

        <Link
          to="/"
          className="landing-brand"
          onClick={() => {
            setMenuAbierto(false)
            cerrarLogin()
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          }}
        >
          <img
            src="/SereniaLogo.jpg"
            alt="Serenia"
            className="landing-brand-logo"
          />
          <span>serenia</span>
        </Link>

        <nav
          className={
            menuAbierto
              ? 'landing-nav-links landing-nav-links--open'
              : 'landing-nav-links'
          }
        >
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              type="button"
              className="landing-nav-link-btn"
              onClick={() => irASeccion(s.id)}
            >
              {s.label}
            </button>
          ))}

          <button
            type="button"
            className="landing-nav-login landing-nav-login--mobile"
            onClick={abrirLogin}
          >
            Iniciar sesión
          </button>
        </nav>

        <div className="landing-nav-actions">
          <button
            type="button"
            className="landing-nav-login"
            onClick={abrirLogin}
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            className={
              menuAbierto
                ? 'landing-menu-toggle abierto'
                : 'landing-menu-toggle'
            }
            onClick={() =>
              setMenuAbierto(!menuAbierto)
            }
            aria-label="Menú"
            aria-expanded={menuAbierto}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

      </header>

      <main className="landing-main">

        <section
          className={
            loginVisible
              ? 'landing-hero landing-hero--hidden'
              : 'landing-hero'
          }
        >

          <div className="landing-hero-text">

            <h1>
              Bienestar creado
              <br />
              para{' '}
              <span className="landing-highlight">
                tu mente
              </span>
            </h1>

            <p className="landing-subtitle">
              Rastrea tu estado de ánimo, practica
              ejercicios de calma y cuida tu
              bienestar laboral. Logra más con menos
              estrés.
            </p>

            <div className="landing-cta-group">
              <button
                type="button"
                className="landing-cta-primary"
                onClick={abrirLogin}
              >
                Comenzar ahora
              </button>
              <Link
                to="/registro"
                className="landing-cta-secondary"
              >
                Crear cuenta gratis
              </Link>
            </div>

          </div>

          <div className="landing-hero-visual">
            <LandingIllustration />
          </div>

        </section>

        {loginVisible && (
          <aside className="landing-login-side">
            <div className="landing-login-side-visual">
              <LandingIllustration />
            </div>

            <div className="landing-login-side-text">
              <h2>
                Tu espacio de calma
                <br />
                te espera
              </h2>
              <blockquote>
                &ldquo;Cuidar mi bienestar me hace
                mejor profesional.&rdquo;
              </blockquote>
            </div>

            <ul className="landing-login-features">
              <li>
                <span>🌿</span>
                Check-in emocional diario
              </li>
              <li>
                <span>🎯</span>
                Ejercicios de respiración
              </li>
              <li>
                <span>📊</span>
                Historial y metas semanales
              </li>
            </ul>

            <div className="landing-login-stats">
              <div>
                <strong>5 min</strong>
                <span>al día</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>gratis</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>disponible</span>
              </div>
            </div>
          </aside>
        )}

        <aside
          className={
            loginVisible
              ? 'landing-login-panel landing-login-panel--visible'
              : 'landing-login-panel'
          }
        >
          <LoginForm onClose={cerrarLogin} />
        </aside>

      </main>

      {/* Beneficios */}
      <section
        id="beneficios"
        className="landing-section landing-info"
      >
        <h2 className="landing-section-title">
          Beneficios
        </h2>
        <div className="landing-info-grid">
          <div className="landing-info-card">
            <span>🌿</span>
            <h3>Check-in emocional</h3>
            <p>
              Registra cómo te sientes durante tu
              jornada laboral.
            </p>
          </div>
          <div className="landing-info-card">
            <span>🎯</span>
            <h3>Ejercicios guiados</h3>
            <p>
              Técnicas de respiración y relajación
              adaptadas a tu ritmo.
            </p>
          </div>
          <div className="landing-info-card">
            <span>📊</span>
            <h3>Tu progreso</h3>
            <p>
              Historial y metas semanales para ver
              tu evolución.
            </p>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section
        id="como-funciona"
        className="landing-section landing-steps"
      >
        <h2 className="landing-section-title">
          Cómo funciona
        </h2>
        <div className="landing-steps-grid">
          <div className="landing-step">
            <span className="landing-step-num">1</span>
            <h3>Crea tu cuenta</h3>
            <p>
              Regístrate gratis en segundos con tu
              correo o con Google.
            </p>
          </div>
          <div className="landing-step">
            <span className="landing-step-num">2</span>
            <h3>Haz tu check-in</h3>
            <p>
              Registra tu estado de ánimo y recibe
              recomendaciones personalizadas.
            </p>
          </div>
          <div className="landing-step">
            <span className="landing-step-num">3</span>
            <h3>Mejora cada día</h3>
            <p>
              Practica ejercicios, revisa tu historial
              y cumple tus metas de bienestar.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="landing-cta-primary landing-section-cta"
          onClick={abrirLogin}
        >
          Empezar ahora
        </button>
      </section>

      {/* Bienestar */}
      <section
        id="bienestar"
        className="landing-section landing-wellness"
      >
        <div className="landing-wellness-content">
          <h2 className="landing-section-title">
            Tu bienestar, en el trabajo
          </h2>
          <p>
            Serenia está pensada para profesionales
            que quieren cuidar su salud mental sin
            salir de su rutina. Menos estrés, más
            enfoque y equilibrio en tu día a día.
          </p>
          <ul className="landing-wellness-list">
            <li>✓ Recordatorios de check-in emocional</li>
            <li>✓ Ejercicios de respiración y calma</li>
            <li>✓ Panel con tu plan diario de bienestar</li>
            <li>✓ Temas de color personalizables</li>
          </ul>
          <div className="landing-cta-group">
            <Link
              to="/registro"
              className="landing-cta-primary landing-cta-link"
            >
              Crear cuenta gratis
            </Link>
            <button
              type="button"
              className="landing-cta-secondary landing-cta-btn"
              onClick={abrirLogin}
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <Link to="/" className="landing-brand">
          <img
            src="/SereniaLogo.jpg"
            alt="Serenia"
            className="landing-brand-logo"
          />
          <span>serenia</span>
        </Link>
        <p>© 2026 Serenia · Tu espacio de calma</p>
        <div className="landing-footer-links">
          <button
            type="button"
            onClick={() => irASeccion('beneficios')}
          >
            Beneficios
          </button>
          <button
            type="button"
            onClick={abrirLogin}
          >
            Iniciar sesión
          </button>
          <Link to="/registro">
            Registrarse
          </Link>
        </div>
      </footer>

    </div>
  )

}

export default LandingPage
