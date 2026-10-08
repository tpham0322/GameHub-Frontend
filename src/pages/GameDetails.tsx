import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
    _id: string;
    username: string;
  };
}

function GameDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState<string | null>(
    null
  );
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

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

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!game) {
      return;
    }

    setReviewSubmitting(true);

    try {
      const newReview = await api.post(
        `/games/${game.databaseId}/reviews`,
        {
          rating: reviewRating,
          comment: reviewComment,
        }
      );

      setReviews((currentReviews) => [
        ...currentReviews,
        newReview,
      ]);

      setReviewRating(5);
      setReviewComment("");
    } catch (error) {
      setReviewsError("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const updateReview = async (reviewId: string) => {
    try {
      const updatedReview = await api.put(
        `/games/${reviewId}`,
        {
          rating: editRating,
          comment: editComment,
        }
      );

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review._id === reviewId ? updatedReview : review
        )
      );

      setEditingReviewId(null);
    } catch (error) {
      setReviewsError("Failed to update review");
    }
  };

  const startEditingReview = (review: Review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditingReview = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
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
          {editingReviewId === review._id ? (
            <div>
              <h3>Edit Review</h3>

              <div>
                <label htmlFor={`edit-rating-${review._id}`}>
                  Rating
                </label>

                <select
                  id={`edit-rating-${review._id}`}
                  value={editRating}
                  onChange={(event) =>
                    setEditRating(Number(event.target.value))
                  }
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>

              <div>
                <label htmlFor={`edit-comment-${review._id}`}>
                  Comment
                </label>

                <textarea
                  id={`edit-comment-${review._id}`}
                  value={editComment}
                  onChange={(event) =>
                    setEditComment(event.target.value)
                  }
                />
              </div>

              <button onClick={() => updateReview(review._id)}>
                Save Changes
              </button>

              <button onClick={cancelEditingReview}>
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <h3>{review.user.username}</h3>

              <p>Rating: {review.rating}/5</p>

              <p>{review.comment}</p>

              {user && review.user._id === user.id && (
                <button onClick={() => startEditingReview(review)}>
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {user && (
        <>
          <h2>Write a Review</h2>

          <form onSubmit={submitReview}>
            <div>
              <label htmlFor="rating">Rating</label>

              <select
                id="rating"
                value={reviewRating}
                onChange={(event) =>
                  setReviewRating(Number(event.target.value))
                }
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>

            <div>
              <label htmlFor="comment">Comment</label>

              <textarea
                id="comment"
                value={reviewComment}
                onChange={(event) =>
                  setReviewComment(event.target.value)
                }
                placeholder="Write your review..."
              />
            </div>

            <button type="submit" disabled={reviewSubmitting}>
              {reviewSubmitting
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default GameDetails;