!function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory())
  }
  else if (typeof module === "object" && module.exports) {
    module.exports = factory()
  } else {
    root.ajax = factory()
  }
}(this, function () {
  function ajax(object) {
    return new Promise(function (resolve, reject) {
      function isObject(object) { //是否为对象
        return typeof object === 'object';
      }

      function toQuerystring(data) { //对象转成查询字符串 例如{a:1,b:2} => a=1&b=2 或{a:[1,2],b:3} => a=1&a=2&b=3
        if (!isObject(data) || !data) throw new Error('data not object');
        var result = '';
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            if (isObject(data[key]) && !Array.isArray(data[key])) throw new Error('not support error');//除去对象
            if (Array.isArray(data[key])) {
              data[key].forEach(function (v) {
                result += key + '=' + v + '&'
              });
            } else {
              result += key + '=' + data[key] + '&';
            }
          }
        }
        return result.substr(0, result.length - 1);//去掉末尾的&
      }

      var url = object.url || '';
      var method = object.method.toUpperCase() || 'GET';
      var data = object.data || Object.create(null);
      var async = object.async || true;
      var dataType = object.dataType || 'json';//相应的数据类型 可选json ,text, xml


      var xhr = new XMLHttpRequest();

      url = ajax.baseUrl + url;
      data = toQuerystring(data);
      method === 'GET' && (url += '?' + data) && (data = null); //get 请求 => url 后面加上 ?a=1&b=2这种

      try {
        xhr.open(method, url, async);
        method === 'POST' && (xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'));//post请求需要设置请求头为 application/x-www-form-urlencoded 类型
        console.log(data);
        xhr.send(data);
        xhr.onreadystatechange = function () {//监听事件
          if (this.readyState === 4) {
            if (this.status === 200) {
              switch (dataType) {
                case 'json': {
                  resolve(JSON.parse(this.responseText));
                  break
                }
                case 'text': {
                  resolve(this.responseText);
                  break
                }
                case 'xml': {
                  resolve(this.responseXML);
                  break
                }
                default: {
                  break;
                }
              }
            } else {
              reject(new Error('error'))
            }
          }
        }
      } catch (e) {
        reject(e)
      }
    });
  }

  ajax.get = function (url, data) { //get方法
    return this({url: url, method: 'GET', data: data});
  };
  ajax.post = function (url, data) { //post方法
    return this({url: url, method: 'POST', data: data});
  };
  ajax.baseUrl = '';
  return ajax
});