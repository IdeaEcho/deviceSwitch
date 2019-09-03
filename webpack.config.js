const pkg = require('./package.json');
const Webpack = require('webpack');
const path = require("path");

module.exports = {
  mode: 'production',
  entry: {
    deviceSwitch: path.resolve(__dirname + '/src/deviceSwitch.js'),
  },
  output: {
    path: path.resolve('./dist'), // 打包后文件存放的地方
    filename: '[name].min.js' // 打包后输出文件的文件名
  },
  module: {
    rules: [
      {
        test: /.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
        // loaders: ["style", "css", "autoprefixer", "sass"],
        exclude: "/node_modules/"
      },
      {
        test: /\.js$/, // 匹配打包文件后缀名的正则
        exclude: /(node_modules|bower_components)/, // 这些文件夹不用打包
        loader: 'babel-loader',
      }
    ]
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new Webpack.BannerPlugin([
      'deviceSwitch v' + pkg.version + ' (' + pkg.homepage + ')',
      'A simple device switch tool for Testers'
    ].join('\n')),
  ]
}
