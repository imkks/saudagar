import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import tradeRoutes from './Routes/trade.js'
import loginRoutes from './Routes/user.js'
import * as userModel from './Models/user.js'
import * as mysocket from './socket.js'
import cors from 'cors'
import path from  'path'
//var path =require('path')

const app= express();
await userModel.initializeTable();
//console.log(import.meta.url);
app.use(express.static(path.join('/home/krishna/saudagar','videos')))
app.use(express.json());
app.set('view engine','ejs');
app.use(cors());
app.use(cookieParser())
app.use('/trade',tradeRoutes);
app.get('/',async(req,res)=>{
    console.log("Root");
    
    res.render('stock');
})
app.use('/',loginRoutes);
const port=process.env.PORT;
let server=app.listen(port,()=>
console.log(`I m listening on ${port}`));
mysocket.initialize(server)


