export default class SocketService {
  static instance=null
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  ws=null
  callBackMapping={}

  connect () {
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket')
    }
    this.ws = new WebSocket('ws://localhost:9998')

    this.ws.onopen = () => {
      console.log('连接服务端成功了')
    }
    this.ws.onlose = () => {
      console.log('连接服务端失败')
    }
    this.ws.onmessage = msg => {
      // console.log('从服务端获取到了数据')
      // console.log(msg.data)
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  send (data) {
    this.ws.send(JSON.stringify(data))
  }
}
