const fs = require("fs");
const path = require("path");
const events = require("events");
const url = require("url");
const util = require("util");
const mime = require("../util/mime");

const asyncStat = util.promisify(fs.stat);
const asyncReadFile = util.promisify(fs.readFile);

/**
 *
 * 获取目录  输入/index.js ==> pages/index/index.js  app/node/picture.css ==> pages/picture/picture
 *          输入app/name/public/css/reset.css ==> public/css/reset.css
 * @param pathname
 * @param folds
 * @returns {*}
 */
function getStaticPath(pathname, folds) {
  let urlArray = null;
  if (pathname.includes("/")) {
    urlArray = pathname.split("/");
  } else {
    urlArray = [pathname]
  }
  for (let i = urlArray.length - 1; i >= 0; i--) {//倒序遍历 找存在的静态目录
    if (folds.includes(urlArray[i])) {
      return urlArray.slice(i).join("/")
    }
  }
  //否则 考虑 index.js ==> pages/index/index.js是否存在
  pathname = `${folds[0]}/${pathname.replace(new RegExp(path.extname(urlArray[urlArray.length - 1]) + "$"), "")}/${urlArray[urlArray.length - 1]}`;
  if (fs.existsSync(path.resolve(`./${pathname}`))) {
    return pathname
  }
  return false
}

/**
 *
 * @type {module.Resource}
 */
module.exports = class Resource extends events.EventEmitter {
  constructor(folds = []) {
    super();
    this.folds = folds;//保存静态目录
    this.on("error", err => {
      console.log(err);
    });

  }

  setFolds(folds = []) {
    this.folds.push(...folds);
  }

  /**
   * 根据输入路由，发送指定文件
   * @param ctx
   * @param pathname
   * @returns {Promise<void>}
   * @private
   */
  async _send(ctx, pathname) {
    if (this.folds.some(fold => pathname.startsWith(fold))) {//保证属于静态目录
      const staticPath = path.resolve(`./${pathname}`);
      if (fs.existsSync(staticPath)) {//文件是否存在
        try {
          let stats = await asyncStat(staticPath);
          if (stats.isFile()) {//是否为文件
            let type = mime[path.extname(pathname)];//根据扩展名，获取对应的mime类型
            let data = await asyncReadFile(staticPath);
            ctx.res.writeHead(200, {"Content-type": type});
            ctx.res.end(data);
          } else {
            ctx.res.writeHead(404)
          }
        } catch (e) {
          this.emit("error", e);
        }
      } else {
        ctx.res.writeHead(404)
      }
    } else {
      ctx.res.writeHead(404)
    }
  }

  /**
   * 分发请求的文件
   * @param ctx
   * @returns {Promise<void>}
   * @private
   */
  async _dispatch(ctx) {
    let pathname = url.parse(ctx.req.url).pathname.substring(1);
    let extendName = path.extname(pathname);
    if (!extendName) return;//抛弃不是请求资源的路由
    if (getStaticPath(pathname, this.folds)) {
      await this._send(ctx, getStaticPath(pathname, this.folds));
    } else {
      ctx.res.writeHead(404);
    }

  }

  /**
   * ctx.render("index") ==> ctx.send("pages/index/index.html")
   * @param ctx
   * @param fold
   * @returns {Promise<void>}
   * @private
   */
  async _render(ctx, fold) {
    console.log(this.folds,fold);
    let pathname = path.join(this.folds[0], fold, `${fold}.html`);
    await this._send(ctx, pathname)
  }

  dispatch() {
    return async (ctx, next) => {
      await this._dispatch(ctx);
      await next()
    }
  }
  //提供对外的挂载接口 app.mount(name,this.send())
  send() {
    let that = this;
    return async function (pathname) {
      return that._send(this,pathname)
    }
  }

  render() {
    let that = this;
    return async function (page) {
      return that._render(this,page)
    }
  }
};