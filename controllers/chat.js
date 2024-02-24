const Users=require("../models/user")
const Groups=require("../models/group")
const Chats=require("../models/chat")
const groupAdmin=require("../models/groupAdmin")
const groupMembers=require("../models/groupMember")
const {Op}=require("sequelize")
const multer = require('multer'); // For handling file uploads
const aws = require('aws-sdk');
const multerS3=require("multer-s3");
const { error } = require("console")

const s3 = new aws.S3({
    accessKeyId: process.env.IAMUSER_ACCESS_KEY,
    secretAccessKey:process.env.IAMUSER_SECRET_ACCESS_KEY,
    region:"ap-south-1"
  })
  
  // Configure multer to upload files in aws-s3
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'chattapp', // Replace with your S3 bucket name
      contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type based on the file extension
      acl: 'public-read', // Set the access control level for the uploaded file
      key: function(req, file, cb) {
      cb(null,file.originalname); // Set the key (filename) of the uploaded file
      }
    })
  });

exports.getChats=async (req,res,next)=>{
    try{
    const group =await Groups.findOne({where:{id:req.query.groupId}})
    const userId=req.user.id
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
    
    const chat=await req.user.createChat({message:req.body.message,groupId:req.body.groupId,type:"text"})
    const user={name:req.user.name}
    res.status(201).json({chat,user})
    }
    catch(err)
    {
        console.log(err)
    }
}
exports.uploadFile=upload.single('file')
exports.addFileUrltoDatabase=async(req,res,next)=>{
    try{
        console.log(req.body)
        const chat=await req.user.createChat({message:req.file.location,groupId:req.body.groupId,type:"url",filename:req.file.originalname})
        const user={name:req.user.name}
        res.status(201).json({chat,user})
        }
        catch(err)
        {
            console.log(err)
            res.status(400).json(err)
        }
}