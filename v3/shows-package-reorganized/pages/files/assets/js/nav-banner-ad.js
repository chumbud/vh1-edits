setTimeout(function () { 
	var scrollPost = $(document).scrollTop();
	if (scrollPost >= 150) {
		$(".navbar").animate({marginTop: "-150", opacity: 0}, 400,
		function(){
			$("body").addClass("relative");
		});	
	}
	else {
		$(".navbar").animate({marginTop: -scrollPost}, 400,
		function(){
			$("body").addClass("relatively");
		});	
	}
}, 3000);