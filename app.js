const express= require ("express")
const bodyparser= require("body-parser")
const path=require("path")
const cors=require("cors")
require("dotenv").config();
const sequelize=require("./util/database")
const userRoutes=require("./routes/user")
const chatRoutes=require("./routes/chat")
const Users=require("./models/user")
const Chats=require("./models/chat")

const app= express();
app.use(cors())
app.use(bodyparser.json({extended:false}))
app.use("/user",userRoutes)
app.use("/chats",chatRoutes)
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,`Public/${req.url}`))
})

Users.hasMany(Chats)
Chats.belongsTo(Users)

sequelize.sync()
.then((res)=>app.listen(3000))
.catch(err=>console.log(err))