import './EmptyState.css'

export default function EmptyState({ icon: Icon, eyebrow, title, message, action, variant = 'default' }) {
  const isError = variant === 'error'
  return (
    <div
      className={`empty-state${isError ? ' empty-state--error' : ''}`}
      role={isError ? 'alert' : 'status'}
    >
      {Icon && (
        <div className="empty-state__icon" aria-hidden="true">
          <Icon size={48} />
        </div>
      )}
      {eyebrow && <p className="eyebrow empty-state__eyebrow">{eyebrow}</p>}
      {title && <h3 className="empty-state__title">{title}</h3>}
      {message && <p className="empty-state__message">{message}</p>}
      {action && (
        <button
          type="button"
          className="btn btn--primary btn--md"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
