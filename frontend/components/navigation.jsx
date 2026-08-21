import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
          </li>
        <li>
          <Link to="/academic">Academic Books</Link>
        </li>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <Link to="/weather">Weather</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;