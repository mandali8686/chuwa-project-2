import React, { useState } from "react";

const RegisterToken = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setToken("");

    try {
      const res = await fetch("http://localhost:5400/api/hr/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
      } else {
        setError(data.msg || "Token generation failed.");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div>
      <h2>Generate Onboarding Token</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter employee email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Generate</button>
      </form>

      {token && (
        <div>
          <p>🎉 Token Generated:</p>
          <code>{token}</code>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegisterToken;
