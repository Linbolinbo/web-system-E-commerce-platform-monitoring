const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 端口号
  // 配置devServer
  devServer: {
    host: 'localhost', // 项目运行的ip
    port: 8999, // 项目运行的端口号
    // 自动打开浏览器
    open: true
  }

})
