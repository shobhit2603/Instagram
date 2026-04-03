const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Search</a>
          <a href="#">Create Post</a>
          <a href="#">Profile</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar