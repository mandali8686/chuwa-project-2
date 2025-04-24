const mongoose = require("../mongoConnect");

const documentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  docType: {
    type: String,
    enum: ["Passport", "I-9", "EAD", "Visa"],
    required: true,
  },
  fileName: String,
  fileData: String, // base64 encoded
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Document = mongoose.model("Document", documentSchema);

module.exports = {
  Document,
  documentSchema,  
};
