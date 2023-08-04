const Users=require("../models/user")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
exports.addUser=(req,res,next)=>{
    const {name,email,password}=req.body
    const saltrounds=10;
    bcrypt.hash(password,saltrounds,async (err,hash)=>
    {
    try{
    const user =await Users.findOne({where:{email:email}})
    if(!user)
    {    
    const result=await Users.create({
        name:name,
        email:email,
        password:hash
    })
    res.status(200).json({message:"user created successfully",success:true})
}
else
{
    res.status(201).json({message:"User already exists,please login",success:true})
}
}
catch(err)
{
    res.status(400).send(err)
}
})
}

function generateaccesstoken(id,name)
{
    return jwt.sign({userId:id,name:name},"SGHP07899yuiichjkqicnms6789")
}
exports.authorizeUser=async (req,res,next)=>{
    try{
    const users=await Users.findAll()
        for(let i=0;i<users.length;i++)
        {
            if(users[i].email===req.body.email)
            {
                return bcrypt.compare(req.body.password,users[i].password,(err,result)=>{
                    if(err)
                    {
                        throw new Error("Something went wrong")
                    }
                    if(result===true)
                    {
                        res.status(200).json({success:true,message:"User logged in successfully",token:generateaccesstoken(users[i].id,users[i].name)})
                    }
                    else
                    {
                        res.status(401).json({success:false,message:"User not authorized"})
                    }

                })
                 
            }
            
        }
    
        return res.status(404).json({success:false,message:"User not found"})
    }
    catch(err)
    {
    res.status(500).json({message:err,success:false})
    }
}