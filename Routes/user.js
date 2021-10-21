import express from 'express';
import * as userservice from '../Services/user.service.js'
import * as authservice from '../Services/auth.service.js'
const router= express.Router();
router.use(express.urlencoded({extended:false}));
router.post('/login',async(req,res)=>{
    
    let token=await userservice.login(req.body);
    //res.setHeader("content-type","application/json");
    //console.log(token);
    if(token)
    {
        res.setHeader("set-cookie", [`JWT_TOKEN=${token.accessToken}; httponly; samesite=lax`])
        res.setHeader("content-type","application/json")
        res.send(JSON.stringify({msg:"you are verified",refreshToken:`${token.refreshToken}`}));
    }
    else
    {
        res.status(401).send("invalid credentials");
    }
    //res.send("Logged in");
})
router.post('/signup',async (req,res)=>{
    console.log(req.body);
   let result= await userservice.signup(req.body);
   if(result)
    {
        res.sendStatus(201);
        return;
    }
   console.log(result);
   
    res.status(409).send("User already exists");


    
})
router.post('/logout',async (req,res)=>{
    //console.log("You are logged out");
    res.clearCookie('JWT_TOKEN');
    res.redirect('/');
    //res.send("Logged OUt");

    
})
router.post('/token',async(req,res)=>
{
    const authHeader=req.headers.authorization;
    if(authHeader)
    {
        const refreshtoken= authHeader.split(' ')[1];
        let result=authservice.verifyToken(refreshtoken,process.env.REFRESH_TOKEN_SECRET)
        if(result)
        {
            let payload={username:result.username,firstname:result.firstname,lastname:result.lastname}
            let accesstoken=await userservice.refresh(payload,refreshtoken)
            //console.log(accesstoken)
            if(accesstoken)
            {
                res.setHeader("set-cookie", [`JWT_TOKEN=${accesstoken}; httponly; samesite=lax`])
                res.send("you are verfied");
            }
            else
                res.send("forbidde");
        }
        else
        {
            res.send("forbidden")
        }
    }
    else
    {
        res.send("forbidden")

    }

})
export default router;