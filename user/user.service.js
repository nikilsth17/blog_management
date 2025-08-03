
import bcrypt from "bcrypt";
import { User } from "./user.model.js";
import { loginUserValidationSchema, registerUserValidationSchema } from "./user.validation.js";
import jwt from "jsonwebtoken";


//======================    register a user   ================================================
export const registerUser= async(req,res)=>{
    //extract userData from req.body
        const newUser= req.body;
    //validate userData with Joi
    try {
        await registerUserValidationSchema.validateAsync(newUser)
    } catch (error) {
    // if validation fail,terminate
        return res.status(400).send({message:error.message});
    }
    
    // check if user email is already exists
    const user= await User.findOne({email:newUser.email})
    // if already exist email,terminate 
    if (user){
        return res.status(409).send({message:"User is already exists."});
    }
    
    //hash password using bcrypt.hash()
    const hashedPassword= await bcrypt.hash(newUser.password,10);
    // create user on db
    newUser.password= hashedPassword;
    await User.create(newUser);
    // return response
        return res.status(201).send({message:"User is registered successfully..."});
};



// ===============    login user   ========================

export const loginUser=async(req,res)=>{
    const loginCredential= req.body;

    //validate login credentials
    
     
    try {
        await loginUserValidationSchema.validateAsync(loginCredential);
    } catch (error) {
            // if validation Fails, terminate
        return res.status(400).send({message:error.message});
        
    }

    // check if user with provided email exist
    const user= await User.findOne({email:loginCredential.email});

    // if not user,terminate
    if (!user){
        return res.status(404).send({message:"Invalid credentials"});
    }

    // check for password match using bcrypt.compare()
    const passwordMatch= await bcrypt.compare(
        loginCredential.password,
        user.password
    );

    // if not password Match, terminate
    if (!passwordMatch){
        return res.status(404).send({message:"Invalid credentials"});
    }

    //encrypt user information as a token using jsonwebtoken, jwt.sign(token,secret_key)
    const token=jwt.sign(
        {email:user.email},
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn:"1d",    //token limitation time
        }
    );

        //hide user password
    user.password=undefined;

    return res.status(200).send({user,token});
};
