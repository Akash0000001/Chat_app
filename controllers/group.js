const Groups=require("../models/group")
const {Op}=require("sequelize")

exports.getGroups=async (req,res,next)=>{
    try{
        console.log(req.query)
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

