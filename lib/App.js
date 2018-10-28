const http = require("http");
const events = require("events");

//App类
class App extends events.EventEmitter {
  constructor() {
    super();
    this.middleware = [];//存中间件的数组，每一个中间件都是async函数，参数为(ctx,next)两个，返回值是Promise类型
    this.ctx = {};//ctx对象，挂装对象
    this.mountObject = {};//待挂装对象
    this.on("error", err => {//错误处理
      console.log(err)
    })
  }

  use(fn) {//use方法
    Array.isArray(fn) ? this.middleware.push(...fn) : this.middleware.push(fn);
    return this
  }

  mount(name, fn) {//往this.ctx挂载属性
    this.mountObject[name] = fn;//保存待挂载对象
  }

  callback() {
    const fn = compose(this.middleware);//这里是重点
    return (req, res) => {//这个返回的函数是http.createServer()的参数
      this.ctx = {req,res};
      Object.assign(this.ctx,this.mountObject);//挂载对象
      return fn(this.ctx)
    }
  }

  listen(...args) {//监听方法
    const server = http.createServer(this.callback());//创建Server
    server.listen(...args)
  }
}

//这是整个框架的核心，接入中间件数组
function compose(middleware) {
  return function (ctx, next) {//返回函数next下一个为中间件函数，这里为undefined
    let index = -1;

    function dispatch(i) {//处理第i个中间件的函数
      if (i <= index) return Promise.reject(new Error("error"));
      index = i;
      let fn = middleware[i];//第i个中间件
      if (i === middleware.length) fn = next;//最后一个中间件，fn指向next，这里为undefined
      if (!fn) return Promise.resolve();//fn===undefined时返回空Promise对象
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))//next指向dispatch.bind(null, i + 1)，执行下一个中间件函数
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return dispatch(0)
  }
}

module.exports = App;
