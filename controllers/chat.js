const Users=require("../models/user")
const Chats=require("../models/chat")

exports.getChats=async (req,res,next)=>{
    try{
    const chats=await Chats.findAll({include:[
        {
            model:Users,
            attributes:["name"]
        }
    ]
    })
    res.status(200).json(chats)
}
catch(err)
{
    console.log(err)
}
}

exports.addChat=async (req,res,next)=>{
    try{
    const chat=await req.user.createChat({id:req.body.id,message:req.body.message})
    const user={name:req.user.name}
    res.status(201).json({chat,user})
    }
    catch(err)
    {
        console.log(err)
    }
}