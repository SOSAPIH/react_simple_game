const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'eval', // 개발: eval production: hidden-source-map
    resolve: {
        extensions: ['.js', '.jsx']
    },
    entry: {
        app: ['./client']
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            options: {
                presets: [['@babel/preset-env', {
                    targets: {
                        browsers: ['> 5% in KR','last 2 chrome versions'], //browserslist
                    },
                    debug: true,
                }], '@babel/preset-react'], 
                plugins: [], // 플러그인 n0개가 모여 하나의 preset을 이룸
            },
        }],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({debug:true}),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js',
    },
}