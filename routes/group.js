const express=require("express")

const router = express.Router()
const authenticate=require("../middlewares/authorize")
const groupController=require("../controllers/group")

router.get("/",authenticate,groupController.getGroups)

router.post("/create",authenticate,groupController.createGroup)
router.post("/addMember",authenticate,groupController.addMember)

module.exports=router