import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/api/data")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <h1>Available Users: {users.length}</h1>

      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
        </div>
      ))}
    </>
  );
}

export default App;
