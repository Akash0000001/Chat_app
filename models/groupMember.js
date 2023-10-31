const Sequelize=require("sequelize")
const sequelize=require("../util/database")

const GroupMembers=sequelize.define("groupMembers",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    //status:Sequelize.STRING
})

module.exports=GroupMembers