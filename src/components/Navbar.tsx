import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">
        GameHub
      </Link>

      <div>
        <Link to="/">Home</Link>

        {user && (
          <>
            <Link to="/collection">My Collection</Link>
            <Link to="/profile">Profile</Link>

            <button onClick={logout}>
              Logout
            </button>
          </>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;