const mongoose = require('../mongoConnect');
const { Schema } = mongoose;

const documentSchema = new Schema(
    {
        documentType: String,
        fileUrl: String,
        status:{
            type: String,
            enum:['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        feedback: String
    }
)

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;