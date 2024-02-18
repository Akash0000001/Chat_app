const Groups=require("../models/group")
const groupAdmin=require("../models/groupAdmin")
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
    res.status(404).json(err)
}
}

exports.createGroup=async (req,res,next)=>{
    try
    {
        const groupName=req.body.groupName
        const group =await req.user.createGroup({name:groupName,createdBy:req.user.email})
        const newAdmin=await groupAdmin.create({GroupId:group.id,adminEmail:req.user.email})
        res.status(200).json({message:"group created successfully",success:true})
    }
    catch(err)
    {
        res.status(404).json({message:err,success:false})
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
        res.status(400).json(err)
    }
}

exports.makeAdmin=async (req,res,next)=>{
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
            
            const newAdmin=await groupAdmin.create({adminEmail:member.email,groupId:groupId})
            res.status(201).json(`${memberEmail} is now an admin.`)
         }
         else
         {
            res.status(200).json(`${memberEmail}  is not present in the group , Add ${memberEmail} to this group to make an admin.`)
         }
        }
        else
        {
            res.status(202).json(`${memberEmail} not found`)
        }
    }
    catch(err)
    {
        res.status(400).json(err)
    }
}
exports.removeMember=async (req,res,next)=>{
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
            
            const removeAdmin=await groupAdmin.delete({adminEmail:member.email,groupId:groupId})
            const removeMember=await groupMembers.delete({userId:member.id,groupId:groupId})
            res.status(201).json(`${memberEmail} removed from the group`)
         }
         else
         {
            res.status(200).json(`${memberEmail} is not present in the group`)
         }
        }
        else
        {
            res.status(202).json(`${memberEmail} not found`)
        }
    }
    catch(err)
    {
        res.status(400).json(err)
    }
}

