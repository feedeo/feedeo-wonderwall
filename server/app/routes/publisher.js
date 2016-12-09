const amqp = {};//require('../utils/amqpUtil')
const {Logger} = require('../utils');


//Connect to RabbitMQ
image_queue = "wonderwall"

module.exports = {

    publish: function (message) {
        const payload = JSON.stringify(message)
       // amqp.publish("", image_queue, new Buffer(payload, 'utf8'));
    },

    clearQueue: function () {
        //Wipe the queue
    }

}


