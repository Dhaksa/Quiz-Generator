import React, { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import QuizView from "./components/QuizView";
import QuizCalendar from "./components/QuizCalendar";
import "./App.css";

function App() {
  const [filename, setFilename] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      localStorage.setItem("username", username.trim());
      alert(`Welcome, ${username.trim()}!`);
    }
  };

  return (
    <div className="app-container">
      <h1>Quiz Generator</h1>

      {!username ? (
        <div className="auth-box">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleUsernameSubmit}>Save</button>
        </div>
      ) : (
        <>
          <p>Hi, <strong>{username}</strong> 👋</p>

          <FileUpload setFilename={setFilename} />
          {filename && <QuizView filename={filename} username={username} />}
          {filename && <QuizCalendar username={username} />}
        </>
      )}
    </div>
  );
}

export default App;
