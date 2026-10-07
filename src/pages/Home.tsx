import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, logout } = useAuth();

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
    </div>
  );
}

export default Home;