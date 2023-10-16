module.exports = {
    lintOnSave: false,
    runtimeCompiler: true,
    configureWebpack: {
        //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
        resolve: {
            symlinks: false
        }
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.mode = 'production';
            config["performance"] = {
                "maxEntrypointSize": 10000000,
                "maxAssetSize": 30000000
            }
        }
    },
    // 兼容IE
    transpileDependencies: ['@coreui']
}
