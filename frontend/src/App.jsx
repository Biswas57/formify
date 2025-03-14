import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/data/")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <>
      <h1>Formify</h1>
      <h2>Backend Data:</h2>
      <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
    </>
  );
}

export default App;
