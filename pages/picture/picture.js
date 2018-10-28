(function (window, document) {
  (function Fun() {
    /**
     * 
     * @param {string} cssName 
     */
    function selector(cssName) {
      var object = document.querySelectorAll(cssName);
      if (object.length !== 0)
        return (object.length === 1) ? object[0] : object
    }
    /**
     * 
     * @param {} ele 
     * @param {} object 
     */
    function css(ele, object) {
      if (typeof(object) === 'object') {
        for (var key in object) {
          ele.style[key] = object[key]
        }
        return ele
      }
      if (typeof(object) === 'string') {
        return ele.style[object]
      }
    }

    function createEle(eleName, configObject) {
      var object = document.createElement(eleName);
      for (var key in configObject) {
        var value = configObject[key];
        if( typeof value === "object"){
          for(var k in value){
            object[key][k] = value[k]
          }
        }else {
          object[key] = value
        }
      }
      return object
    }

    function objectAssign(object1,object2) {
      if((typeof object1 === 'object') &&(typeof object2 === 'object')){
        var object = object1;
        for(var key in object2){
          object[key] = object2[key]
        }
        return object
      }

    }

    function viewWidth() {
      return window.innerWidth || document.documentElement.clientWidth
    }

    function viewHeight() {
      return window.innerHeight || document.documentElement.clientHeight
    }

    function createCube(width, height) {
      var number = 15,
          cubeWidth = width / number,
          cubeHeight = width / number,
          cubes = [];
      for (var i = 0; i < (height / cubeHeight); i++) {
        var cube = [];
        for (var j = 0; j < number; j++) {
          var ele = createEle('div', {className: 'cube'});
          var pageTransform = [
            {transform: 'translateZ(' + (cubeWidth / 2) + 'px)'},
            {transform: 'translateY(-' + (cubeWidth / 2) + 'px) rotateX(90deg)'},
            {transform: 'translateZ(-' + (cubeWidth / 2) + 'px) rotateX(-180deg)'},
            {transform: 'translateY(' + (cubeWidth / 2) + 'px) rotateX(-90deg)'},
            {transform: 'translateX(' + (cubeWidth / 2) + 'px) rotateY(90deg)'},
            {transform: 'translateX(-' + (cubeWidth / 2) + 'px) rotateY(-90deg)'}];
          var imgs = ['a.jpg','b.jpg','c.jpg','d.jpg','e.jpg','f.jpg'];
          for (var k = 1; k <= 6; k++) {
            var childele = createEle('div', {className: 'page' + k});
            css(childele, objectAssign({
              backgroundImage:'url(image/'+imgs[k-1]+')',
              backgroundSize:width+'px '+height+'px',
              backgroundPosition:-j*cubeWidth+'px '+-i*cubeHeight+'px'
            },pageTransform[k-1]));
            ele.appendChild(childele);
          }
          css(ele, {
            width: cubeWidth + 'px',
            height: cubeHeight + 'px',
            top: i * cubeHeight + 'px',
            left: j * cubeWidth + 'px'
          });
          cube.push(ele);
        }
        cubes.push(cube);
      }
      return cubes;
    }
  /*
   * 封装为类
   * {number:1,images:[],style:,speed,parent,parentWidth,parentHeight}
   * */
    function cubeImage(object) {
           this.number = object.number || 15;
           this.images = object.images;
           this.style = object.style || 0;
           this.parent = object.parent || 'body';
           this.speed = object.speed || 100;
           this.parentWidth = object.parentWidth || this._viewWidth();
           this.parentHeight = object.parentHeight || this._viewHeight();
           this.init();
    }
    cubeImage.prototype = {
      constructor:cubeImage,
      init: function () {
        this.cubes = this._createCube(this.parentWidth,this.parentHeight);
        var container = this._selector(this.parent);
        this.cubes.forEach(function (v) {
          v.forEach(function (v) {
            container.appendChild(v);
          })
        });

        this._styles[this.style].call(this);

      },
      _selector:function (cssName) {
        var object = document.querySelectorAll(cssName);
        if (object.length !== 0)
          return (object.length === 1) ? object[0] : object
      },
      _css: function (ele,object) {
        if (typeof(object) === 'object') {
          for (var key in object) {
            ele.style[key] = object[key]
          }
          return ele
        }
        if (typeof(object) === 'string') {
          return ele.style[object]
        }
      },
      _createEle: function (eleName, configObject) {
        var object = document.createElement(eleName);
        for (var key in configObject) {
          var value = configObject[key];
          if( typeof value === "object"){
            for(var k in value){
              object[key][k] = value[k]
            }
          }else {
            object[key] = value
          }
        }
        return object
      },
      _createCube: function (width,height) {

        var number = this.number,
          cubeWidth = width / number,
          cubeHeight = width / number,
          cubes = [];
        for (var i = 0; i < (height / cubeHeight); i++) {
          var cube = [];
          for (var j = 0; j < number; j++) {
            var ele = this._createEle('div', {className: 'cube'});
            var pageTransform = [
              {transform: 'translateZ(' + (cubeWidth / 2) + 'px)'},
              {transform: 'translateY(-' + (cubeWidth / 2) + 'px) rotateX(90deg)'},
              {transform: 'translateZ(-' + (cubeWidth / 2) + 'px) rotateX(-180deg)'},
              {transform: 'translateY(' + (cubeWidth / 2) + 'px) rotateX(-90deg)'},
              {transform: 'translateX(' + (cubeWidth / 2) + 'px) rotateY(90deg)'},
              {transform: 'translateX(-' + (cubeWidth / 2) + 'px) rotateY(-90deg)'}];
            var imgs = this.images;
            for (var k = 1; k <= 6; k++) {
              var childele = this._createEle('div', {className: 'page' + k});
              this._css(childele, objectAssign({
                backgroundImage:'url(image/'+imgs[k-1]+')',
                backgroundSize:width+'px '+height+'px',
                backgroundPosition:-j*cubeWidth+'px '+-i*cubeHeight+'px'
              },pageTransform[k-1]));
              ele.appendChild(childele);
            }
            this._css(ele, {
              width: cubeWidth + 'px',
              height: cubeHeight + 'px',
              top: i * cubeHeight + 'px',
              left: j * cubeWidth + 'px'
            });
            cube.push(ele);
          }
          cubes.push(cube);
        }

        function objectAssign(object1,object2) {
          if((typeof object1 === 'object') &&(typeof object2 === 'object')){
            var object = object1;
            for(var key in object2){
              object[key] = object2[key]
            }
            return object
          }

        }


        return cubes
      },
      _viewWidth: function () {
        return window.innerWidth || document.documentElement.clientWidth
      },
      _viewHeight: function () {
        return window.innerHeight || document.documentElement.clientHeight
      },
      _styles:[function () {

      var viewwidth = this.parentWidth,
          viewheight = this.parentHeight,
          cubesWidthLen = this.cubes[0].length,
          cubesHeightLen = this.cubes.length;
        var i = 0, j = 0, x = 0, y = 0, z = 0,
          option = [
            {transform:'rotateX(-90deg)'},
            {transform:'rotateX(-180deg)'},
            {transform:'rotateX(-270deg)'},
            {transform:'rotateY(90deg)'},
            {transform:'rotateY(-90deg)'},
            {transform:'rotateX(0)'},
          ];
        //4 4
        /*
         *1 1 1 1(0,3) 1(0,4) 1(0,5) 1(0,6) 1 1 1
         *1 1 1(1,2) 1(1,3) 1(1,4) 1() 1 1 1 1
         *1 1(2,1) 1(2,2) 1(2,3) 1 1 1 1 1 1(2,10)
         *1(3,0) 1(3,1) 1(3,2) 1 1 1 1 1 1 1
         *1(4,0) 1(4,1) 1 1 1 1 1 1 1 1
         *  */
        // console.log(cubesWidthLen, cubesHeightLen);
        var that = this;
        var inter = setInterval(function () {
          //console.log('i=', i, 'j=', j);
          for (var k = j, t = y; k >= x, t <= i; k--, t++) {
            css(that.cubes[t][k],option[z]);

            if ((t === cubesHeightLen - 1) && (k === cubesWidthLen - 1)) {
              z++;
              i = -1;
              j = -1;
              x = 0;
              y = 0;
              if(z===6){
                z = 0;
              }
              //clearInterval(inter);
            }
          }
          if (i < cubesHeightLen) i++;
          if (j < cubesWidthLen) j++;
          if (j === cubesWidthLen) {
            j = cubesWidthLen - 1;
            y++;
          }
          if (i === cubesHeightLen) {
            x++;
            i = cubesHeightLen - 1;
          }
        }, that.speed);
      }]
    };
    /*window.selector = selector;
    window.css = css;
    window.createEle = createEle;
    window.viewHeight = viewHeight;
    window.viewWidth = viewWidth;
    window.createCube = createCube;*/

    window.cubeImage = cubeImage;
  })();

  (function Exec() {
    /*console.log('ok');
    var container = selector('div.section1'),
      viewwidth = viewWidth(),
      viewheight = viewHeight(),
      cubes = createCube(viewwidth, viewheight),
      cubesWidthLen = cubes[0].length,
      cubesHeightLen = cubes.length;

    cubes.forEach(function (v) {
      v.forEach(function (v) {
        container.appendChild(v);
      })
    });
    var i = 0, j = 0, x = 0, y = 0, z = 0,
        option = [
          {transform:'rotateX(-90deg)'},
          {transform:'rotateX(-180deg)'},
          {transform:'rotateX(-270deg)'},
          {transform:'rotateY(90deg)'},
          {transform:'rotateY(-90deg)'},
          {transform:'rotateX(0)'},
          ];
    //4 4
    /!*
     *1 1 1 1(0,3) 1(0,4) 1(0,5) 1(0,6) 1 1 1
     *1 1 1(1,2) 1(1,3) 1(1,4) 1() 1 1 1 1
     *1 1(2,1) 1(2,2) 1(2,3) 1 1 1 1 1 1(2,10)
     *1(3,0) 1(3,1) 1(3,2) 1 1 1 1 1 1 1
     *1(4,0) 1(4,1) 1 1 1 1 1 1 1 1
     *  *!/
    // console.log(cubesWidthLen, cubesHeightLen);
    var inter = setInterval(function () {
      //console.log('i=', i, 'j=', j);
      for (var k = j, t = y; k >= x, t <= i; k--, t++) {
        css(cubes[t][k],option[z]);
        if ((t === cubesHeightLen - 1) && (k === cubesWidthLen - 1)) {
          z++;
          i = -1;
          j = -1;
          x = 0;
          y = 0;
          if(z===6){
            z = 0;
          }
          //clearInterval(inter);
        }
      }
      if (i < cubesHeightLen) i++;
      if (j < cubesWidthLen) j++;
      if (j === cubesWidthLen) {
        j = cubesWidthLen - 1;
        y++;
      }
      if (i === cubesHeightLen) {
        x++;
        i = cubesHeightLen - 1;
      }
    }, 100);*/
    new cubeImage({
      images:[
        'public/image/a.jpg',
        'public/image/b.jpg',
        'public/image/c.jpg',
        'public/image/d.jpg',
        'public/image/e.jpg',
        'public/image/f.jpg'],
      parent:'div.section1',
      speed:100, 
      number:15
    });
  })()
})(window, document);