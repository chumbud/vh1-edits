// this function will work on an elment that has a span. It will check to make sure the inner span fits within the height of the element
// if it doesn't it will truncate the text word by word in the span until it fits and then it will add an an ellipsis string
// ex. call: $j(".title .song_container").trimTextToFit();

//var $j = jQuery.noConflict();

//need to update code so the truncation refreshes if its called a second time and the height of the container changed

(function($){
	$.fn.trimTextToFit = function(ellipsisText) {
        var ellipsis;
		if (ellipsisText!="undefined") ellipsis = ellipsisText; else ellipsis = "...";

		return this.each(function() {
			var wrapContainer = $(this);
			var textContainer = $(this).children('span').first();
			var textContainerHTML;

			if (textContainer.length == 0) textContainer = $(this).children().first();
			
			if (textContainer.length != 0) { 
				//var wrapContainerHeight = wrapContainer.height(); //jQuery
				var wrapContainerMaxHeight = wrapContainer.css("max-height");
				var wrapContainerHeight;

				if (wrapContainerMaxHeight == "none") wrapContainerHeight = wrapContainer[0].offsetHeight;
				else wrapContainerHeight = parseInt(wrapContainerMaxHeight.substr(0, wrapContainerMaxHeight.indexOf('px')));
				
				//console.log("wrapContainerHeight: " + wrapContainerHeight);
            	//var textContainerHeight = textContainer.height(); //jQuery
            	var textContainerHeight = textContainer[0].offsetHeight;

				//console.log("textContainerHeight: " + textContainerHeight);
				if (textContainerHeight > wrapContainerHeight) {
                	//wrapContainer.attr("title", textContainer.text()); //jQuery
                    wrapContainer[0].setAttribute("title", textContainer.text()); 
				}
				
                while (textContainerHeight > wrapContainerHeight) { 
                	textContainerHTML = textContainer.html();
                	if (textContainerHTML.lastIndexOf(" ") == -1) break;
                	
                    textContainer.html(textContainer.html().substring(0, textContainerHTML.lastIndexOf(" "))+ "...");
            		//textContainerHeight = textContainer.height(); //jQuery
            		textContainerHeight = textContainer[0].offsetHeight; 
					//console.log(textContainer.html();
            		if (textContainerHeight == wrapContainerHeight) break;
				}
			}
		});
	};
})(jQuery);