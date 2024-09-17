const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const loginModel = require("./model/admin")
const DoctorModel = require("./model/doctors")
const PatientModel = require("./model/patient")
const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://alfiyakn:alfiyakn@cluster0.l8relji.mongodb.net/patientnewdb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup", (req, res) => {
    let input = req.body
    let hashedPassword = bcrypt.hashSync(input.password, 10)
    input.password = hashedPassword
    console.log(input)
    let result = new loginModel(input)
    result.save()
    res.json({ "status": "success" })
})

//Admin signin
app.post("/AdminSignIn", (req, res) => {
    let input = req.body
    let result = loginModel.find({ username: input.username }).then(
        (response) => {
            if (response.length > 0) {
                const validator = bcrypt.compareSync(input.password, response[0].password)
                if (validator) {
                    jwt.sign({ username: input.username }, "patient-app", { expiresIn: "1d" },
                        (error, token) => {
                            if (error) {
                                res.json({ "status": "something went wrong" })
                            } else {
                                res.json({ "status": "success", "token": token })
                            }
                        }
                    )

                } else {
                    res.json({ "status": "invalid password" })
                }
            } else {
                res.json({ "status": "invalid username" })
            }
        }
    ).catch()
})
//Add Doctor
app.post("/AddDoctor", (req, res) => {
    let input = req.body
    let token = req.headers.token
    jwt.verify(token, "patient-app",
        (error, decoded) => {
            if (decoded && decoded.username) {
                let result = new DoctorModel(input)
                result.save()
                res.json({ "status": "success" })
            }
            else {
                res.json({ "status": "invalid authentication" })
            }
        }

    )
})
//add patient
app.post("/Addpatient",(req,res)=>{
    let input=req.body
    let hashedPassword = bcrypt.hashSync(input.password,10)
    input.password = hashedPassword
    const DateObject = new Date()
    const currentYear = DateObject.getFullYear()
    //console.log(currentYear.toString())
    const currentMonth = DateObject.getMonth()+1
    //console.log(currentMonth.toString())
    const randomNumber = Math.floor(Math.random()*9999)+1000
    //console.log(randomNumber.toString())
    const patientid = "XYZ"+currentYear.toString()+currentMonth.toString()+randomNumber.toString()
    console.log(patientid)
    input.patientid = patientid
    console.log(patientid)
    console.log(input)
    const patient = new PatientModel(input)
    patient.save()
    res.json({"status":"success"})
})
//patient sign in
app.post("/PatientSignIn", (req, res) => {
    input = req.body
    let result = PatientModel.find({ patientid: input.patientid }).then(
        (response) => {
            if (response.length > 0) {
                const validator = bcrypt.compareSync(input.password, response[0].password)
                if (validator) {
                    jwt.sign({ id: input.patientid }, "patient-app", { expiresIn: "1d" },
                        (error, token) => {
                            if (error) {
                                res.json({ "status": "Something went wrong" })
                            } else {
                                res.json({ "status": "success", "token": token })
                            }
                        }
                    )
                } else {
                    res.json({ "status": "Invalid password" })
                }
            } else {
                res.json({ "status": "Invalid patient-Id" })
            }
        }
    ).catch()
})


app.listen("8080", () => {
    console.log("server started")
})