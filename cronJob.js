const { CronJob }=require('cron');
const Chat=require("./models/chat")
const ArchivedChat=require("./models/archivedChat")
const Sequelize=require("sequelize")

const job = new CronJob(
	'0 0 * * *', // cron Time (00:00)
	
    function () {
        moveOldMessages()
    .then(() => {
      console.log('Old messages moved successfully.');
    })
    .catch(error => {
      console.error('Error moving old messages:', error);
    })
	}, //onTick
	null, // onComplete
	true, // start
	'Asia/Kolkata' // timeZone
);

async function moveOldMessages  ()  {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    // Find all messages in Chat that are one day old or older
    const messagesToArchive = await Chat.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.lte]: oneDayAgo
        }
      }
    });
  
    // Move each message to ArchivedChat
    for (const message of messagesToArchive) {
      await ArchivedChat.create({
        message_content: message.message,
        message_date: message.createdAt
      });
    }
  
    // Delete the archived messages from Chat
    await Chat.destroy({
      where: {
        createdAt: {
          [Sequelize.Op.lte]: oneDayAgo
        }
      }
    });
  }

module.exports=job