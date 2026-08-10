import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Загрузка...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://backend-production-30ca.up.railway.app")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend вернул ошибку");
        }

        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error(error);
        setError("Не удалось подключиться к Backend");
      });
  }, []);

  return (
    <div>
      <h1>Flexora</h1>

      {error ? (
        <p>{error}</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

export default App;