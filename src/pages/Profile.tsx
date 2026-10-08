import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Profile
          </h1>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-blue-950/20">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold shadow-lg shadow-blue-900/40">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {user.username}
              </h2>

              <p className="mt-1 text-slate-400">
                {user.email}
              </p>
            </div>
          </div>

          <div className="my-8 border-t border-slate-800" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/collection"
              className="rounded-xl border border-slate-700 bg-slate-950 p-5 transition hover:border-blue-500 hover:bg-blue-950/20"
            >
              <h3 className="font-semibold text-cyan-400">
                My Collection
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                View and manage your saved games.
              </p>
            </Link>

            <Link
              to="/"
              className="rounded-xl border border-slate-700 bg-slate-950 p-5 transition hover:border-blue-500 hover:bg-blue-950/20"
            >
              <h3 className="font-semibold text-cyan-400">
                Discover Games
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Search for games and discover something new.
              </p>
            </Link>
          </div>

          <button
            onClick={logout}
            className="mt-8 rounded-lg border border-red-900 px-5 py-2.5 font-semibold text-red-400 transition hover:bg-red-950"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}

export default Profile;