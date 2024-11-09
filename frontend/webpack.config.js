const webpack = require('webpack')
const glob = require('glob')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * Публично доступный путь до dist относительно директории www
 */
const PUBLIC_PATH = '/dist/'

const SRC_DIR = path.resolve('src')
const BUILD_DIR = path.resolve('..', 'www', 'dist')
const BUILD_TWIG_DIR = path.resolve('..', 'backend', 'templates')


const LAYER_APP_PATH = path.resolve(SRC_DIR, 'app')
const LAYER_PAGES_PATH = path.resolve(SRC_DIR, 'pages')
const LAYER_WIDGETS_PATH = path.resolve(SRC_DIR, 'widgets')
const LAYER_FEATURES_PATH = path.resolve(SRC_DIR, 'features')
const LAYER_ENTITIES_PATH = path.resolve(SRC_DIR, 'entities')
const LAYER_SHARED_PATH = path.resolve(SRC_DIR, 'shared')

const SRC_HTML_DIR = path.resolve(LAYER_APP_PATH, 'html')

module.exports = {
    mode: 'production',
    target: 'web',
    entry: {
        app: [
            path.resolve(__dirname, 'src/app/index.ts'),
            path.resolve(__dirname, 'src/app/index.scss')
        ],
    },
    output: {
        filename: "[name].bundle.js",
        path: BUILD_DIR,
        publicPath: PUBLIC_PATH,
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@app': LAYER_APP_PATH,
            '@pages': LAYER_PAGES_PATH,
            '@widgets': LAYER_WIDGETS_PATH,
            '@features': LAYER_FEATURES_PATH,
            '@entities': LAYER_ENTITIES_PATH,
            '@shared': LAYER_SHARED_PATH,
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].min.css',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(SRC_HTML_DIR, 'imports-app.html'), // Указываем путь к основному шаблону HTML
        }),
        ...createHtmlWebpackPluginList(path.resolve(SRC_HTML_DIR, 'imports-*.html'))
    ],
    //devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.pcss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            },
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
        },
    },
}

function createHtmlWebpackPluginList(htmlPathPattern) {
    const plugins = []
    const files = glob.sync(fixPath(htmlPathPattern))

    files.forEach((templateFilePath) => {
        const entryName = path.basename(templateFilePath, '.html')

        plugins.push(new HtmlWebpackPlugin({
            template: templateFilePath,
            filename: path.resolve(BUILD_TWIG_DIR, `webpack-${entryName}.twig`),
            publicPath: PUBLIC_PATH,
            inject: false,
            hash: getVersionFromTimestamp(),
        }))
    })

    return plugins
}

function getVersionFromTimestamp() {
    return String(Date.now()).slice(5)
}

function fixPath(path) {
    return path.replaceAll('\\', '/')
}
