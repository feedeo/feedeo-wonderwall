const express = require('express');
const router = express.Router();
const publisher = require('./publisher');

const ImagesClient = require('google-images');
const {Logger} = require('../utils');
const {cx} = require('../config');

router.use(function (req, res, next) {
    console.log('Something is happening.');
    next();
});


router.post('/query', (req, res) => {

    const query = req.body.q;
    console.log("Body", req.body);

    let client = new ImagesClient(cx.cx_id, cx.cx_api);

    client.search(query, {size: 'large'})
        .then((images) => {
            Logger.info(images)
            res.json({images: images})
        })
        .catch(error => Logger.warn(error))

});

router.get('/query/:q', (req, res) => {

    const query = req.params.q

    let client = new ImagesClient(cx.cx_id, cx.cx_api);

    client.search(query, {size: 'large'})
        .then((images) => {

            for (let img of images) {
                const tmp = {
                    url: img.url,
                    source: query
                }
                publisher.publish(tmp);
                Logger.info(img.url)
            }
            res.json(images)
        })
        .catch(error => Logger.warn(error))

});

module.exports = router;