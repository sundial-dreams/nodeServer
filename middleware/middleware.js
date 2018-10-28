const queryString = require("querystring");
/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function postParse(ctx, next) {
  let {req} = ctx;
  console.log("post req");
  if (req.method === "POST") {//请求方法为post
    ctx.query = await new Promise(resolve => {
      let data = "";
      req.on("data", chunk => {//数据来临
        data += chunk;
      });
      req.on("end", () => {//数据完成
        console.log(data);
        resolve(queryString.parse(data))
      });
    });
  }
  await next();
}

module.exports = [
  postParse
];