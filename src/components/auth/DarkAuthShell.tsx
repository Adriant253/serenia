import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import '../../styles/Landing.css'

interface DarkAuthShellProps {
  titulo: string
  subtitulo?: string
  children: ReactNode
  formularioLargo?: boolean
}

export function DarkAuthShell({
  titulo,
  subtitulo,
  children,
  formularioLargo = false
}: DarkAuthShellProps) {

  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    const htmlOverflow = html.style.overflow
    const bodyOverflow = body.style.overflow

    html.style.overflow = ''
    body.style.overflow = ''

    return () => {
      html.style.overflow = htmlOverflow
      body.style.overflow = bodyOverflow
    }
  }, [])

  return (
    <div className="landing landing-auth-page">
      <div className="landing-bg">
        <div className="landing-glow landing-glow--accent" />
        <div className="landing-glow landing-glow--blue" />
      </div>

      <header className="landing-nav">
        <Link to="/" className="landing-brand">
          <img
            src="/SereniaLogo.jpg"
            alt="Serenia"
            className="landing-brand-logo"
          />
          <span>serenia</span>
        </Link>
      </header>

      <main className="landing-main landing-main--solo-login">
        <aside
          className={
            formularioLargo
              ? 'landing-login-panel landing-login-panel--visible landing-login-panel--form'
              : 'landing-login-panel landing-login-panel--visible'
          }
        >
          <div className="login-form-inner">
            <header className="login-form-header">
              <h2>{titulo}</h2>
              {subtitulo && <p>{subtitulo}</p>}
            </header>
            {children}
          </div>
        </aside>
      </main>
    </div>
  )
}
