
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  outputDir: 'dist',
  assetsDir: "./",
  devServer: {
    // 端口号
    port: 8888,
    host: "localhost",
    // https:{type:Boolean}
    https: false,
    // 配置自动启动浏览器
    open: false,
  }
};