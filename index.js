const express = require('express');
const app = express();
const port  = 3000;
const Sequalize = require('sequelize');


app.get('/api/orders', function ( req, res){
    Orders.findAll().then((orders)=>{
        res.json(orders);
    })
})
app.listen(port, ()=>{
    console.log('Listening on port ' + port);
});