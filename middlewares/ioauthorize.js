const jwt=require("jsonwebtoken")
const User=require("../models/user")

const ioauthenticate=async (socket,next)=>{
try{
    const token=socket.handshake.auth.token
    const user=jwt.verify(token,process.env.JWT_SECRET_KEY)
    User.findByPk(user.userId)
    .then(user=>{
        socket.user=user
        next()
    })
    .catch(err=>{
        throw new Error(err)
    })
}
catch(err){
        console.log(err)
    }
}

module.exports=ioauthenticate