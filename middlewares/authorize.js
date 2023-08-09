const jwt=require("jsonwebtoken")
const User=require("../models/user")

const authenticate =async (req,res,next)=>{
    try{
        const token=req.header("Authorization")
        const user=jwt.verify(token,process.env.JWT_SECRET_KEY)
        User.findByPk(user.userId)
        .then(user=>{
            req.user=user
            next()
        })
    }
        catch(err){
            res.status(401).json({success:false})
            console.log(err)
        }
    
}

module.exports=authenticate;