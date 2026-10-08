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
    return <p>Loading collection...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>My Collection</h1>

      {collection.length === 0 ? (
        <p>Your collection is empty.</p>
      ) : (
        <div>
          {collection.map((item) => (
            <div key={item._id}>
              {item.game.image && (
                <img
                  src={item.game.image}
                  alt={item.game.title}
                  width="200"
                />
              )}

              <h2>{item.game.title}</h2>

              <label htmlFor={`status-${item._id}`}>
                Status:
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
              >
                <option value="Want to Play">Want to Play</option>
                <option value="Playing">Playing</option>
                <option value="Completed">Completed</option>
              </select>

              <button onClick={() => removeFromCollection(item._id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collection;