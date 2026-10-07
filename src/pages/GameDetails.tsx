import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

interface Game {
  id: number;
  name: string;
  description: string;
  background_image: string;
  released: string;
  rating: number;
  genres: {
    id: number;
    name: string;
  }[];
}

function GameDetails() {
  const { id } = useParams();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await api.get(`/games/${id}`);
        setGame(data);
      } catch (error) {
        setError("Failed to load game details");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return <p>Loading game...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!game) {
    return <p>Game not found</p>;
  }

  return (
    <div>
      <h1>{game.name}</h1>

      {game.background_image && (
        <img
          src={game.background_image}
          alt={game.name}
          width="500"
        />
      )}

      <p>Released: {game.released}</p>

      <p>Rating: {game.rating}</p>

      <p>{game.description}</p>

      <h2>Genres</h2>

      <ul>
        {game.genres.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default GameDetails;

// Fix game desc pulling <p> tags from the API response