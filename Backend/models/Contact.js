const mongoose = require('../mongoConnect');
const { Schema } = mongoose;

const contactSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    middleName: String,
    phone: String,
    email: {
        type: String,
        required: true
    },
    relationship: String
})

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
module.exports.contactSchema = contactSchema;