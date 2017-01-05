/*
 * Copyright (c) 2017, Feedeo AB <hugo@feedeo.io>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const HOSTNAME = process.env.RABBITMQ_HOSTNAME
const USERNAME = process.env.RABBITMQ_USERNAME
const PASSWORD = process.env.RABBITMQ_PASSWORD

const { Logger } = require('./index');
const amqp = require('amqplib/callback_api');
const request = require('request');
/*
 FIREWALL MUST BE OPEN SERVER TO ACCEPT INCOMING CONNECTION REQUESTS

 'GUEST' can not be used as a user.
 Open port with iptables. Like so.

 sudo iptables -L //To check for rule number to use
 sudo iptables -I INPUT <change this to the right index> -p tcp --dport 5672 -j ACCEPT

 */

// if the connection is closed or fails to be established at all, we will reconnect
let amqpConn = null;
function start () {
  Logger.info('[AMQP] Attempting to connect to:', `${USERNAME}:${PASSWORD}@${HOSTNAME}`);
  amqp.connect(`amqp://${USERNAME}:${PASSWORD}@${HOSTNAME}` + '?heartbeat=60', function (err, conn) {
    if (err) {
      Logger.error("[AMQP]", err.message);
      return setTimeout(start, 1000)
    }

    conn.on("error", function (err) {
      if (err.message !== "Connection closing") {
        Logger.error("[AMQP] conn error", err.message);
      }
    });

    conn.on("close", function () {
      Logger.error("[AMQP] reconnecting");
      return setTimeout(start, 1000);
    });

    amqpConn = conn;
    Logger.info("[AMQP] connected");
    whenConnected();
  });
}

function whenConnected () {
  startPublisher();
}

let pubChannel = null;
let offlinePubQueue = [];

function startPublisher () {
  amqpConn.createConfirmChannel(function (err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function (err) {
      Logger.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function () {
      Logger.info("[AMQP] channel closed");
    });

    pubChannel = ch;
    while (true) {
      let m = offlinePubQueue.shift();
      if (!m) break;
      self.publish(m[ 0 ], m[ 1 ], m[ 2 ]);
    }
  });
}

function closeOnErr (err) {
  if (!err) return false;
  Logger.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}

/*-------------------*/

start();

const self = module.exports = {

  publish: function (exchange, routingKey, content) {

    try {
      pubChannel.publish(exchange, routingKey, content, { persistent: true },
        function (err, ok) {
          if (err) {
            Logger.error("[AMQP] publish", err);
            offlinePubQueue.push([ exchange, routingKey, content ]);
            pubChannel.connection.close();
          }
        });
    } catch (e) {
      Logger.error("[AMQP] publish (catch)", e.message);
      offlinePubQueue.push([ exchange, routingKey, content ]);
    }
  },

  purgeQueue: function (queue, cb) {
    pubChannel.purgeQueue(queue, function (err, ok) {
      if (err) {
        Logger.error("[AMQP] purge queue failed.", err);
        return null;
      }

      return cb(ok);
    })
  },

  startWorker: function (queue, workerFunction) {
    // A worker that acks messages only if processed succesfully
    amqpConn.createChannel(function (err, ch) {
      if (closeOnErr(err)) return;
      ch.on("error", function (err) {
        Logger.error("[AMQP] channel error", err.message);
      });

      ch.on("close", function () {
        Logger.info("[AMQP] channel closed");
      });

      ch.prefetch(1);
      ch.assertQueue(queue, { durable: true }, function (err, _ok) {
        if (closeOnErr(err)) return;
        ch.consume(queue, processMsg, { noAck: false });
        Logger.info("[AMQP] Worker is started for queue:", queue);
      });

      function processMsg (msg) {
        workerFunction(msg, function (err) {
          try {

            if (err) {
              ch.reject(msg, true);
              Logger.error("[WORKER] ERROR:", err);
            } else {
              ch.ack(msg);
              Logger.info("[WORKER] Removed from queue:", JSON.parse(msg.content).text, new Date());
            }
          } catch (e) {
            closeOnErr(e);
          }
        });
      }
    });
  },

  checkQueue: function (queue, cb) {

    pubChannel.checkQueue(queue, cb)
  },

  checkQueueOnConsole: function (queue, cb) {
    request(`http://${USERNAME}:${PASSWORD}@${HOSTNAME}:15672/api/queues/%2f/` + queue, function (err, resp, body) {
      if (err) {
        Logger.error("[CHECK]  Error", err);
        cb(err);
      }

      const tmp = JSON.parse(body);
      cb(null, {
        messageCount: tmp.messages,
        messages_unacknowledged: tmp.messages_unacknowledged,
        state: tmp.state,
        consumers: tmp.consumers
      });

    })
  },
};

