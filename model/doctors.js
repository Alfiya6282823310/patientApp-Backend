const mongoose=require("mongoose")
const DoctorSchema=mongoose.Schema(
    {
        "name":String,
        "qualification":String,
        "Specialization":String,
        "contact":Number
    }
)
const DoctorModel=mongoose.model("Adddoctor",DoctorSchema)
module.exports=DoctorModel