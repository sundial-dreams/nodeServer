!function (root,factory) {
  root.selector = factory().selector;
  root.selectorAll = factory().selectorAll;
}(this,function () {
  return {
    selector: function (cssName,scope) {
      if(typeof cssName !== "string") throw new Error("cssName must type string");
      scope = scope || document;
      return scope.querySelector(cssName);
    },
    selectorAll: function (cssName,scope) {
      if(typeof cssName !== "string") throw new Error("cssName must type string");
      scope = scope || document;
      return scope.querySelectorAll(cssName);
    }
  }
});