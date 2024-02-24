const express= require ("express")
const bodyparser= require("body-parser")
const http=require("http")
const path=require("path")
const cors=require("cors")
require("dotenv").config();
const sequelize=require("./util/database")
const userRoutes=require("./routes/user")
const chatRoutes=require("./routes/chat")
const groupRoutes=require("./routes/group")
const Users=require("./models/user")
const Chats=require("./models/chat")
const Groups=require("./models/group")
const GroupMembers=require("./models/groupMember");
const { error } = require("console");
const ioauthorize=require("./middlewares/ioauthorize")

const app= express();
const server=http.createServer(app)
app.use(cors())
app.use(bodyparser.json({extended:false}))
app.use("/user",userRoutes)
app.use("/chats",chatRoutes)
app.use("/groups",groupRoutes)
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})

Users.hasMany(Chats)
Chats.belongsTo(Users)

Groups.hasMany(Chats)
Chats.belongsTo(Groups)

Users.belongsToMany(Groups,{through:GroupMembers})
Groups.belongsToMany(Users,{through:GroupMembers})

sequelize.sync()
.then((res)=>{
server.listen(3000,()=>console.log("server started"))
const io=require("socket.io")(server) 
const userSocket={}
    io.on("connection",socket=>{
        const socketEmail=socket.user.email
        userSocket[socketEmail]=socket.id
        socket.on("send-message",message=>{
    io.emit("recieve-message",message)
        })
        socket.on("add-member",(group,email)=>{
            if(userSocket[socketEmail])
            {
                socket.to(userSocket[email]).emit("display-group",group)
            }
        })
        socket.on("make-admin",(groupId,email)=>{
            if(userSocket[socketEmail])
            {
                socket.to(userSocket[email]).emit("display-admin",groupId)
            }
        })
        socket.on("send-removemember",(groupId,email)=>
        {
            if(userSocket[socketEmail])
            {
                socket.to(userSocket[email]).emit("remove-member",groupId)
            }
        })
    })
    io.use(ioauthorize)

})
.catch(err=>console.log(err))
