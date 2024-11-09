const bcrypt=require("bcryptjs")
const User=require("../models/user")
const jwt=require("jsonwebtoken")
const authenticateToken=require("../middlewares/user")

const signup=async(req, res)=>{
    const receivedUser=req.body;
    console.log(receivedUser);
    
    const hashedPassword=await bcrypt.hash(receivedUser.password, 8)
    try {
        const emailExist=await User.findOne({"email": receivedUser.email})
        if(emailExist){
            return res.json({"message": "email already exists"})
        }

        const newUser=new User({
            ...receivedUser,
            password: hashedPassword,
        })
    
        const createUser=await newUser.save();
        
        const authToken=jwt.sign({email:receivedUser.email}, process.env.JWT_SECRET)

        return res.json({"message": "signup successful", "authToken": authToken})
    } catch (error) {
        return res.json({"message": `errror during signup: ${error.message}`})
    }
}

const login = async (req, res)=> {
    const receivedUser=req.body;
    try {
        const userExist = await User.findOne( {"email": receivedUser.email});
        if (userExist) {
            const validPassword = await bcrypt.compare(receivedUser.password, userExist.password);
            if (validPassword) {
                const authToken=jwt.sign({email:receivedUser.email}, process.env.JWT_SECRET)
                return res.json({"message": "You have signed in successfully", "authToken": authToken});
            } else {
                res.json({"message": "Email or password didn't match"});
            }
        } else {
            res.json({"message": "Email or password didn't match"});
        }
    } catch (error) {
        console.log(error);
        res.json({"message": `Error occurred during signin: ${error}`});
    }
}

module.exports = { signup, login };