import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"
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
      <div className="flex flex-col items-center justify-center">
        <Button variant="destructive">Destructive</Button>
      </div>
      <h1>Formify</h1>
      <h2>Backend Data:</h2>
      <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
    </>
  );
}

export default App;
