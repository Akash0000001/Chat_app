const Groups=require("../models/group")
const {Op}=require("sequelize")
const Users=require("../models/user")
const groupMembers=require("../models/groupMember")

exports.getGroups=async (req,res,next)=>{
    try{
    const groups=await req.user.getGroups({where:{id:{[Op.gt]:req.query.lastGroupId}}})
    res.status(200).json(groups)
}
catch(err)
{
    console.log(err)
}
}

exports.createGroup=async (req,res,next)=>{
    try
    {
        const groupName=req.body.groupName
        const adminEmail=req.user.email
        const group =await req.user.createGroup({name:groupName,admin:adminEmail})
    }
    catch(err)
    {
        console.log(err)
    }
}

exports.addMember=async (req,res,next)=>{
    try
    {
        const memberEmail=req.body.email
        const groupId=req.body.groupId
        const member=await Users.findOne({where:{email:memberEmail}})
        
        if(member)
        {
         const groupMember =await groupMembers.findOne({where:{userId:member.id,groupId:groupId}})
         if(groupMember)
         {
            res.status(200).json(`${memberEmail} already present in the group`)
         }
         else
         {
            const newGroupMember=await groupMembers.create({userId:member.id,groupId:groupId})
            res.status(201).json(`${memberEmail} added to the group`)
         }
        }
        else
        {
            res.status(202).json(`${memberEmail} not found`)
        }
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json(err)
    }
}

