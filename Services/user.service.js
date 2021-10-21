import pg from 'pg';
import bcrypt from 'bcrypt'
import { response } from 'express';
import * as authService from './auth.service.js'
const Pool=pg.Pool;
const pool=new Pool({
    host:'krish',
    port:8080,
    user:'postgres',
    password:'postgres',
    database:'myemployee',
    idleTimeoutMillis:10000
    

})
export async function signup(body)
{
    let result;
    try
    {
        //await client.connect();
        console.log("Connection sucessful");
        let {rows}= await pool.query("select * from users where username=$1",[body.username]);
        //console.log(countUsers);
        if(rows.length==0)
        {
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword= await bcrypt.hash(body.password,salt);

            //req.send("User already exists");
            result= await pool.query
            ("INSERT INTO users(username,password,firstname,lastname) VALUES($1,$2,$3,$4)"
            ,[body.username,hashedPassword,body.firstname,body.lastname]);
            
        }
    }
    catch(e)
    {
        console.log("I have gor error"+e);
    }
    
    return result;
}
export async function login(body)
{
    let token="";
    try
    {

    
    const {rows}=await pool.query("select * from users where username=$1",
[body.username]);
        //console.table(rows)
        if(rows.length!=0)
        {
           const result= await bcrypt.compare(body.password,rows[0].password)
           //console.log(result);
           if(result==true)
           {
                let payload={
                    username:rows[0].username,
                    firstname:rows[0].firstname,
                    lastname:rows[0].lastname
                }
                //console.log(rows[0]);
                let token=authService.generateAccessToken(payload)
                let refreshToken=authService.generateRefereshToken(payload);
                await pool.query(
                    'UPDATE users set refresh_token=$1 where username=$2',
                    [refreshToken,rows[0].username]
                );
                return {accessToken:token,refreshToken};
           }
            else
                token=null;
        }
        else
            token=null;
            
    }
    catch(e)
    {
        console.log(e);
    }
    return token;
}
export async function refresh(payload,token)
{
   const {rowCount}= await pool.query(
        'select * from users where username=$1 and refresh_token=$2',
       [ payload.username,token]
    );
    //console.log(result)
    if(rowCount)
    {
       let token=  authService.generateAccessToken(payload)
      // console.log(token)
       return token;
    }
    else
    {
        return null;
    }

}