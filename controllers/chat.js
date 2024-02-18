const Users=require("../models/user")
const Groups=require("../models/group")
const Chats=require("../models/chat")
const groupAdmin=require("../models/groupAdmin")
const {Op}=require("sequelize")

exports.getChats=async (req,res,next)=>{
    try{
    const group =await Groups.findOne({where:{id:req.query.groupId}})
     const chats=await Chats.findAll({where:{id:{[Op.gt]:req.query.lastMessageId},groupId:req.query.groupId},include:[
        {
            model:Users,
            attributes:["name"]
    }
    ]
     })
    const groupadmin=await groupAdmin.findOne({where:{groupId:group.id,adminEmail:req.user.email}})
    res.status(200).json({chats,admin:groupadmin!=null})
}
catch(err)
{
    res.status(404).json(err)
}
}

exports.addChat=async (req,res,next)=>{
    try{
    const chat=await req.user.createChat({message:req.body.message,groupId:req.body.groupId})
    const user={name:req.user.name}
    res.status(201).json({chat,user})
    }
    catch(err)
    {
        res.status(404).json(err)
    }
}