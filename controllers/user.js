const Users=require("../models/user")
const bcrypt=require("bcrypt")
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