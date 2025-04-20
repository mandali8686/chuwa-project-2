const { mongoose } = require("../mongoConnect"); // ✅ 从这里拿 Schema 构造器
const { Schema } = mongoose;

const employeeSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Employee", "HR"],
    default: "Employee",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
