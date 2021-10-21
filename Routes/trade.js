import express from 'express';
import axios from 'axios';
import middlewares from '../Middlewares/index.js'
import * as tradeService from '../Services/trade.service.js'
const router=express.Router();
// router.use(middlewares.authenticate)
router.get('/',async(req,res)=>{

    
    
    let response=await tradeService.getNifty()
    res.send(response)

    //res.send("I am on get route of trding")
}
);
router.get('/news',async(req,res)=>{
    let news=await tradeService.rssScrape();
    res.send(news);
})
router.get('/stock/:id',async(req,res)=>{
    let info=await tradeService.stock(req.params.id);
    //  res.send(info);
    res.render("stock",{info});
})
router.get('/search:q',async(req,res)=>{
    let news=await tradeService.search(req.params.q);
    res.send(news);
})
export {router as default}
