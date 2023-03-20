// 服务器入口文件
// 1.创建koa的实例对象
const Koa=require('koa')
const app=new Koa()
// 2.绑定中间件
// 第一层使用
const Koa_duration=require('./middleware/koa_response_duration')
app.use(Koa_duration)
// 第二层使用
const Koa_header=require('./middleware/koa_response_header')
app.use(Koa_header)
// 第三层使用
const Koa_data=require('./middleware/koa_response_data')
app.use(Koa_data)
// 3.绑定端口号
app.listen(8888)

const webSocketService=require('./service/web_socket_service.js')
webSocketService.listen()