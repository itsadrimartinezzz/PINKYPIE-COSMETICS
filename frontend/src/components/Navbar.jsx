function Navbar({ title, subtitle, actionText, onAction }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {actionText && (
        <button className="primary-button" onClick={onAction}>
          <span>+</span>
          {actionText}
        </button>
      )}
    </header>
  );
}

export default Navbar;