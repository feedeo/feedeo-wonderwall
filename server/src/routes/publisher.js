/*
 * Copyright (c) 2017, Feedeo AB <hugo@feedeo.io>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const amqp = require('../utils/amqpUtil');
const { Logger } = require('../utils');
const { rabbitMQ } = require('../config');


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

};



