import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Game {
  _id: string;
  title: string;
  image: string;
}

interface CollectionItem {
  _id: string;
  game: Game;
  status: "Want to Play" | "Playing" | "Completed";
  addedAt: string;
}

function Collection() {
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await api.get("/collection");
        setCollection(data);
      } catch (error) {
        setError("Failed to load your collection");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  const updateStatus = async (
    id: string,
    status: "Want to Play" | "Playing" | "Completed"
  ) => {
    try {
      const updatedItem = await api.put(`/collection/${id}`, {
        status,
      });

      setCollection((currentCollection) =>
        currentCollection.map((item) =>
          item._id === id ? updatedItem : item
        )
      );
    } catch (error) {
      setError("Failed to update game status");
    }
  };

  const removeFromCollection = async (id: string) => {
    try {
      await api.delete(`/collection/${id}`);

      setCollection((currentCollection) =>
        currentCollection.filter((item) => item._id !== id)
      );
    } catch (error) {
      setError("Failed to remove game from collection");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-cyan-400">Loading collection...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-red-400">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Your Games
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            My Collection
          </h1>

          <p className="mt-3 text-slate-400">
            Keep track of the games you want to play, are playing,
            and have completed.
          </p>
        </div>

        {collection.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-3xl">
              🎮
            </div>

            <h2 className="text-2xl font-bold">
              Your Collection Is Empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-400">
              Search for a game and add it to your collection
              to start tracking your games.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {collection.length}{" "}
                {collection.length === 1 ? "game" : "games"}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {collection.map((item) => (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-blue-950/30"
                >
                  {/* Game Image */}
                  {item.game.image ? (
                    <img
                      src={item.game.image}
                      alt={item.game.title}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-slate-800 text-slate-500">
                      No Image
                    </div>
                  )}

                  <div className="p-5">
                    <h2 className="truncate text-lg font-semibold">
                      {item.game.title}
                    </h2>

                    {/* Status */}
                    <div className="mt-4">
                      <label
                        htmlFor={`status-${item._id}`}
                        className="mb-2 block text-sm text-slate-400"
                      >
                        Status
                      </label>

                      <select
                        id={`status-${item._id}`}
                        value={item.status}
                        onChange={(event) =>
                          updateStatus(
                            item._id,
                            event.target.value as
                              | "Want to Play"
                              | "Playing"
                              | "Completed"
                          )
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
                      >
                        <option value="Want to Play">
                          Want to Play
                        </option>

                        <option value="Playing">
                          Playing
                        </option>

                        <option value="Completed">
                          Completed
                        </option>
                      </select>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() =>
                        removeFromCollection(item._id)
                      }
                      className="mt-4 w-full rounded-lg border border-red-900 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Collection;