import './EmptyState.css'

export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty-state" role="status">
      {Icon && (
        <div className="empty-state__icon" aria-hidden="true">
          <Icon size={48} />
        </div>
      )}
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
