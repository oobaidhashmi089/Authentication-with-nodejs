const express = require ('express' );
const jwt = require ('jsonwebtoken');
const User = require('../models/user');
const bcrypt= require('bcryptjs');



const  authRouter = express.Router();

authRouter.post('/api/signup',async(req,res)=>
{  
try
{
    const {name,email,password}=req.body;
  
    const  existingUser =await User.findOne({email});
    if (existingUser)
    {
        return res.status(400).json({msg:"User with the same email already exists!"})
    }
     const hashedPass=await bcrypt.hash(password,10);
       let user =new User(
           {
               email,
               password:hashedPass,
               name,
           })
    
           user = await user.save();
           res.json(user);
}
catch(e)
{
    res.status(500).json({error:e.message});

}
    //get the data from client
   

//post the data in database 
    // return the from the user


});

//sign in Route

authRouter.post('/api/signin', async(req,res)=>
{
    try 
    {
        const{email,password} =req.body;
        const user = await User.findOne({email});
        if (!user)
        {
            return res.statusCode(400).json({msg:"User with this email does not exist!"})
        }
      const isMatch= await bcrypt.compare(password,user.password)
      if(!isMatch)
      {
        return res.statusCode(400).json({msg:"Incorrect Password."})
      }

        const token=   jwt.sign({id:User._id},"passwordKey");
        res.json({token,...user._doc})

    }
    catch(e)
    {
        res.status(500).json({error:e.message});
    
    }

});




module.exports = authRouter;