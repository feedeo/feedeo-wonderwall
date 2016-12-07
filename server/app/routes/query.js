const express = require('express');
const router = express.Router();

const ImagesClient = require('google-images');
const {Logger} = require('../utils')

router.use(function (req, res, next) {
    console.log('Something is happening.');
    next();
});


router.post('/query', (req, res) => {

    const query = req.body.q;
    console.log("Body", req.body);

    let client = new ImagesClient('014255597759783782513:qnxfarpo1tg', 'AIzaSyCphfV_HadM9KEMrkJOk4vK46EvHQsrf8w');

    client.search(query, {size: 'large'})
        .then((images) => {
            Logger.info(images)
            res.json({images: images})
        })
        .catch(error => Logger.warn(error))

});

router.get('/query/:q', (req, res) => {

    const query = req.params.q

    let client = new ImagesClient('014255597759783782513:qnxfarpo1tg', 'AIzaSyCphfV_HadM9KEMrkJOk4vK46EvHQsrf8w');

    client.search(query, {size: 'large'})
        .then((images) => {

            for (let img of images) {
                Logger.info(img.url)
            }
            res.json(images)
        })
        .catch(error => Logger.warn(error))

});

module.exports = router;