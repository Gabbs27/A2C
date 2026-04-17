import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import SEO from '../../components/SEO'
import './LoginPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/admin', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    const { error: signInError } = await signIn(email, password)
    if (signInError) {
      setError(signInError.message)
      setIsSubmitting(false)
    } else {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <div className="login-page">
      <SEO title="Administración" noIndex />
      <div className="login-card">
        <div className="login-logo">
          <img
            src={`${import.meta.env.BASE_URL}logo-dark.png`}
            alt="A2C International"
            height="48"
          />
        </div>
        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">Panel de administración</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="admin@a2cinternacional.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting || !email || !password}
          >
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <Link to="/" className="login-back">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
