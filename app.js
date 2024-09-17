const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const loginModel = require("./model/admin")
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

app.listen("8080", () => {
    console.log("server started")
})