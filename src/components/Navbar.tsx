import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-slate-800 bg-slate-950/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/"
          className="text-center text-2xl font-bold tracking-tight transition hover:text-cyan-400 sm:text-left"
        >
          <span className="text-blue-500">Game</span>
          <span className="text-cyan-400">Hub</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
          >
            Home
          </Link>

          {user && (
            <>
              <Link
                to="/collection"
                className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
              >
                Collection
              </Link>

              <Link
                to="/profile"
                className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
              >
                Profile
              </Link>

              <button
                onClick={logout}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;