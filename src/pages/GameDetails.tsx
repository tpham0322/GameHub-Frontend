import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

interface Game {
  id: number;
  databaseId: string;
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

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    username: string;
  };
}

function GameDetails() {
  const { id } = useParams();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

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

  useEffect(() => {
    if (!game) {
      return;
    }

    const fetchReviews = async () => {
      try {
        const data = await api.get(
          `/games/${game.databaseId}/reviews`
        );

        setReviews(data);
      } catch (error) {
        setReviewsError("Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [game]);

  const addToCollection = async () => {
    try {
      await api.post("/collection", {
        game: game?.databaseId,
        status: "Want to Play",
      });

      alert("Game added to your collection!");
    } catch (error) {
      alert("Failed to add game to collection");
    }
  };

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

      <button onClick={addToCollection}>
        Add to Collection
      </button>

      <h2>Genres</h2>

      <ul>
        {game.genres.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))}
      </ul>

      <h2>Reviews</h2>

      {reviewsLoading && <p>Loading reviews...</p>}

      {reviewsError && <p>{reviewsError}</p>}

      {!reviewsLoading && reviews.length === 0 && (
        <p>No reviews yet.</p>
      )}

      {reviews.map((review) => (
        <div key={review._id}>
          <h3>{review.user.username}</h3>

          <p>Rating: {review.rating}/5</p>

          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default GameDetails;