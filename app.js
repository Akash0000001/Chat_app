const express= require ("express")
const bodyparser= require("body-parser")
const path=require("path")
const cors=require("cors")
require("dotenv").config();
const sequelize=require("./util/database")
const userRoutes=require("./routes/user")
const app= express();
app.use(cors())
app.use(bodyparser.json({extended:false}))
app.use("/user",userRoutes)
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,`Public/${req.url}`))
})
sequelize.sync()
.then((res)=>app.listen(3000))
.catch(err=>console.log(err))