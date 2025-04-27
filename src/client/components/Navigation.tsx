import { Link } from "react-router-dom";
import "../styles/Navigation.css";

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Acme Co.
        </Link>
        <div className="nav-links">
          <Link to="/about-page">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/valves">Valves</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
