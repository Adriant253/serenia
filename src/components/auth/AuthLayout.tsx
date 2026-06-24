import type { ReactNode } from 'react'
import '../../styles/Auth.css'

interface AuthLayoutProps {
  titulo: string
  subtitulo?: string
  children: ReactNode
}

export function AuthLayout({
  titulo,
  subtitulo,
  children
}: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <img
            src="/SereniaLogo.jpg"
            alt="Serenia"
            className="auth-logo"
          />
          <h1>{titulo}</h1>
          {subtitulo && <p>{subtitulo}</p>}
        </header>
        {children}
      </div>
    </div>
  )
}
