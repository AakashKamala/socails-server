const bcrypt=require("bcryptjs")
const User=require("../models/user")
const jwt=require("jsonwebtoken")
const authenticateToken=require("../middlewares/user")

// const signup=async(req, res)=>{
//     const receivedUser=req.body;
//     console.log(receivedUser);
    
//     const hashedPassword=await bcrypt.hash(receivedUser.password, 8)
//     try {
//         const emailExist=await User.findOne({"email": receivedUser.email})
//         if(emailExist){
//             return res.json({"message": "email already exists"})
//         }

//         const newUser=new User({
//             ...receivedUser,
//             password: hashedPassword,
//         })
    
//         const createUser=await newUser.save();
        
//         const authToken=jwt.sign({email:receivedUser.email}, process.env.JWT_SECRET)

//         return res.json({"message": "signup successful", "authToken": authToken})
//     } catch (error) {
//         return res.json({"message": `errror during signup: ${error.message}`})
//     }
// }


const signup = async (req, res) => {
    const receivedUser = req.body;
    console.log('Received user data:', receivedUser);
    
    try {
        // Input validation
        if (!receivedUser.email || !receivedUser.password || !receivedUser.username) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Check if email exists
        const emailExist = await User.findOne({ email: receivedUser.email });
        console.log('Email exists check:', emailExist ? 'Yes' : 'No');
        
        if (emailExist) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(receivedUser.password, 8);
        console.log('Password hashed successfully');

        // Create new user instance
        const newUser = new User({
            ...receivedUser,
            password: hashedPassword,
        });
        console.log('New user instance created:', newUser);

        // Save user to database
        const createdUser = await newUser.save();
        console.log('User saved to database:', createdUser._id);

        // Generate JWT token
        const authToken = jwt.sign(
            { email: receivedUser.email, userId: createdUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            authToken
        });

    } catch (error) {
        console.error('Signup error:', error);
        
        // MongoDB validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        // MongoDB connection error
        if (error.name === 'MongooseError' || error.name === 'MongoError') {
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: error.message
            });
        }

        // Generic error
        return res.status(500).json({
            success: false,
            message: "Error during signup",
            error: error.message
        });
    }
};

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