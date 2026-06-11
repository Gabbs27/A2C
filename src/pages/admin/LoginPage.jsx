import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import SEO from '../../components/SEO'
import './LoginPage.css'

// Mensajes de Supabase llegan en inglés; el panel es en español
const ERROR_TRANSLATIONS = {
  'Invalid login credentials': 'Credenciales incorrectas. Verifica tu correo y contraseña.',
  'Email not confirmed': 'Tu correo aún no está confirmado. Revisa tu bandeja de entrada.',
  'Too many requests': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  'Network request failed': 'No pudimos conectar con el servidor. Revisa tu conexión.',
  'Failed to fetch': 'No pudimos conectar con el servidor. Revisa tu conexión.',
}

const translateError = (message) => {
  if (!message) return 'Ocurrió un error inesperado. Inténtalo de nuevo.'
  const match = Object.keys(ERROR_TRANSLATIONS).find((key) =>
    message.toLowerCase().includes(key.toLowerCase())
  )
  if (match) return ERROR_TRANSLATIONS[match]
  // Los mensajes ya en español (p.ej. backend no configurado) pasan directo
  return /[áéíóúñ¿]| el | la | de /i.test(message)
    ? message
    : 'No pudimos iniciar sesión. Inténtalo de nuevo.'
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from?.pathname || '/admin'

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true })
  }, [user, navigate, redirectTo])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    const { error: signInError } = await signIn(email, password)
    if (signInError) {
      setError(translateError(signInError.message))
      setIsSubmitting(false)
    } else {
      navigate(redirectTo, { replace: true })
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
              placeholder="admin@a2cinternational.com"
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
