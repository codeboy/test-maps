const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

module.exports = {
  pluginOptions: {
    quasar: {
      treeShake: true
    }
  },
  devServer: {
    disableHostCheck: true,
    port: 9000
  },

  configureWebpack:{
    // plugins: [new BundleAnalyzerPlugin()],
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 200000,
      }
    }
  },

  transpileDependencies: [
    /[\\/]node_modules[\\/]quasar[\\/]/,
  ]
};
