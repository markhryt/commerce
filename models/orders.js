const sequelize = require('./../database/database')
const Sequalize = require('sequelize');


const Orders= sequelize.define('orders', {
    id: {
        field: 'id',
        type: Sequalize.INTEGER,
        primaryKey: true
    },
   amount: {
        field: 'amount',
        type: Sequalize.INTEGER,
    }
},{
    timestamps: false
});

Orders.associate = function(models){
    Orders.hasMany(models.Order_details, {foreignKey: 'order_id'})
  }

  module.exports = Orders;