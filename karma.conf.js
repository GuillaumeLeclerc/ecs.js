var path = require('path');

module.exports = function(config) {
  config.set({
    plugins: [
      require('karma-babel-preprocessor'),
      require('karma-webpack'),
      require('karma-tap'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-coverage'),
      require('karma-spec-reporter'),
      require('karma-html-reporter'),
    ],
    browsers: [ 'Chrome' ], //run in Chrome

    files: [
      'test/test.js'
    ],

    frameworks: [ 'tap' ], //use the mocha test framework

    preprocessors: {
      'test/**/*.js': [ 'webpack' ]
    },
    specReporter: {
      maxLogLines: 5,         // limit number of lines logged per test 
      suppressErrorSummary: false,  // do not print error summary 
      suppressFailed: false,  // do not print information about failed tests 
      suppressPassed: true,  // do not print information about passed tests 
      suppressSkipped: true  // do not print information about skipped tests 
    },
    htmlReporter: {
      outputDir: 'reports/tests', // where to put the reports  
      templatePath: null, // set if you moved jasmine_template.html 
      focusOnFailures: true, // reports show failures on start 
      namedFiles: false, // name files instead of creating sub-directories 
      pageTitle: null, // page title for reports; browser info by default 
      urlFriendlyName: false, // simply replaces spaces with _ for files/dirs 
      
      // experimental 
      preserveDescribeNesting: false, // folded suites stay folded  
      foldAll: false, // reports start folded (only with preserveDescribeNesting) 
    },

    logLevel: config.LOG_WARN,

    reporters: [ 'html', 'spec', 'coverage' ], //report results in this format

    coverageReporter: {
      reporters: [
        {
          type: 'html',
          dir: 'reports/coverage'
        }
      ]
    },

    singleRun: true, //just run once by default
     client: {
           captureConsole: true,
     },

    webpack: {
      node : {
        fs: 'empty'
      },

      // Instrument code that isn't test or vendor code.
      module: {
        preLoaders: [{
          test: /\.js$/,
          loader: 'isparta', 
          exclude: /node_modules/
        }],
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
          }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true //please don't spam the console when running in karma!
    }
  });
};
