import jwt from 'jsonwebtoken'
import 'dotenv/config'
export function generateAccessToken(payload)
{
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'30s'});
}
export function generateRefereshToken(payload)
{
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET);
}
export function verifyToken(token,secret)
{
    try
    {
        const result= jwt.verify(token,secret);
        //console.log(result);
        return result;
    }
    catch(e)
    {
        //console.log(e);
        return null;
    }
}

