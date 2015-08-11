			/*
			try{
				Typekit.load();
			}catch(e){}
			*/
			
			var TEST2 = {
					displayDate: function(dateString,appendString){
						if(dateString=='') return;
						//does the date string contain a time with am/pm"
						//then most likly a blog date, we will need to add
						//'20' to the year also
						if(dateString.indexOf('m') > -1){
							var temp = dateString.split(' ');
							var strDate = temp[0];
							//fixing the year
							var arrDate = strDate.split('/');
							if(arrDate[2].length < 4)
								arrDate[2] = '20'+arrDate[2];
							strDate = arrDate.join('/');
							var strTime = temp[1];
							var strStand = temp[2];
							if(strTime.indexOf('am') > -1  || strTime.indexOf('12') > -1){
								//just strip the am
								strTime = strTime.substring(0,4);
							}
							else{ // pm strip and add 12 hours
								var strTime = strTime.substring(0,4);
								var temp2 = strTime.split(':');
								var intHour = parseInt(temp2);
								var hour = intHour+12;
								strTime = hour+':'+temp2[1]
							}
							dateString = strDate+' '+strTime+' '+strStand;
						}
						var postDate = new Date(dateString);
						var currDate = new Date(); // this should be a date created with the esi date obj
						var dif = currDate-postDate;
						if(dif > 86400000){ // this is over a day old
							var month = postDate.getMonth()+1;
							var year = postDate.getFullYear()+'';
							year = year.substring(2);
							return 'Posted '+month+'/'+postDate.getDate()+'/'+year
						}
						else{ // less than 24 hours so we need to post how many hours and minutes since posting
							var seconds = dif/1000;
							var minutes = Math.floor(seconds/60);
							var hours = Math.floor(minutes/60);
							var remainMin = Math.floor(minutes - hours * 60);
							var strAppend = '';
							if(appendString){
									strAppend = appendString
							}
							if(minutes < 60){
								if(minutes <= 1)
									return 'Posted 1 min ago'
								else
									return 'Posted '+minutes+' mins ago '+strAppend
							}
							else if(hours <= 24){
								var disHours = 'hr';
								if(hours > 1)
									disHours = 'hrs'
								return 'Posted '+hours+' '+disHours+' ago '+strAppend
							}
						}
					}
				}
			
			MTVN.initArray.push(function(){
				//var dateElements = document.getElementsByClassName('specialPostDateClass');
				var dateElements = $j(".specialPostDateClass");
				var len = dateElements.length;
				for(var i = 0; i < len; i++){
					var dateText = dateElements[i].innerHTML;
					if(dateText != ''){
						var display = TEST2.displayDate(dateText);
						dateElements[i].innerHTML = display;
					}
				}
			})
			
			MTVN.checkPostDates = function(){
				var dateElements = $j(".specialPostDateClass");
				var len = dateElements.length;
				for(var i = 0; i < len; i++){
					var dateText = dateElements[i].innerHTML;
					if(dateText.indexOf('Posted') < 0){
						if(dateText != ''){
							var display = TEST2.displayDate(dateText);
							dateElements[i].innerHTML = display;
						}
					}
				}

			}
			
			if(typeof(MTV.load6x6POE)=="function"){
				MTV.load6x6POE();
			}
			
			
