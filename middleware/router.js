const {EventEmitter} = require("events");
const {parse} = require("url");
const {extname} = require("path");
const queryString = require("querystring");

/**
 *
 * @param url
 * @param formatUrl
 * @returns {boolean}
 */
function urlJudge(url, formatUrl) {//匹配路由 url:app/any 真实的从请求中获取的路由 formatUrl:app/:id这类待匹配的路由
  //匹配方式 将url和formatUrl拆分为数组 然后挨个匹配碰到:id这种的跳过
  let urlArray = url.split("/");
  let formatUrlArray = formatUrl.split("/");
  let sign = formatUrlArray.some(url => url.startsWith(":"));//是否为/app/:name/:id这种的路由
  if (sign) {
    let map = {};//将匹配的路由字段保存起来 比如 /app/:id/:name === /app/12/dpf map = {id:"12",name:"dpf"}
    if (urlArray.length === formatUrlArray.length) {
      for (let i = 0; i < urlArray.length; i++) {
        if (urlArray[i] !== formatUrlArray[i] && !formatUrlArray[i].startsWith(":")) return false;//碰到不相等的直接返回false
      }
      for (let i = 0; i < urlArray.length; i++) {
        if (formatUrlArray[i].startsWith(":")) {
          if (urlArray[i].match(/\./) || !urlArray[i]) continue;//这里不希望匹配请求文件的路由和空路由 比如app/a.js 或app/
          map[formatUrlArray[i].substring(1)] = urlArray[i]//保存健值
        }
      }

      return map
    } else {
      return false
    }
  } else {
    return url === formatUrl
  }
}

/**
 *
 * @type {module.Router}
 */
module.exports = class Router extends EventEmitter {
  constructor() {
    super();
    this.getRouter = new Map();//保存get路由,[path , callback]的形式
    this.postRouter = new Map();//保存post路由
    this.subRouter = new Map();//保存子路由
    this.getRouterSign = new Map();//保存这一类的get路由 api/:method
    this.postRouterSign = new Map();//保存这一类的post路由 api/:method
    this.on("error", err => {
      console.log(err)
    })
  }

  get(path, callback) {
    let sign = path.split("/").some(p => p.startsWith(":"));//是否为 app/:name这一类路由
    sign ? this.getRouterSign.set(path, callback) : this.getRouter.set(path, callback);
    return this;
  }

  post(path, callback) {
    let sign = path.split("/").some(p => p.startsWith(":"));
    sign ? this.postRouterSign.set(path, callback) : this.postRouter.set(path, callback);
    return this;
  }

  use(path, subRouter) {//子路由
    this.subRouter.set(path, subRouter);
    return this
  }

  /**
   *
   * @param ctx
   * @returns {Promise<void>}
   */
  async routerHandle(ctx) {//路由匹配
    let {pathname, query} = parse(ctx.req.url);//从请求中获取路由
    let method = ctx.req.method;//获取请求方法
    if (extname(pathname)) return;//如果有扩展名，跳过该方法
    ctx.param = queryString.parse(query);//将路由里的参数保存到ctx.param里
    ctx.url = {};//保存 这类路由的值 app/:id => ctx.url.id

    /**
     * \
     * @param router get或post路由
     * @param routerSign get或post带标记的路由 ==> api/:method
     * @param subRouters 子路由
     * @param method 方法类型
     * @returns {Promise<void>}
     */
    async function execute(router, routerSign, subRouters, method) {
      let callback = router.get(pathname);//获取对应路由的回调，如果没有的话 返回null
      for (let [signUrl, callback] of routerSign.entries()) {//搜索整个带标记的路由
        let sign = urlJudge(pathname, signUrl);//是否有匹配上的
        if (sign) {
          Object.assign(ctx.url, sign);//给ctx.url挂载属性
          await callback && callback(ctx)
        }
      }
      await callback && callback(ctx);
      for (let [parentPath, subRouter] of subRouters.entries()) {//匹配子路由
        //子get路由和post路由
        for (let [childPath, callback] of method === "GET" ? subRouter.getRouter.entries() : subRouter.postRouter.entries()) {
          if (parentPath === "/" && childPath !== "/") parentPath = "";//防止出现 //app/index这类情况
          if (childPath === "/") childPath = "";//同样防止出现 //app/index 的情况
          if (parentPath + childPath === pathname) {//匹配上 执行回调
            await callback && callback(ctx);
          }
        }
        //子路由的get和post带标记的路由
        for (let [childPath, callback] of method === "GET" ? subRouter.getRouterSign.entries() : subRouter.postRouterSign.entries()) {
          if (parentPath === "/" && childPath !== "/") parentPath = "";
          if (childPath === '/') childPath = "";
          let sign = urlJudge(pathname, parentPath + childPath);
          if (sign) {
            Object.assign(ctx.url, sign);
            await callback && callback(ctx)
          }
        }
      }
    }

    if (method === "GET") {//处理get方法
      await execute(this.getRouter, this.getRouterSign, this.subRouter, method)
    }
    else if (method === "POST") {//处理post方法
      await execute(this.postRouter, this.postRouterSign, this.subRouter, method)
    }
  }

  register() {
    return async (ctx, next) => {//返回个中间件
      await this.routerHandle(ctx);//当请求到来，先执行路由匹配
      await next()
    }
  }
};
