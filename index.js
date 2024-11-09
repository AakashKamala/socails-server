const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
const mongoose=require("mongoose")

const userRoute=require("./routes/user")

dotenv.config();

const app=express()

app.use(cors())
app.use(express.json())
app.use("/api", userRoute)

const connectDb=mongoose.connect(process.env.MONGO_URI)

connectDb.then(()=>{
    console.log("db connected");
})

mongoose.connection.on("error",(err)=>{
    console.log("db connection failed", err.message);
})

app.get("/",(req, res)=>{
    return res.json({"message": "alive"})
})

const PORT=process.env.PORT||8008

app.listen(PORT,()=>{
    console.log(process.env.PORT);
    console.log("app is listening on port", PORT);
})