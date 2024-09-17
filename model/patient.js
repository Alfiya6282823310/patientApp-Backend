const mongoose = require("mongoose")
const PatientSchema = mongoose.Schema(
    {
        patientid:{type:String},
        name:{type:String},
        adress:{type:String},
        contact:{type:String},
        email:{type:String},
        password:{type:String}
    }
)
const PatientModel = mongoose.model("patient",PatientSchema)
module.exports = PatientModel