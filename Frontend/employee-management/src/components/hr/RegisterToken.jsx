// src/components/hr/RegisterToken.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateToken } from "../../redux/hrSlice";

const RegisterToken = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const { token, loading, error } = useSelector((state) => state.hr);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateToken(email));
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Generate Onboarding Token</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Enter employee email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-4 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate
        </button>
      </form>

      {token && (
        <div className="mt-4">
          <p>🎉 Token Generated:</p>
          <code className="text-sm text-green-700">{token}</code>
        </div>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default RegisterToken;
