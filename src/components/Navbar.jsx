import { Link } from "react-router-dom";
import './styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/userHome">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/BlackTube">BlackTube</Link>
        </li>
        <li className="navbar-item">
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("loggedUser");
              alert("Sesión cerrada. Redirigiendo al login...");
              window.location.href = "/";
            }}
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

