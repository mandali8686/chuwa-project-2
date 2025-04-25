// src/components/hr/DocumentReview.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments, deleteDocument } from "../../features/hr/hrSlice";

const DocumentReview = () => {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.hr);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      dispatch(deleteDocument(id));
    }
  };

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        documents.map((doc) => (
          <div key={doc._id} className="border p-4 mb-4">
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
              className="bg-red-500 text-white px-4 py-1 rounded"
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
