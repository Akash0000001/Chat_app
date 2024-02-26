const Sequelize=require("sequelize")
const sequelize=require("../util/database")
const ArchivedChat =sequelize.define('ArchivedChat', {
    message_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message_content: {
    type:Sequelize.STRING,
      allowNull: false
    },
    message_date: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  module.exports=ArchivedChat