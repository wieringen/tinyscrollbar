var devConfig = require('./karma-common.js');

module.exports = function (config) {
    devConfig.browsers = [
      'Chrome'
    ];
    devConfig.singleRun = true;
    devConfig.logLevel = config.LOG_INFO;
    config.set(devConfig);
};