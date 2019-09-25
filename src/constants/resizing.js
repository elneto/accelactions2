const resizingFunctions = () => {
  var $ = require("jquery");
  window.onload = function() {
    resizeScrollYoo();
  };
  window.showHideAccount = function() {
    $("#accountbox").slideToggle();
    return false;
  };
  // Wait until the DOM has loaded before querying the document
  $(document).ready(function() {
    $.post("//sustainabledevelopment.un.org/showUserMenu2.php", function(
      result
    ) {
      $("#accountbox").html(result);
    });
  });
  function resizeScrollYoo() {
    if ($(window).scrollTop() > 35) {
      sdgkplogo.className = "sdgkplogo_small";
    } else {
      if ($(window).width() > 576) {
        sdgkplogo.className = "sdgkplogo_normal";
      }
    }
  }
  var sdgkplogo = document.getElementById("sdgkplogo");
  $(document).scroll(function() {
    resizeScrollYoo();
    //console.log("scrolling..." + $(window).scrollTop());
  });
  $(window).resize(function() {
    if ($(window).width() < 576) {
      sdgkplogo.className = "sdgkplogo_small";
    } else {
      sdgkplogo.className = "sdgkplogo_normal";
    }
  });
};
export default resizingFunctions;
