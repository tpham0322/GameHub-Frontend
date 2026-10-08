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

  const cleanDescription = (description: string) => {
    return description.replace(/<[^>]*>/g, "");
  };

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

  const deleteReview = async (reviewId: string) => {
    try {
      await api.delete(`/games/${reviewId}`);

      setReviews((currentReviews) =>
        currentReviews.filter((review) => review._id !== reviewId)
      );
    } catch (error) {
      setReviewsError("Failed to delete review");
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
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-cyan-400">Loading game...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
        <p>{error}</p>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>Game not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Game Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {game.background_image && (
            <img
              src={game.background_image}
              alt=""
              className="h-full w-full object-cover opacity-20 blur-sm"
            />
          )}

          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-10 lg:grid-cols-[400px_1fr]">
            {/* Cover */}
            <div>
              {game.background_image && (
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full rounded-2xl border border-slate-700 shadow-2xl shadow-blue-950/50"
                />
              )}
            </div>

            {/* Information */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Game Details
              </p>

              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                {game.name}
              </h1>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                  ⭐ {game.rating || "N/A"}
                </span>

                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  Released: {game.released || "Unknown"}
                </span>
              </div>

              <p className="mt-6 leading-7 text-slate-300">
                {cleanDescription(game.description)}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {game.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-cyan-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {user && (
                <button
                  onClick={addToCollection}
                  className="mt-8 w-fit rounded-xl bg-blue-600 px-6 py-3 font-semibold shadow-lg shadow-blue-900/30 transition hover:bg-blue-500"
                >
                  + Add to Collection
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Community
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Reviews
          </h2>
        </div>

        {reviewsLoading && (
          <p className="text-slate-400">Loading reviews...</p>
        )}

        {reviewsError && (
          <p className="mb-6 text-red-400">{reviewsError}</p>
        )}

        {!reviewsLoading && reviews.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              No reviews yet. Be the first to review this game!
            </p>
          </div>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              {editingReviewId === review._id ? (
                <div>
                  <h3 className="mb-5 text-xl font-semibold">
                    Edit Review
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`edit-rating-${review._id}`}
                        className="mb-2 block text-sm text-slate-400"
                      >
                        Rating
                      </label>

                      <select
                        id={`edit-rating-${review._id}`}
                        value={editRating}
                        onChange={(event) =>
                          setEditRating(
                            Number(event.target.value)
                          )
                        }
                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor={`edit-comment-${review._id}`}
                        className="mb-2 block text-sm text-slate-400"
                      >
                        Comment
                      </label>

                      <textarea
                        id={`edit-comment-${review._id}`}
                        value={editComment}
                        onChange={(event) =>
                          setEditComment(event.target.value)
                        }
                        className="min-h-28 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          updateReview(review._id)
                        }
                        className="rounded-lg bg-blue-600 px-5 py-2 font-semibold transition hover:bg-blue-500"
                      >
                        Save Changes
                      </button>

                      <button
                        onClick={cancelEditingReview}
                        className="rounded-lg border border-slate-700 px-5 py-2 font-semibold text-slate-300 transition hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-cyan-400">
                        {review.user.username}
                      </h3>

                      <p className="mt-1 text-sm text-yellow-400">
                        {"★".repeat(review.rating)}
                        <span className="text-slate-700">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </p>
                    </div>

                    {user &&
                      review.user._id === user.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              startEditingReview(review)
                            }
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-blue-500 hover:text-cyan-400"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteReview(review._id)
                            }
                            className="rounded-lg border border-red-900 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-950"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                  </div>

                  <p className="mt-4 leading-7 text-slate-300">
                    {review.comment}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Write Review */}
        {user && (
          <div className="mt-10 rounded-2xl border border-blue-900/50 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              Write a Review
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Share your thoughts about {game.name}.
            </p>

            <form
              onSubmit={submitReview}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="rating"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Rating
                </label>

                <select
                  id="rating"
                  value={reviewRating}
                  onChange={(event) =>
                    setReviewRating(
                      Number(event.target.value)
                    )
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white outline-none focus:border-cyan-400"
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Great</option>
                  <option value={5}>5 - Excellent</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Comment
                </label>

                <textarea
                  id="comment"
                  value={reviewComment}
                  onChange={(event) =>
                    setReviewComment(event.target.value)
                  }
                  placeholder="Write your review..."
                  className="min-h-32 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold shadow-lg shadow-blue-900/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewSubmitting
                  ? "Submitting..."
                  : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default GameDetails;