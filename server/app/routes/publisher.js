const amqp = require('../utils/amqpUtil');
const { Logger } = require('../utils');
const { rabbitMQ } = require('../../config');


//Connect to RabbitMQ

module.exports = {

    publish: function (message) {
        const payload = JSON.stringify(message);
        Logger.info("Publish message", message);
        amqp.publish("", rabbitMQ.queueName, new Buffer(payload, 'utf8'));
    },

    purgeQueue: function (cb) {
        amqp.purgeQueue(rabbitMQ.queueName, cb);
    },

    countQueue: function (cb) {
        amqp.countQueue(rabbitMQ.queueName, cb);
    }


};;;;;;;;;


