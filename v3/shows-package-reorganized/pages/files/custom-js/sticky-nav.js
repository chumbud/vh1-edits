$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  if (scroll >= 200) {
	    $("#header").removeClass("un_sticky_header");
	    $("#header").addClass("sticky_header");
	    $(".site_menu_wrapper").addClass("sticky_header_fix");
	  } else {
	    $("#header").removeClass("sticky_header");
	    $("#header").addClass("un_sticky_header");
	    $(".site_menu_wrapper").removeClass("sticky_header_fix");
	  }
	});
