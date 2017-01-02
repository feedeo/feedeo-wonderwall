const { Logger } = require('../app/utils/index');

module.exports = (function (env) {
    let config;
    switch (env) {
        case 'production':
            config = require('../env/production');
            break;
        case 'development':
            config = require('../env/development');
            break;
        default:
            Logger.error('FEEDEO_ENVIRONMENT environment variable not set');
            process.exit(1);
    }
    return config || {};
})(process.env.FEEDEO_ENVIRONMENT);