const { Logger } = require('../app/utils/index');

module.exports = (function (env) {
    switch (env) {
        case 'production':
            var config = require('../env/production');
            break;
        case 'development':
            var config = require('../env/development');
            break;
        default:
            Logger.error('FEEDEO_ENVIRONMENT environment variable not set');
            process.exit(1);
    }
    return config || {};
})(process.env.FEEDEO_ENVIRONMENT);