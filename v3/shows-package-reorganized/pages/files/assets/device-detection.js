<!-- Javascript Device Detection -->
	<script>
			mtv = {};
			MTV = {};
			function detectDevice() {
				if(document.location.search.indexOf('device') > -1){
					mtv.device = document.location.search.split("=")[1];// assuming no other search parameters
				}
				else{
					var defaultDevice = 'desktop';
					var currOrientation;
					var availableWidth;
		
					switch(window.orientation){
					   case 0:
						   currOrientation = "portrait";
					   break;
			 
					   case -90:
						   currOrientation = "landscape";
					   break;
			 
					   case 90:
						   currOrientation = "landscape";
					   break;
			 
					   case 180:
						   currOrientation = "portrait";
					   break;
					}
					if (currOrientation == "landscape") availableWidth = screen.availHeight;
					else availableWidth = screen.availWidth;
		
					mtv.device = defaultDevice;
					
					if (availableWidth < 660) { mtv.device = 'mobile'; }
					else if (availableWidth < 980) { mtv.device = 'tablet'; }
					else if (window.orientation) {mtv.device = 'tablet'; } //for high res tablets in lanscape mode aassuming no orientation on desktops
		
					//if (screen.availWidth < 859) { mtv.device = 'smtablet' };
				}
				//alert(mtv.device);
				//alert("screen.availWidth:" + screen.availWidth + " window.innerWidth:" + window.innerWidth + " new availableWidth: " + availableWidth);
			}
			detectDevice();
			if (mtv.device == 'mobile') {
				document.write('<li' + 'nk rel="stylesheet" href="assets/css/mainMedium.css" type="text/css" />');
				document.write('<li' + 'nk rel="stylesheet" href="assets/css/mainSmall.css" type="text/css" />');
			}
			else if (!window.orientation) {//desktop
				document.write('<li' + 'nk rel="stylesheet" href="assets/css/mainLarge.css" type="text/css" />');
			}

	</script>