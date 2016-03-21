/* vim: set softtabstop=2 shiftwidth=2 expandtab : */
var webpack = require('webpack');
var path = require('path')
var _ = require('lodash')

var baseConfig = {
  entry: './engine/main.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
    ],
  },
  // example: if you wish to apply custom babel options
  // instead of using vue-loader's default:
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  }
}; /* baseConfig */

/**
 * Web config uses a global Vue and Lodash object.
 * */
var webConfig = _.clone(baseConfig);
webConfig.output = {
	path: __dirname,
    filename: "index.js",
    library: ["JSECS"],
    libraryTarget: "umd"
};

module.exports = [
    webConfig,
];

if (process.env.NODE_ENV === 'production') {
  console.log('THIS IS PROD');
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
} else {
  module.exports.devtool = '#source-map'
}
