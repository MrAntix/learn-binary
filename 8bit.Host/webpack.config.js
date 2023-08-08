'use strict';
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        src: { import: './src/index.ts', dependOn: ['sanitize', 'rasterize'] },
        sanitize: ['dompurify'],
        rasterize: ['dom-to-image'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'wwwroot'),
        clean: true,
        chunkFilename: '[id].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.([cm]?ts|tsx)$/,
                loader: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: ['to-string-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        extensionAlias: {
            '.ts': ['.js', '.ts'],
            '.cts': ['.cjs', '.cts'],
            '.mts': ['.mjs', '.mts']
        }
    },
    optimization: {
        runtimeChunk: { name: 'app' }
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { context: 'src', from: "**/web.config" },
                { context: 'src', from: "**/manifest.json" },
                { context: 'src', from: "**/service-worker.js" },
                { context: 'src', from: "**/*.html" },
                { context: 'src', from: "**/*.png" },
            ],
        })
    ]
};