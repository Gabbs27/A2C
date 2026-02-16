import React from 'react'
import './EmptyState.css'

const EmptyState = ({ icon: Icon, title, message, action, dark = false }) => {
  return (
    <div className={`empty-state-component ${dark ? 'empty-state-component--dark' : ''}`}>
      {Icon && (
        <div className="empty-state-component__icon">
          <Icon size={48} />
        </div>
      )}
      {title && <h3 className="empty-state-component__title">{title}</h3>}
      {message && <p className="empty-state-component__message">{message}</p>}
      {action && (
        <button className="empty-state-component__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState
