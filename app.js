const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcrypt")
const loginModel = require("./model/admin")
const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://alfiyakn:alfiyakn@cluster0.l8relji.mongodb.net/patientnewdb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup",(req,res)=>{
    let input=req.body
    let hashedPassword=bcrypt.hashSync(input.password,10)
    input.password=hashedPassword
    console.log(input)
    let result=new loginModel(input)
    result.save()
    res.json({"status":"success"})
})

app.listen("8080",()=>{
    console.log("server started")
})