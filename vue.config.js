const {InjectManifest} = require('workbox-webpack-plugin');
const manifestOptions = require('./vue.pwa');

module.exports = {
    outputDir: './public_html',

    css: {
        extract: {
            filename: "css/[name].css",
            ignoreOrder: true,
        },

        loaderOptions: {
            sass: {
                additionalData: "@import '@styles/variables.scss'"
            }
        }
    },

    pages: {
        index: {
            entry: 'src/desktop.js',
            template: 'src/template/index.html',
            filename: 'index.html',
            title: 'MONOLAND'
        },
    },

    productionSourceMap: false,

    pwa: {
        appleMobileWebAppCapable: 'yes',

        iconPaths: {
            favicon32: 'favicon-32x32.png',
            favicon16: 'favicon-16x16.png',
            appleTouchIcon: 'ios/152.png',
            maskIcon: null,
            msTileImage: 'ios/144.png'
        },

        manifestOptions: manifestOptions
    },

    chainWebpack: config => {
        config.plugins.delete('workbox');
        
        config.resolve.alias
            .set('@components', __dirname + '/src/components')
            .set('@mixins', __dirname + '/src/mixins')
            .set('@modules', __dirname + '/src/modules')
            .set('@plugins', __dirname + '/src/plugins')
            .set('@stores', __dirname + '/src/plugins/stores')
            .set('@styles', __dirname + '/src/styles')
            .set('@monoland', __dirname + '/src/monoland')
            .set('@workers', __dirname + '/src/workers');
    },

    configureWebpack: () => {
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [
                    new InjectManifest({
                        exclude: [/\.(?:png|jpg|jpeg|svg|txt|ico|html)$/],
                        maximumFileSizeToCacheInBytes: 10485760,
                        swSrc: './src/workers/service-worker.js'
                    })
                ]
            }
        }
    },

    transpileDependencies: [
        'vuetify'
    ]
}