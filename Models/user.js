import pg from 'pg';
const Client=pg.Client;
const client=new Client({
    host:'krish',
    port:8080,
    user:'postgres',
    password:'postgres',
    database:'myemployee',
    

})
const query=`CREATE TABLE IF NOT EXISTS users (
    username varchar(10) PRIMARY KEY,
    password varchar(100) NOT NULL,
    firstname varchar(15) NOT NULL,
    lastname varchar(15) NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    refresh_token varchar(400)

);`;
export async function initializeTable()
{
    await client.connect()
    await client.query(query);
    await client.end((err)=>
    {console.log("CLient disconnected");
        if(err)
            console.log(err);
    });
    //onsole.log(res);


}