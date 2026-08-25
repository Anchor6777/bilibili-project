/**
 * WebSocket封装类，实现了如下功能：
 *   - 断线重连。采用指数退避重连策略，每次重连的间隔呈指数级增长（5秒、10秒、20秒...）
 *   - 心跳机制。保证ws连接存活。
 */
export class WebSocketClient {
  // 服务器url
  private url: string = "";
  // socket实例
  private socket: WebSocket | undefined = undefined;

  // 重连次数
  private reconnectTimes = 0;
  // 最大重连次数
  private maxReconnectTimes = 5;
  // 重连间隔
  private reconnectInterval = 1000 * 2; // 2秒
  // 最大重连间隔
  private maxReconnectInterval = 1000 * 30;

  // 发送心跳的定时器id
  private heartbeatTimer: number | undefined = undefined;
  // 心跳消息的发送间隔
  private heartbeatInterval = 1000 * 30;

  // 保存事件回调
  private listeners: Record<
    "open" | "close" | "error" | "message",
    Function[]
  > = {
    open: [],
    close: [],
    error: [],
    message: [],
  };

  // ws是否停止
  private stopSelf = false;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * 启动websocket
   * 1.边界判断
   * 2.创建ws实例
   * 3.给ws添加监听器
   */
  public startWS() {
    // 已经启动，直接返回
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log("已存在open状态的ws实例, 请勿重复启动");
    }

    console.log("ws启动中...");

    this.socket = new WebSocket(this.url);
    this.socket.addEventListener("open", () => {
      this.dispatchEvent("open");
      this.startHeartBeat();
      // 连接成功，重置重连次数
      this.reconnectTimes = 0;
      console.log("ws连接成功.");
    });

    this.socket.addEventListener("close", () => {
      this.dispatchEvent("close");
      this.closeHeartBeat();
      this.handleReconnect();
      console.log("ws已关闭.");
    });

    this.socket.addEventListener("error", () => {
      this.dispatchEvent("error");
      this.closeHeartBeat();
      this.handleReconnect();
      console.log("ws出现错误!");
    });

    this.socket.addEventListener("message", (ev: MessageEvent<any>) => {
      this.dispatchEvent("message", ev);
    });
  }

  public send(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log("ws未连接, 无法发送消息!");
    }
  }

  public close(){
    this.socket?.close();
    this.stopSelf = true;
  }

  /**
   * 触发ws事件回调
   * @param type 回调类型
   */
  private dispatchEvent(
    type: "open" | "close" | "error" | "message",
    ev: MessageEvent<any> | undefined = undefined,
  ) {
    let listener = this.listeners[type];
    if (listener.length > 0) {
      listener.forEach((f) => {
        ev === undefined ? f() : f.call(this, ev);
      });
    }
  }

  /**
   * 开启定时器，定期发送心跳事件，实现保活
   */
  private startHeartBeat() {
    if (this.heartbeatTimer) {
      this.closeHeartBeat();
    }

    this.heartbeatTimer = setInterval(() => {
      if (this.socket) {
        if(this.stopSelf){
            clearInterval(this.heartbeatTimer);
            return;
        }
        this.socket.send(
          JSON.stringify({
            type: "heartbeat",
            data: {},
          }),
        );
        console.log("成功发送心跳消息！");
      } else {
        console.log("ws未连接, 心跳消息发送失败！");
      }
    }, this.heartbeatInterval);
  }

  /**
   * 停止发送心跳消息
   */
  private closeHeartBeat() {
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = undefined;
  }

  /**
   * 尝试重新连接
   */
  private handleReconnect() {
    if (this.stopSelf) return;
    if (this.reconnectTimes < this.maxReconnectTimes) {
      this.reconnectTimes++;
      // 重连间隔指数级增长，但是不超过最大间隔，防止用户等待时间过长
      let interval = Math.max(
        this.reconnectInterval * Math.pow(2, this.reconnectTimes - 1),
        this.maxReconnectInterval,
      );
      setTimeout(() => {
        this.startWS();
      }, interval);
      console.log("尝试重新连接...");
    }
  }

  // 添加事件回调
  public onopen(callback: Function) {
    this.listeners["open"].push(callback);
  }
  public onclose(callback: Function) {
    this.listeners["close"].push(callback);
  }
  public onerror(callback: Function) {
    this.listeners["error"].push(callback);
  }
  public onmessage(callback: Function) {
    this.listeners["message"].push(callback);
  }
}
