// Video Detail
	var leftHeight = $("#comments").height();
	var rightHeight = $("#related").height();
	var mainHeight = $(".item-player").height();
	
	if (leftHeight < rightHeight) {
	  $("#comments").css('minHeight', rightHeight - mainHeight + 120);
	}