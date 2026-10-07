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

              <p>Status: {item.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collection;