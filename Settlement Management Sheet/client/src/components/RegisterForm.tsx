import React, { useState } from "react";
import { register } from "../services/authService.js"; // Reuse the API service for registering users

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("player"); // Default to 'player'

  const handleRegister = async () => {
    try {
      await register(username, password, role); // Call your backend API
      alert("Registration successful! You can now log in.");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent form submission from refreshing the page
          handleRegister();
        }}
      >
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="player">Player</option>
            <option value="dm">Dungeon Master</option>
            <option value="resident">Resident</option>
          </select>
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
