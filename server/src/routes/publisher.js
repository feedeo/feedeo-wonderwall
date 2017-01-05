/*
 * Copyright (c) 2017, Feedeo AB <hugo@feedeo.io>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE

const amqp = require('../utils/amqpUtil');
const { Logger } = require('../utils');

//Connect to RabbitMQ

module.exports = {

  publish: function (message) {
    const payload = JSON.stringify(message);
    Logger.info("Publish message", message);
    amqp.publish("", RABBITMQ_QUEUE, new Buffer(payload, 'utf8'));
  },

  purgeQueue: function (cb) {
    amqp.purgeQueue(RABBITMQ_QUEUE, cb);
  },

  countQueue: function (cb) {
    amqp.countQueue(RABBITMQ_QUEUE, cb);
  }

};



