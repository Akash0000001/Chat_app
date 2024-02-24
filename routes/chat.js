const express=require("express")

const router = express.Router()
const authenticate=require("../middlewares/authorize")

const chatController=require("../controllers/chat")

router.get("/",authenticate,chatController.getChats)

router.post("/",authenticate,chatController.addChat)
router.post("/uploadfile",authenticate,chatController.uploadFile,chatController.addFileUrltoDatabase)

module.exports=router