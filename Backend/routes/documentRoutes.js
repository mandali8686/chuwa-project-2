const express = require("express");
const router = express.Router();
const Document = require("../models/Documents");
const { verifyToken, requireHR } = require("../middlewares/verifyToken");

// POST /api/documents/upload
router.post("/upload", async (req, res) => {
  const { employeeId, docType, fileName, fileData } = req.body;

  if (!employeeId || !docType || !fileData) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newDoc = new Document({
      employeeId,
      docType,
      fileName,
      fileData,
    });

    await newDoc.save();
    res.status(201).json({ msg: "Document uploaded", document: newDoc });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

router.get("/:employeeId", async (req, res) => {
  try {
    const docs = await Document.find({ employeeId: req.params.employeeId });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

router.patch("/:id", async (req, res) => {
  const { status, feedback } = req.body;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      { status, feedback },
      { new: true }
    );

    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

router.delete("/:id", verifyToken, requireHR, async (req, res) => {
  try {
    const deleted = await Document.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Document not found" });
    res.json({ msg: "Document deleted successfully", document: deleted });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

module.exports = router;
