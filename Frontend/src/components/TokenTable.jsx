import React from "react";

const TokenTable = ({ tokens }) => {
  if (!tokens || tokens.length === 0) {
    return <p>No tokens found.</p>;
  }

  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Email</th>
          <th>Token</th>
          <th>Used</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => (
          <tr key={token._id}>
            <td>{token.email}</td>
            <td>{token.token}</td>
            <td>{token.used ? "Yes" : "No"}</td>
            <td>{new Date(token.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TokenTable;
