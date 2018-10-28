!function (root, factory) {
  factory()
}(this, function () {
  var host = "localhost:3000";
  var requestAPI = {
    login: "http://" + host + "/api/login"
  };
  var nextLink = "http://" + host+"/index";
  var current = null;
  var email = selector("#email");
  var password = selector("#password");
  var submit = selector("#submit");
  var emailLabel = selector("#email-label");
  var passwordLabel = selector("#password-label");
  email.addEventListener('focus', function (e) {
    if (current) current.pause();
    emailLabel.classList.remove("error");
    current = anime({
      targets: 'path',
      strokeDashoffset: {
        value: 0,
        duration: 700,
        easing: 'easeOutQuart'
      },
      strokeDasharray: {
        value: '240 1386',
        duration: 700,
        easing: 'easeOutQuart'
      }
    });
  });
  password.addEventListener('focus', function (e) {
    if (current) current.pause();
    emailLabel.classList.remove("error");
    current = anime({
      targets: 'path',
      strokeDashoffset: {
        value: -336,
        duration: 700,
        easing: 'easeOutQuart'
      },
      strokeDasharray: {
        value: '240 1386',
        duration: 700,
        easing: 'easeOutQuart'
      }
    });
  });
  submit.addEventListener('mouseover', function (e) {
    if (current) current.pause();
    current = anime({
      targets: 'path',
      strokeDashoffset: {
        value: -730,
        duration: 700,
        easing: 'easeOutQuart'
      },
      strokeDasharray: {
        value: '530 1386',
        duration: 700,
        easing: 'easeOutQuart'
      }
    });
  });
  submit.addEventListener("click", function () {
    var inputEmail = email.value;
    var inputPassword = password.value;
    if (inputEmail && inputPassword) {
      ajax.post(requestAPI.login, {
        email: inputEmail,
        password: inputPassword
      }).then(data => {
        if (data.isOk) {
          window.location.href = nextLink;
        } else {
          emailLabel.classList.add(data.email ? "" : "error");
          passwordLabel.classList.add(data.password ? "" : "error");
          email.value = data.email || "";
          password.value = data.password || "";
        }
      });
    }
  })
});