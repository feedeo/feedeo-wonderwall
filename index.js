const ImagesClient = require('google-images');

let client = new ImagesClient('014255597759783782513:qnxfarpo1tg', 'AIzaSyCphfV_HadM9KEMrkJOk4vK46EvHQsrf8w');

client.search('Fredrik Holmén',{size: 'large'})
    .then(function (images) {
        console.log(images)
    });
