const Sequelize=require("sequelize")
const sequelize=require("../util/database")

const Groups=sequelize.define("groups",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    admin:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=Groups