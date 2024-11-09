const {signup, login}=require("../controllers/user")
const express=require("express")

const router=express.Router();

router.route("/signup").post(signup)
router.route("/signup").get((req, res)=>{
    return res.json("jjj")
})
router.route("/login").post(login)

module.exports=router