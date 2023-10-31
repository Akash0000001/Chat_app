const Users=require("../models/user")
const Groups=require("../models/group")
const Chats=require("../models/chat")
const {Op}=require("sequelize")

exports.getChats=async (req,res,next)=>{
    try{
        console.log(req.query)
    const group =Groups.findOne({where:{id:req.body.groupId}})
    const chats=await Chats.findAll({where:{id:{[Op.gt]:req.query.lastMessageId,groupId:req.body.groupId}},include:[
        {
            model:Users,
            attributes:["name"]
        }
    ]
    })
    res.status(200).json({chats,admin:group.admin===req.user.email})
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