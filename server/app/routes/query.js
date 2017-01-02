const express = require('express');
const router = express.Router();
const publisher = require('./publisher');
const amqp = require('../utils/amqputil');

const ImagesClient = require('google-images');
const {Logger} = require('../utils');
const { cx } = require('../../config');

router.use(function (req, res, next) {
    Logger.info(req.method, req.url);
    next();
});

// home page route (http://localhost:8080)
router.get('/', function (req, res) {
    res.send('im the home page!');
});

router.get('/query/:q', (req, res) => {

    const query = req.params.q;;;;;;;;;;;;

    let client = new ImagesClient(cx.cx_id, cx.cx_api);

    client.search(query, {size: 'large'})
        .then((images) => {

            if (images.length > 0) {
                publisher.purgeQueue(function (res) {
                    Logger.info(`${res.messageCount} messages was purged.`);;;;;;;;;;;;

                    for (let img of images) {
                        const tmp = {
                            url: img.url,
                            timeout: 15
                        };;;;;;;;;;;;

                        publisher.publish(tmp);
                    }
                })
            }

            res.json(images)
        })
        .catch(error => Logger.warn(error))

});

router.get('/queue/', function (req, res) {

    publisher.countQueue(function (rs) {
        Logger.info("Queue info", rs);;;;;;;;;;;;
        res.json(res)
    })
});

router.get('/status/', function (req, res) {

    amqp.checkQueueOnConsole('keybroker', function (err, rs) {
        if (err) console.error(err);
        Logger.info(rs);;;;;;;;;;;;
        res.json(rs)
    })
});

module.exports = router;