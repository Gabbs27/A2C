import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'grid',
          placeItems: 'center',
          padding: '4rem 1rem',
          textAlign: 'center',
          color: 'var(--silver-100)',
          background: 'var(--ink-950)',
        }}
      >
        <div style={{ maxWidth: '52ch' }}>
          <p
            style={{
              color: 'var(--gold-500)',
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-ui-xs)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-widest)',
              fontWeight: 600,
              marginBottom: 'var(--space-4)',
            }}
          >
            Error inesperado
          </p>
          <h1
            className="display-lg"
            style={{ color: 'var(--silver-100)', marginBottom: 'var(--space-4)' }}
          >
            Algo salió mal.
          </h1>
          <p
            style={{
              color: 'var(--silver-300)',
              fontSize: 'var(--text-body)',
              marginBottom: 'var(--space-8)',
            }}
          >
            Ocurrió un error al cargar esta página. Puedes intentar recargar o volver al inicio.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn--primary btn--md"
              onClick={this.handleReload}
            >
              Recargar
            </button>
            <Link to="/" className="btn btn--ghost btn--md">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
