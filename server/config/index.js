const { Logger } = require('../app/utils/index');

module.exports = (function (env) {
    switch (env) {
        case 'production':
            const config = require('../env/production');
            break;
        case 'development':
            const config = require('../env/development');
            break;
        default:
            Logger.error('FEEDEO_ENVIRONMENT environment variable not set');
            process.exit(1);
    }
    return config || {};
})(process.env.FEEDEO_ENVIRONMENT);