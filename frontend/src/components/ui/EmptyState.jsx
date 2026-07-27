const EmptyState = ({ title, description, action }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
      <div className="py-4">
        <h5 className="fw-bold text-dark mb-2">{title}</h5>
        {description && <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '360px' }}>{description}</p>}
        {action}
      </div>
    </div>
  )
}

export default EmptyState
