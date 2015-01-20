var allConfig = require('./karma-common.js');

module.exports = function (config) {
    allConfig.browsers = [
        'Firefox',
        'Chrome',
        'IE9 - Win7',
        'IE10 - Win7',
        'IE11 - Win7'
    ];
    allConfig.logLevel = config.LOG_INFO;
    config.set(allConfig);
};