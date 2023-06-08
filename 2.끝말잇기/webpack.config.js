const path = require('path');
const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
    name: 'wordrelay-setting', //안적어도 됨
    mode: 'development', //실서비스 : production
    devtool: 'eval',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    entry: {//입력 => app.js의 src로 활용될 파일들을 전부 넣음
        app:['./client'] // client에서 이미 wordrelay를 불러오고 있으므로 wordrelay를 다시 부를필요 X
    },
    module: {
        rules: [{
            test: /\.jsx?/,
            loader: 'babel-loader',
            options: {
                presets: [['@babel/preset-env', {
                    targets: {
                        browsers: ['> 5% in KR'],
                    }
                }], '@babel/preset-react'],
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                    'react-refresh/babel'
                ],
                exclude: path.join(__dirname, 'dist'),
            },
        }],
    },
    plugins: [
        new RefreshWebpackPlugin()
    ],
    output: {// 출력 => 묶인 파일들이 하나로 return된 결과
        path: path.join(__dirname, 'dist'),
        filename: 'app.js', // 출력될 파일이름
        publicPath: '/dist',
    },
    devServer: {
        devMiddleware: { publicPath: '/dist' },
        static: { directory: path.resolve(__dirname) },
        hot: true
    }
};