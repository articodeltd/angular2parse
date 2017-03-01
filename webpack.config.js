module.exports = {
    entry: './release/index.js',
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-es2015-modules-commonjs']
                }
            },
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript'
                ]
            }
        ]
    },
    output: {
        filename: 'angular2-parse.umd.js',
        path: __dirname + '/release/bundles',
        libraryTarget: 'umd'
    }
};