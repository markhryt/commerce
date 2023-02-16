const sequelize = require('./../database/database')
const Sequalize = require('sequelize');


module.exports = sequelize.define('orders', {
    id: {
        field: 'id',
        type: Sequalize.INTEGER,
        primaryKey: true
    },
    customer_id: {
        field: 'customer_id',
        type: Sequalize.INTEGER
    },
    amount: {
        field: 'amount',
        type: Sequalize.INTEGER,
    },
    order_date: {
        field: 'order_date',
        type: Sequalize.DATE
    }
},{
    timestamps: false
});
