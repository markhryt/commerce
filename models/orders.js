const sequelize = require('./../database/database')
const Sequalize = require('sequelize');


module.exports = sequelize.define('orders', {
    id: {
        field: 'id',
        type: Sequalize.INTEGER,
        primaryKey: true
    },
    category_id: {
        field: 'category_id',
        type: Sequalize.INTEGER
    },
    name: {
        field: 'name',
        type: Sequalize.STRING,
    }
},{
    timestamps: false
});
