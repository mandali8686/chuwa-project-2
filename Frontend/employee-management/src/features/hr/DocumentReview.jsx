import React, { useEffect, useState } from "react";

const DocumentReview = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("http://localhost:5400/api/documents");
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5400/api/documents/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Document deleted.");
        fetchDocuments(); // Refresh after delete
      } else {
        const data = await res.json();
        alert("Delete failed: " + (data.msg || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) return <p>Loading documents...</p>;

  return (
    <div>
      <h2>Uploaded Documents</h2>
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        documents.map((doc) => (
          <div
            key={doc._id}
            style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
          >
            <p>
              <strong>Employee ID:</strong> {doc.employeeId}
            </p>
            <p>
              <strong>Type:</strong> {doc.docType}
            </p>
            <p>
              <strong>File:</strong> {doc.fileName}
            </p>
            <p>
              <strong>Uploaded:</strong>{" "}
              {new Date(doc.uploadedAt).toLocaleString()}
            </p>
            <button
              onClick={() => handleDelete(doc._id)}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DocumentReview;
