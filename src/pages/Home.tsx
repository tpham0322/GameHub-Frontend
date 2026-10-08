import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
}

function Home() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchGames = async () => {
    if (!search.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await api.get(
        `/games?search=${encodeURIComponent(search)}`
      );

      setGames(data.results);
    } catch (error) {
      setError("Failed to search for games");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Discover • Collect • Review
            </p>

            <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              Welcome to GameHub
            </h1>

            {user && (
              <p className="mt-5 text-lg text-slate-300">
                Welcome back,{" "}
                <span className="font-semibold text-cyan-400">
                  {user.username}
                </span>
                !
              </p>
            )}

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Search for your favorite games, build your personal
              collection, track your progress, and share your reviews.
            </p>

            {/* Search */}
            <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Search for a game..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    searchGames();
                  }
                }}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-white shadow-lg shadow-blue-950/20 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />

              <button
                onClick={searchGames}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-7 py-4 font-semibold shadow-lg shadow-blue-900/30 transition hover:bg-blue-500 hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {error && (
              <p className="mt-6 text-red-400">
                {error}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {games.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">
                Results
              </p>

              <h2 className="mt-1 text-3xl font-bold text-white">
                Search Results
              </h2>
            </div>

            <span className="text-sm text-slate-500">
              {games.length} games
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {games.map((game) => (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-950/40"
              >
                {/* Game Image */}
                {game.background_image ? (
                  <div className="relative overflow-hidden">
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70" />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center bg-slate-800 text-slate-500">
                    No Image
                  </div>
                )}

                {/* Game Info */}
                <div className="p-5">
                  <h3 className="truncate text-lg font-semibold text-white transition group-hover:text-cyan-400">
                    {game.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      ⭐ {game.rating || "N/A"}
                    </span>

                    <span className="text-slate-500">
                      {game.released || "Unknown"}
                    </span>
                  </div>

                  <div className="mt-4 text-sm font-medium text-blue-400 transition group-hover:text-cyan-400">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && games.length === 0 && (
        <section className="mx-auto max-w-4xl px-6 pb-20">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-3xl">
              🎮
            </div>

            <h2 className="text-2xl font-bold">
              Find Your Next Game
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Search above to discover games and start building
              your collection.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

export default Home;