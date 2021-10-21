import * as API from '../API.js'
import axios from 'axios'
import {parse} from 'fast-xml-parser'
export function getMarketStatus()
{
    axios.get(API.MARKET_STATUS_URL).then(response=>{
        //console.log(response.data);
    })
}
export async function getNifty()
{
    try
    {
        let response=await axios.get(API.NIFTY_50)
                
            return analyze(response.data)
    }
    catch(e)
    {
        console.log(e);
        return null;
    }
        
    
}
function analyze(response)
{
    //console.log(response)
    let stocklist=[];
    for(let i=1;i<response.data.length;i++)
        {
            let stock=response.data[i];
            if(stock.previousClose< stock.open)
            {
                stocklist.push({
                    open:stock.open,
                    close:stock.previousClose,
                    high:stock.high,
                
                   symbol: stock.symbol});
            }
        }
    return stocklist;
}
export async function rssScrape()
{
    let response=await axios.get('http://pulse.zerodha.com/feed.php',{
    header:{Accept: 'application/xml'},responseType:'text'});
    let jsonObj=parse(response.data);
    let news=jsonObj.rss.channel.item;
    return news;
    
}
export async function stock(sid)
{
    // let quotes=await axios.get(`https://quotes-api.tickertape.in/quotes?sids=${sid}`)

    let peers=await axios.get(`https://api.tickertape.in/stocks/peers/${sid}?tab=valuation`)
    peers=peers.data.data;
    
    let news=await axios.get(`https://api.tickertape.in/stocks/feed/${sid}?count=11&offset=0&types=news-video,news-article,opinion-article`)
    news=news.data.data.items;
    let holdings=await axios.get(`https://api.tickertape.in/stocks/commentaries/${sid}?keys[]=holdings`)
    holdings=holdings.data.data.holdings;
    return {news,peers,holdings};

}
export async function search(text)
{
    let response=await axios.get(`https://api.tickertape.in/search?text=${text}&types=stock,brands,index,etf,mutualfund`)
    return response.data;
}
