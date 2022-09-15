const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
  lintOnSave: false,
  devServer: {
    // proxy: {
    //   "/login": {
    //     // target: "http://47.101.195.28",
    //     target: "http://mnsx.top:8080",
    //     changeOrigin: true
    //   },
    // },
  },
}
