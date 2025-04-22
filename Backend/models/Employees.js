const mongoose = require('../mongoConnect');
const { documentSchema } = require('./Documents');
// const contactSchema = require('./Contact');
const { contactSchema } = require('./Contact');

const { Schema } = mongoose;

const employeeSchema = new Schema(
    {
       username:{
        type: String,
        required: true,
        unique: true
       },
       email:{
        type: String,
        required: true,
        unique: true
       },
        password:{
            type: String,
            required: true
        },
        role:{
            type: String, 
            enum: ['Employee', 'HR'],
            default: 'Employee'
        },
        personalInfo:{
            firstName:{
                type: String,
                required: true 
            },
            lastName:{
                type: String,
                required: true
            },
            middleName:{
                type: String,
                default:''
            },
            preferredName:{
                type: String,
                default: ''
           },
           profilePictue:{
                type: String, 
                default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT27iddc2lkX_Zi1p091hfLXpf3vBcbeV9E4g&s'
           },
           address:{
            street: String,
            building: String,
            city: String,
            state: String,
            zip: String
           },
           cellPhone: String,
           workPhone: String,
        },
        onboading:{
            status:{
                type: String, 
                enum:['Pending', 'Approved', 'Rejected'],
                default: 'Pending'
            },
            feedback: String
           },

           visa:{
            isCitizenOrResident: Boolean,
            visaType: String,
            startDate: Date,
            endDate: Date,
            documents: [documentSchema],
           },

           reference: contactSchema,
           emergencyContact: [contactSchema],

        createdAt: { 
            type: Date, 
            default: Date.now 
        },
        updatedAt: { 
            type: Date, 
            default: Date.now 
        },
    }
)

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;

