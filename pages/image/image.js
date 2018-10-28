!function () {
  var cube = document.getElementsByClassName('cube')[0],
    button = document.getElementsByClassName('image-buttons')[0],
    currentClass='show-image-1';
  button.addEventListener('click', function (e) {
    var targetNode = e.target;
    if(targetNode.nodeName === 'INPUT'){
      if(currentClass === targetNode.classList[0]) return false;
      cube.classList.remove(currentClass);
      currentClass = targetNode.classList[0];
      cube.classList.add(currentClass);
    }
  })
}();