import { Link } from 'react-router-dom'

import { LoginForm } from '../components/auth/LoginForm'

import '../styles/Landing.css'

function Login() {
  return (
    <div className="landing landing--login-open">
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
        <aside className="landing-login-panel landing-login-panel--visible">
          <LoginForm />
        </aside>
      </main>
    </div>
  )
}

export default Login
