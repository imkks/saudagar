
import * as authService from '../Services/auth.service.js'
let middlewareobj={}
middlewareobj.authenticate=function(req,res,next)
{
    const token= req.cookies.JWT_TOKEN
    if(token)
    {
       const payload= authService.verifyToken(token,process.env.ACCESS_TOKEN_SECRET)
       if(payload)
       {    
            req.user=payload;
            next()
       }
       else{
           res.status(403).send("Forbidden Resurce");
       }
    }
    else
        res.status(403).send("Forbidden Resource")
}
export default middlewareobj;