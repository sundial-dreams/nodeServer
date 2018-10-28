const Router = require("../middleware/router");
const api = new Router();
api.get("/getData", async ctx => {
  ctx.json({type: "ok", data: ctx.url.param});
});
api.post("/postData", async ctx => {
  ctx.json({type: "ok", data: ctx.query})
});
//handle login
api.post("/login", async ctx => {
  console.log(ctx.query);
  let {email, password} = ctx.query;
  console.log(email,password);
  let myEmail = "123456789@qq.com",
    myPassword = "123456789";
  if (email === myEmail && password === myPassword) {
    ctx.json({
      isOk: true,
      email: true,
      password: true
    });
  } else {
    ctx.json({
      isOk: false,
      email: email === myEmail,
      password: password === myPassword
    })
  }
});
module.exports = api;