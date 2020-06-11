const
    dev = Boolean(process.env.WEBPACK_DEV_SERVER),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    TerserPlugin = require('terser-webpack-plugin'),
    siteJSON = require('./src/components/site.json'),
    FaviconsWebpackPlugin = require('favicons-webpack-plugin'),
    { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = (env, { watch }) => {
    return {
        stats: {
            children: !dev
        },
        entry: './src/scripts/index.js',
        output: {
            filename: 'js/main.js',
            path: path.resolve('dist'),
        },
        watch: dev,
        devtool: dev ? 'inline-source-map' : false,
        devServer: {
            contentBase: path.resolve('dist'),
            https: true,
            compress: true,
            open: true,
            stats: 'minimal'
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
            minimize: true,
            minimizer: [new TerserPlugin()]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.((jpe?|pn|sv)g|web[pm]|m(ov|p4)|gif|bmp|pdf)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                esModule: false,
                                name: '[name].[ext]',
                                outputPath: 'assets'
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff2?|eot|[to]tf)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts'
                    }
                },
                {
                    test: /\.s?[ca]ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../'
                            }
                        },
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.ejs$/,
                    use: ['ejs-loader']
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            ...Object.entries(siteJSON.pages)
                .filter(([, { type }]) => type === 'internal')
                .map(([page, { title, path }]) => new HtmlWebpackPlugin({
                    template: `./src/pages/${page}.ejs`,
                    filename: `${path + page}.html`,
                    title: title,
                    inject: 'head',
                    scriptLoading: 'defer',
                    minify: dev ? false : {
                        collapseWhitespace: true,
                        removeComments: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        useShortDoctype: true
                    }
                })),
            new MiniCssExtractPlugin({
                filename: "css/[name].css",
                chunkFilename: "[id].css"
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: !dev && watch ? 'server' : 'disabled'
            }),
            new FaviconsWebpackPlugin({
                logo: './src/img/Logo.png',
                mode: 'webapp',
                devMode: 'webapp',
                cache: true,
                prefix: 'favicons/',
                favicons: {
                    appName: siteJSON.metadata.appName,
                    appDescription: siteJSON.metadata.appDescription,
                    developerName: 'Pierre Darrieutort',
                    developerURL: 'https://pierredarrieutort.fr',
                    background: '#fff',
                    theme_color: '#fff',
                    lang: siteJSON.metadata.lang,
                    display: 'standalone',
                    orientation: 'portrait',
                    start_url: '/index.html',
                    icons: {
                        android: true,
                        appleIcon: true,
                        appleStartup: true,
                        coast: true,
                        favicons: true,
                        firefox: true,
                        windows: true,
                        yandex: true
                    }
                }
            })
        ]
    }
}
