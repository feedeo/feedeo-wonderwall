const ImagesClient = require('google-images');
const { Logger } = require('./utils')

let client = new ImagesClient('014255597759783782513:qnxfarpo1tg', 'AIzaSyCphfV_HadM9KEMrkJOk4vK46EvHQsrf8w');

client.search('Fredrik Holmen', { size: 'large' })
	.then(function (images) {
		Logger.info(images)
	});
