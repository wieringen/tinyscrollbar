module.exports = {
    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    frameworks: [
      'mocha',
      'chai-sinon',
      'jquery-1.8.3'
    ],

    client: {
      mocha: {
        ui: 'bdd'
      }
    },

    // list of files / patterns to load in the browser
    files: [
        'lib/tinyscrollbar.js',
        'lib/jquery.tinyscrollbar.js',
        'test/unit/jquery.tinyscrollbar.spec.js',
        'test/unit/tinyscrollbar.spec.js',
        {
            pattern: 'test/fixtures/**/*.html',
            included: true
        }
    ],

    // list of files to exclude
    exclude: [],

    preprocessors: {
      'lib/*.js': ['coverage'],
      'test/fixtures/**/*.html': ['html2js']
    },

    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots', 'progress', 'junit'
    // CLI --reporters progress
    reporters: [
      'dots',
      'html',
      'coverage'
    ],

    coverageReporter: {
        type: 'lcov',
        dir: 'dist/reports/coverage/'
    },

    htmlReporter: {
      outputFile: 'dist/reports/test-report.html'
    },

    // web server port
    // CLI --port 9876
    port: 9876,

    // cli runner port
    // CLI --runner-port 9100
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    // CLI --log-level debug
    // logLevel: config.LOG_ERROR,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: [
        'Firefox',
        'Chrome'
    ],

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 15000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: false,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 500,

    //proxies: {}

    plugins: [
      'karma-mocha',
      'karma-jquery',
      'karma-chai-sinon',
      'karma-ie-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-html2js-preprocessor',
      'karma-coverage',
      'karma-junit-reporter',
      'karma-htmlfile-reporter',
      'karma-ievms'
    ]
};