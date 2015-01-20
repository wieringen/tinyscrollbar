var debugConfig = require('./karma-common.js');

module.exports = function (config) {
    debugConfig.browsers = [
        'Chrome'
    ];
    debugConfig.logLevel = config.LOG_DEBUG;
    config.set(debugConfig);
};