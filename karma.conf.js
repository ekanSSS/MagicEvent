module.exports = function ( config ) {
    config.set( {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '.',

        // frameworks to use
        frameworks: [ 'jasmine' ],

        // list of files / patterns to load in the browser
        files: [
            'sample/index.html',

            'src/EventHandler.js',
            'src/*.js',

            'test/*.js',
            {
                pattern: 'testajax/*.*',
                served: true,
                included: false
            }
        ],

        proxies: {
            '/testajax/': '/base/testajax/'
        },
        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [ 'clear-screen', 'mocha', 'coverage' ],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/EventHandler.js': ['coverage']
        },

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                { type: 'html', subdir: '.' },
                { type: 'text' }
            ]
        },

        browserConsoleLogOptions: {level: "debug", format: "%b %T: %m", terminal: true},
        client: {
            captureConsole: true,
            jasmine: {
                random: false
            }
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
        // config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        browsers: ['ChromeHeadless'],

        // set this to true when your want do to a single run, usefull to CI
        singleRun: false
    } )
};