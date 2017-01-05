/*
 * Copyright (c) 2017, Feedeo AB <hugo@feedeo.io>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { Logger } = require('../utils');

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
