const {Client} = require('pg');
const client = new Client({
    host: 'localhost',
    user: 'markhrytchak',
    port: 5432,
    password: 'rootUser',
    database: 'commerce'
})

client.connect();
client.query('SELECT * FROM orders', (err, res)=>{
 
    if(!err){
        arr = res.rows;
    }else{
        console.log(err.rows);
    }
    client.end;
})

