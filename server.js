const App = require("./lib/App");//核心容器
//中间件
const Resource = require("./middleware/resource");
const Router = require("./middleware/router");
const middleware = require("./middleware/middleware");
const indexRouter = require("./router/index");
const apiRouter = require("./router/api");

const app = new App();
const resource = new Resource(["pages","public"]);
const router = new Router();

router.use("/api", apiRouter);
router.use("/", indexRouter);

app.mount("render",resource.render());//挂载render方法渲染pages下的页面
app.mount("send",resource.send());//挂载send方法可以发送文件
app.mount("json", function (object = {}) {
  if(typeof object !== "object") throw new Error("not object");
  this.res.end(JSON.stringify(object))
});
app.use(resource.dispatch())
   .use(middleware)
   .use(router.register());

app.listen(3000, () => {
  console.log("listen in 3000");
});
process.on("message", message => {
  console.log(message)
});