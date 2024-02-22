const Users=require("../models/user")
const Groups=require("../models/group")
const Chats=require("../models/chat")
const groupAdmin=require("../models/groupAdmin")
const groupMembers=require("../models/groupMember")
const {Op}=require("sequelize")
const { error } = require("console")

exports.getChats=async (req,res,next)=>{
    try{
    const group =await Groups.findOne({where:{id:req.query.groupId}})
    const groupUser=await groupMembers.findOne({where:{userId:userId,groupId:group.id}})
    if(groupUser){
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
else
{
    throw new Error(`${req.user.email} not present in the ${group.name}`)
}
}
catch(err)
{
    console.log(err)
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