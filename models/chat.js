const Sequelize=require("sequelize")
const sequelize=require("../util/database.js")

const Chats=sequelize.define("chats",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    type:
    {
        type:Sequelize.STRING,
        allowNull:false
    },
    filename:Sequelize.STRING
})

module.exports=Chats