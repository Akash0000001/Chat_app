const Sequelize=require("sequelize")
const sequelize=require("../util/database")

const groupAdmin=sequelize.define("groupAdmin",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    GroupId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    adminEmail:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=groupAdmin