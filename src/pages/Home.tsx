import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

interface Game {
  id: number;
  name: string;
  background_image: string;
}

function Home() {
  const { user, logout } = useAuth();

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
    <div>
      <h1>GameHub Home</h1>

      {user && (
        <div>
          <p>Welcome, {user.username}!</p>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Search for a game..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button onClick={searchGames}>
          Search
        </button>
      </div>

      {loading && <p>Searching...</p>}

      {error && <p>{error}</p>}

      <div>
        {games.map((game) => (
          <div key={game.id}>
            <a href={`/games/${game.id}`}>
              {game.background_image && (
                <img
                  src={game.background_image}
                  alt={game.name}
                  width="200"
                />
              )}

              <h2>{game.name}</h2>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;