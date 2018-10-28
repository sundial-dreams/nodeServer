const Router = require("../middleware/router");
const index = new Router();
index.get("/",async ctx => {
  await ctx.render("login")
});
index.get("/index", async ctx => {
  await ctx.render("index")
});
index.get("/picture", async ctx => {
  await ctx.render("picture")
});
index.get("/image",async ctx => {
  await ctx.render("image")
});
module.exports = index;