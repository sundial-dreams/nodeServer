!function () {
  function selector(name, scope) {
    scope = scope || document;
    return scope.querySelector(name);
  }

  function selectorAll(name, scope) {
    scope = scope || document;
    return [].slice.call(scope.querySelectorAll(name))
  }

  function setStyle(element,object) {
    element = element || {};
    object = object || {};
    for (var key in object){
      if (object.hasOwnProperty(key)){
        element.style[key] = object[key];
      }
    }
  }
  var app = selector("#app");
  setTimeout(function () {
    setStyle(app,{
      transform:"translate(-50%, -50%)",
      opacity:1
    })
  },100)

}();