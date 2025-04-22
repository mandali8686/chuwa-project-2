const Document = require('../models/Documents');

// Get all documents
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create document
exports.createDocument = async (req, res) => {
  try {
    const newDoc = new Document(req.body);
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update document
exports.updateDocument = async (req, res) => {
  try {
    const updated = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Document not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const deleted = await Document.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Document not found' });
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
