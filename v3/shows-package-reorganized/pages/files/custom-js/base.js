/*hash:d5b055fd4f4e041db8125f567c128016*/
/* namespace.js */
/* 
 * jQuery Namespace 
 * Use namespaces to protect your global integrity.
 * Creates new object (namespace) within JQuery / JQuery.fn
 */
(function ($) { 
	var methods = {}; 

	/**
	 * This one defines namespace 
	 */
	$.namespace = function(ns) { 
    
		methods[ns] =  methods[ns] || {}; 
		
		// getting reference to a namespaced jquery object
		function nsfun(selector, context) {
			return $(selector, context).namespace(ns);
		}
    
		// adding methods to FN (using namespaces in jquery plugins)
		nsfun.fn = methods[ns];

		return nsfun;
	};
  
	/**
	 * Function that allows using namespaces in jQuery plugins
	 */
	$.fn.namespace = function(ns) { 
		if (methods[ns]) {
			$.extend(this, methods[ns]);
		}
		return this; 
	}; 
}) (jQuery);
/* cookie.js */
/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

/* crabapple.js */
/**
 * Creates $Crabapple global object which will hold all crabapple core javascript
 */
(function ($) {
	$Crabapple = $.namespace('Crabapple');
}) (jQuery);
/* class.js */
/**
 * Crabapple Class class is a base parent class for all classes
 * //TODO DOC all features of this class
 */
(function($){
	$Crabapple.Class = function(){};

	/**
	 * Type hierarchy class.
	 * 
	 * This class helps us navigate through type hierarchy.
	 * 
	 * @class
	 * @memberOf $Crabapple.Class
	 * @param type
	 */
	var Hierarchy = $Crabapple.Class.Hierarchy = function(/** Function */type){
		this.type = type;
	}
	/**
	 * @param type
	 * @returns Fluent interface
	 */
	Hierarchy.prototype.set = function(/** Function */type)/** Hierarchy */{
		this.type = type;
		return this;
	}
	/**
	 * @param cb callback will receive ancestor
	 * @returns Fluent interface
	 */
	Hierarchy.prototype.map = function(/** Function */cb)/** Hierarchy */{
		var stack = this.stack = [];
		for (var ancestor = this.type.prototype; 'parentClass' in ancestor; ancestor = ancestor.parentClass) {
			if (false !== cb(ancestor)) {
				stack.push(ancestor);
			}
		}
		return this;
	}
	/**
	 * @param cb callback will receive all matched ancestor and should return array with filtered ancestors 
	 * @returns Fluent interface
	 */
	Hierarchy.prototype.reduce = function(/** Function */cb)/** Hierarchy */{
		this.stack = cb(this.stack);
		return this;
	}
	/**
	 * @param cb callback will receive ancestor
	 * @returns Fluent interface
	 */
	Hierarchy.prototype.apply = function(/** Function */cb)/** Hierarchy */{
		var stack = this.stack;
		for (var i = stack.length - 1; i > -1; -- i) {
			cb(stack[i]);
		}
		return this;
	}

	/**
	 * Create a new Class that inherits from this class.
	 * 
	 * Merge 'options' and 'requires' properties.
	 * 
	 * @param parent parent class to extends
	 * @param child new child class
	 * @param [o] options to add to child's prototype
	 */
	$Crabapple.extend = function(/** Function */parent, /** Function */child, /** Object */o){
		o = o || {};
		var fn = function(){};

		fn.prototype = parent.prototype;
		child.prototype = new fn();
		child.prototype.parentClass = parent.prototype;
		child.prototype.constructor = child;

		for (var key in o) {
			child.prototype[key] = o[key];
		}

		var h = new Hierarchy(child).map(function(ancestor){
			return 'options' in ancestor;

		}).apply(function(ancestor){
			$.extend(child.prototype.options, ancestor.options);
		});
		
		h.set(child).map(function(ancestor){
			return 'requires' in ancestor;

		}).apply(function(ancestor){
			$.extend(child.prototype.requires, ancestor.requires);
		});
	};

	/**
	 * Instantiate new instance of specified type.
	 * 
	 * Calls init() methods step-by-step.
	 * 
	 * @param type type to instantiate
	 * @param args arguments for init() method
	 * @returns initialized new instance of type
	 */
	$Crabapple.instantiate = function(/** Function */type, /** Array */args)/** Object */{
		var o = new type();
		new Hierarchy(type).map(function(ancestor){
			if (ancestor.hasOwnProperty) {
				return ancestor.hasOwnProperty('init');
			} else {
				return 'init' in ancestor;
			}
		}).apply(function(ancestor){
			ancestor.init.apply(o, args);
		});
		return o;
	};

})(jQuery);
/* utils.js */
(function($) {
	/**
	 * @namespace Holds Crabapple utils methods
	 */
	$Crabapple.utils = {};
		
	$Crabapple.utils.DateTime = {};
	$Crabapple.utils.DateTime.currentDate = false;
	$Crabapple.utils.DateTime.format = function(format) {
		var returnStr = '';
		var replace = this.replaceChars;
		for (var i = 0; i < format.length; i++) {
			var curChar = format.charAt(i);
			if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
				returnStr += curChar;
			}
			else if (replace[curChar]) {
				returnStr += replace[curChar].call(this);
			} else if (curChar != "\\") {
				returnStr += curChar;
			}
		}

		return returnStr;
	};
	
	$Crabapple.utils.DateTime.replaceChars = {
		shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

		// Day
		d: function() { return (this.currentDate.getDate() < 10 ? '0' : '') + this.currentDate.getDate(); },
		D: function() { return this.replaceChars.shortDays[this.currentDate.getDay()]; },
		j: function() { return this.currentDate.getDate(); },
		l: function() { return this.replaceChars.longDays[this.currentDate.getDay()]; },
		N: function() { return this.currentDate.getDay() + 1; },
		S: function() { return (this.currentDate.getDate() % 10 == 1 && this.currentDate.getDate() != 11 ? 'st' : (this.currentDate.getDate() % 10 == 2 && this.currentDate.getDate() != 12 ? 'nd' : (this.currentDate.getDate() % 10 == 3 && this.currentDate.getDate() != 13 ? 'rd' : 'th'))); },
		w: function() { return this.currentDate.getDay(); },
		z: function() { var d = new Date(this.currentDate.getFullYear(),0,1); return Math.ceil((this.currentDate - d) / 86400000); }, // Fixed now
		// Week
		W: function() { var d = new Date(this.currentDate.getFullYear(), 0, 1); return Math.ceil((((this.currentDate - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
		// Month
		F: function() { return this.replaceChars.longMonths[this.currentDate.getMonth()]; },
		m: function() { return (this.currentDate.getMonth() < 9 ? '0' : '') + (this.currentDate.getMonth() + 1); },
		M: function() { return this.replaceChars.shortMonths[this.currentDate.getMonth()]; },
		n: function() { return this.currentDate.getMonth() + 1; },
		t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
		// Year
		L: function() { var year = this.currentDate.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
		o: function() { var d  = new Date(this.currentDate.valueOf());  d.setDate(d.getDate() - ((this.currentDate.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
		Y: function() { return this.currentDate.getFullYear(); },
		y: function() { return ('' + this.currentDate.getFullYear()).substr(2); },
		// Time
		a: function() { return this.currentDate.getHours() < 12 ? 'am' : 'pm'; },
		A: function() { return this.currentDate.getHours() < 12 ? 'AM' : 'PM'; },
		B: function() { return Math.floor((((this.currentDate.getHours() + 1) % 24) + this.currentDate.getMinutes() / 60 + this.currentDate.getSeconds() / 3600) * 1000 / 24); }, // Fixed now
		g: function() { return this.currentDate.getHours() % 12 || 12; },
		G: function() { return this.currentDate.getHours(); },
		h: function() { return ((this.currentDate.getHours() % 12 || 12) < 10 ? '0' : '') + (this.currentDate.getHours() % 12 || 12); },
		H: function() { return (this.currentDate.getHours() < 10 ? '0' : '') + this.currentDate.getHours(); },
		i: function() { return (this.currentDate.getMinutes() < 10 ? '0' : '') + this.currentDate.getMinutes(); },
		s: function() { return (this.currentDate.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
		u: function() { var m = this.currentDate.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m; },
		// Timezone
		e: function() { return "Not Yet Supported"; },
		I: function() { return "Not Yet Supported"; },
		O: function() { return (-this.currentDate.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.currentDate.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.currentDate.getTimezoneOffset() / 60)) + '00'; },
		P: function() { return (-this.currentDate.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.currentDate.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.currentDate.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
		T: function() { var m = this.currentDate.getMonth(); this.currentDate.setMonth(0); var result = this.currentDate.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.currentDate.setMonth(m); return result;},
		Z: function() { return -this.currentDate.getTimezoneOffset() * 60; },
		// Full Date/Time
		c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
		r: function() { return this.currentDate.toString(); },
		U: function() { return this.currentDate.getTime() / 1000; }
	};
	
	/**
	 * "2009-04-29 08:53:31" => relative time format
	 * "2009-04-29T08:53:31+0000" => relative time format
	 * object Date => relative time format
	 */
	$Crabapple.utils.DateTime.relativeTime = function(originalDate) {
		formatPattern = (arguments[1] && arguments[1].length > 0) ? arguments[1] : "F d, Y";
		if(originalDate instanceof Date){
			this.currentDate = originalDate;
		}else{
			currentDate = (originalDate || "").replace(/-/g,"/").replace(/TZ/g," ").replace(/\+(\w+)/g,"")
			this.currentDate  = new Date(currentDate);
		}
		
		var diff = (((new Date()).getTime() - this.currentDate.getTime()) / 1000);
		var day_diff = Math.floor(diff / 86400);
		
		if ( isNaN(day_diff) || day_diff < 0)
			return;
		
		return day_diff == 0 && (
				diff < 60 && "just now" ||
				diff < 120 && "1 minute ago" ||
				diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
				diff < 7200 && "1 hour ago" ||
				diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
			day_diff == 1 && "Yesterday" ||
			day_diff < 7 && day_diff + " days ago" ||
			day_diff < 30 && (Math.ceil( day_diff / 7 ) > 1 ? Math.ceil( day_diff / 7 ) + " weeks ago" : "1 week ago") ||
			day_diff < 365 && (Math.floor( day_diff / 30 ) > 1 ? Math.floor( day_diff / 30 ) + " months ago" : "1 month ago") ||
			this.format(formatPattern);
	};
	
	
	/**
	 * replace links in text to their html compliance
	 */
	$Crabapple.utils.linkToHtml = function(elm) {
		var returning = [];
		var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
		elm.each(function() {
			returning.push(this.replace(regexp,"<a href=\"$1\">$1</a>"));
		});

		return jQuery(returning);
	}
}) (jQuery);

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
/* buzzblob.js */
;(function ( $ ) {
	$.fn.buzzblob = function(options) {

		var _element = this,
			_mask,
			_list,
			_items,
			_tabsList,
			_tabs,
			_interval,
			_scrollWidth,
			_index,
			timeoutId;

		if (!options.list) {
			// No list is provided - this is a problem.
			console.log('Buzzblob failed - please provide a list');
			return false;
		} else {
			var _options = $.extend({
				mask: {},
				list: {},
				direction: 'horizontal',
				addArrows: false,
				stepNumber: 0,
				itemClass: '',
				itemTabClass: '',
				highlightClass: '',
				highlightState: false,
				loadMore: false,
				loadMoreType: 'percent',
				loadMoreAmount: 100,
				loadMoreCallback: null,
				bodyScroll: false,
				scrollTimer: null,
				animation: 500,
				autoPlayTimer: null,
				circular: false,
				rightMargin: 10,
				addTabs: false,
				multiTabs: false,
				numTabs: 4,
				tabsList: {}
			}, options);
		}
		//re-init buzzblob and re-setup width. use it for responsive carousels. Example: $elm.trigger('buzzblobResize'); (m031 js)
		_element.on('buzzblobResize', function(e, noScroll) {
			_items = null;
			_module.adjustWidth();
			_module.showControls();
			if (!noScroll) {
				var width = _element.width(),
					scrollWidth = _module.mask().scrollLeft(),
					stepNumber = Math.round(scrollWidth/width);
				_module.mask().scrollLeft(stepNumber * width);
			}
		});

		var _module = {

			options: function(key, value) {
				if (arguments.length === 0) {
					return $.extend({}, _options);
				}

				if (typeof key === 'string') {
					if (typeof value === 'undefined') {
						return typeof _options[key] === 'undefined' ? null : _options[key];
					}
					_options[key] = value;
				} else {
					_options = $.extend({}, _options, key);
				}

				return this;
			},
			list: function() {
				if (_list == null) {
					_list = _element.find(_module.options('list')).first();
				}
				return _list;
			},
			items: function() {
				if (_items == null) {
					_items = _module.list().find( _options.itemClass ? "." + _options.itemClass : 'li' );
				}
				return _items;
			},
			tabsList: function() {
				if (_tabsList == null) {
					if (_options.multiTabs == true) {
						_tabsList = _element.find(_module.options('tabsList'));
					}
					else {
						_tabsList = _element.find(_module.options('tabsList')).first();
					}
				}
				return _tabsList;
			},
			tabs: function() {
				if (_tabs == null) {
					if (_options.multiTabs == true) {
						_tabs = _module.tabsList().first().find( _options.itemTabClass ? "." + _options.itemTabClass : 'li' );
					}
					else {
						_tabs = _module.tabsList().find( _options.itemTabClass ? "." + _options.itemTabClass : 'li' );
					}
				}
				return _tabs;
			},
			showControls: function(){
				if(_options.circular || _options.addArrows === false) {
					return;
				}else{
					var _left = _module.mask().scrollLeft();
					if(_left > 0){
						_element.find(".left_arrow").show().removeClass('invisible');
					}else{
						_element.find(".left_arrow").hide().addClass('invisible');
					}
					
					if((_module.list().width() - _left  - _element.width()) >=  _options.rightMargin ){
						_element.find(".right_arrow").show().removeClass('invisible');
					}else{
						_element.find(".right_arrow").hide().addClass('invisible');
					}
				}
			},
			mask: function(){
				if (_mask == null) {
					if(_options.mask){
						_mask = $(_element).find(_options.mask).first();
						if (_options.loadMore) {
							_mask.scroll(function() {
								if (_options.scrollTimer) {
									clearTimeout(_options.scrollTimer);
								}
								_options.scrollTimer = setTimeout(function() {
									_module.horizontalScrollEnd();
								}, 250);
							});
						}
					}else {
						// No mask is provided - this is a problem.
						console.log('Buzzblob failed - please provide a mask');
						return false;
					}
				}
				return _mask;
			},

			setupHorizontalScroller: function() {

				_module.adjustWidth();
		
				// Add left / right arrows
				if (_options.addArrows) {
					if (_element.find('.left_arrow').length == 0) {
						$("<a class='left_arrow' href='javascript:void(0);'><span></span></a>").prependTo(_element).on("click", function(event) {
							event.preventDefault();
							_module.doScroll('left');
						});
					}
					else {
						_element.find('.left_arrow').on('click', function(event) {
							event.preventDefault();
							_module.doScroll('left');
						});
					}
					if (_element.find('.right_arrow').length == 0) {
						$("<a class='right_arrow' href='javascript:void(0);'><span></span></a>").appendTo(_element).on("click", function(event) {
							event.preventDefault();
							_module.doScroll('right');
						});
					}
					else {
						_element.find('.right_arrow').on('click', function(event) {
							event.preventDefault();
							_module.doScroll('right');
						});
					}
					_module.showControls();
				}

				// Add tabs navigation
				if (_options.addTabs) {
					var $tab;
					if(!_options.circular){
						$.each(_module.tabsList(), function() {
							$tab = $(this).find('li');
							$tab.width(100 / _module.tabs().length + '%');

							$tab.on('touch click', function() {
								_module.scrollToElement($(this).index());
								_tabsList.find('.active').removeClass('active');
								if (_options.multiTabs == true) {
									var index = $(this).index();
									$.each(_module.tabsList(), function() {
										$(this).children('li').eq(index).addClass('active');
									});
								}
								else {
									$(this).addClass('active');
								}
							});
						});
					}
					$(_module.tabsList()).find('li').first().addClass('active');
					if (_options.multiTabs == true) {
						$(_module.tabsList()).last().find('li').first().addClass('active');
					}
				}

				if (_options.autoPlayTimer) {
					_module.setAutoplay( _module.mask(), _module.list());
				}

			},
            adjustWidth: function() {
                // Adjust list width
                if (_options.multiWidth == true) {
                    this.adjustMultiWidth();
                    return;
                }

                var listItem =_module.items().first(),
                    totalWidth;

                if ( _options.highlightClass !== '' ) {

                    var highlightWidth = _module.list().find( "." + _options.highlightClass).outerWidth(true);
                    var highlightCount = _module.list().find( "." + _options.highlightClass).length;
                    totalWidth = listItem.next().outerWidth(true);

                    _scrollWidth = Math.floor(_module.mask().width() / totalWidth)*totalWidth;

                    totalWidth *= (_module.items().length - highlightCount);
                    totalWidth += (highlightWidth * highlightCount);

                    _module.list().width( totalWidth );
                } else {
                    totalWidth = listItem.outerWidth(true);
                    _scrollWidth = Math.floor(_module.mask().width() / totalWidth)*totalWidth;
                    _module.list().width( totalWidth *= _module.items().length );
                }

                if(_options.stepNumber !== 0){
                    _scrollWidth = _options.stepNumber * listItem.outerWidth(true);
                }
            },
			adjustMultiWidth: function() {
				var totalWidth = 0, averageItemWidth = 0, items = _module.items();
				_module.items().each(function() {
					totalWidth += $(this).outerWidth(true);
				});
				averageItemWidth = Math.floor(totalWidth / items.length);
				_scrollWidth = Math.floor(_module.mask().width() / averageItemWidth) * averageItemWidth;
				_module.list().width(totalWidth);
				if (_options.stepNumber !== 0) {
					_scrollWidth = _options.stepNumber * averageItemWidth;
				}
			},

			doScroll: function(direction) {
				var width = _element.width(),
					scrollWidth = _module.mask().scrollLeft(),
					stepNumber = Math.ceil(scrollWidth/width),
					highlightItem, pinnedItem;

				if (direction=='left' && stepNumber == 0) {
					return;
				}
				if (direction=='right' && stepNumber == _module.list().find('>li').length-1) {
					return;
				}

				if(_module.mask().hasClass('animated')) {
					return false;
				} else {
					_module.mask().addClass('animated');
				}

				_module.adjustWidth();
				if(_options.circular) {
					_module.mask().find("ul:first").css('right','0')
				}

				if (_options.direction == 'horizontal') {
					if (direction == 'right' || direction == 'left') {
						if (direction == 'right') {
							_module.mask().animate({scrollLeft:"+=" + _scrollWidth}, _options.animation, "easeInOutCubic", function() {
								_module.mask().removeClass('animated');
								_module.showControls();
								if(_options.circular) {
									_module.circularMovement(direction, _module.mask());
								}
								_module.tabsList().trigger('nextFrame');
							});
						} else {
							if(_options.circular) {
								_module.circularMovement(direction, _module.mask());
							}
							_module.mask().animate({scrollLeft:"-=" + _scrollWidth}, _options.animation, "easeInOutCubic", function() {
								_module.mask().removeClass('animated');
								_module.showControls();
								_module.tabsList().trigger('nextFrame');
							});
						}
						
						if (_options.highlightState) {
							highlightItem = _module.list().find('.selected');
							pinnedItem = _element.find('li.pinned');
							
							if (_index || _index === 0) {
								if (pinnedItem && !pinnedItem.hasClass('selected')) {
									pinnedItem.removeClass('pinned');
									
									if (_index === _module.list().find('li').length) {
										pinnedItem.appendTo(_module.list());
									} else {
										pinnedItem.insertBefore(_module.list().find('li').eq(_index));
									}
									_index = highlightItem.index();
								}
								highlightItem.addClass('pinned').prependTo(_element);

							} else {
								_index = highlightItem.index();
								highlightItem.addClass('pinned').prependTo(_element);
								_module.list().trigger('buzzblobResize');
							}
						}
					}
				}
				if (direction == 'up' || direction == 'down') {
					var maskHeight = _module.mask().height();
					if (direction == 'down') {
						_module.mask().animate({scrollTop:"+="+maskHeight}, _options.animation);
					} else {
						_module.mask().animate({scrollTop:"-="+maskHeight}, _options.animation);
					}
				}

				if (_options.direction == 'flash') {
					var scroller = _module.mask();

					if (scroller.css('left') == 'auto') {
						scroller.css('left', '0');
					}
					if (direction == 'right') {
						// fade out - move right - fade in
						scroller.animate({opacity: 0.0001},_options.animation/2, 'easeInOutCubic', function() {
							scroller.animate({scrollLeft:"+=" + _scrollWidth}, 0);
							scroller.animate({opacity: 1}, _options.animation/2, 'easeInOutCubic', function() {
								scroller.removeClass('animated');
								_module.showControls();
								if(_options.circular) {
									_module.circularMovement(direction, _module.mask());
								}
							});
						});
					} else {
						if(_options.circular) {
							_module.circularMovement(direction, _module.mask());
						}

						// fade out - move left - fade in
						scroller.animate({opacity: 0.0001}, _options.animation/2, 'easeInOutCubic', function() {
							scroller.animate({scrollLeft:"-=" + _scrollWidth}, 0);
							scroller.animate({opacity: 1}, _options.animation/2, 'easeInOutCubic', function() {
								scroller.removeClass('animated');
								_module.showControls();
								if(_options.circular) {
									_module.circularMovement(direction, _module.mask());
								}
							});
						});
					}
				}

				//Check autoplay option
				if(_options.autoPlayTimer) {
					_module.setAutoplay(_module.mask(), _options.list);
				}

			},

			horizontalScrollEnd: function() {
				var percent = (_module.mask().scrollLeft() + _module.mask().width()) / _options.list.width() * 100,
					scrollPosition = _module.mask().scrollLeft() + _module.mask().width();

				if ( (_options.loadMoreType == 'percent' && percent >= _options.loadMoreAmount) || (_options.loadMoreType != 'percent' && scrollPosition >= _options.loadMoreAmount) ) {
					_options.loadMoreCallback(this.list());
				}
			},

			scrollToElement: function(index) {
				_list.animate({right: _list.find('li:eq('+index+')').position().left}, 500, 'swing', function () {
					window.Triforce.getMediator().trigger('triforce:pageintouch');
				});

			},

			setupVerticalScroller: function() {
				if (_options.bodyScroll && _options.loadMore) {
					$(document).scroll(function() {
						if (_options.scrollTimer) {
							clearTimeout(_options.scrollTimer);
						}
						_options.scrollTimer = setTimeout(function() {
							_module.verticalScrollEnd();
						}, 250);
					});
				}
			},
			
			verticalScrollEnd: function() {
				if (_options.bodyScroll) {
					var scrollTop = $(document).scrollTop(),
						maskTop = _module.mask().scrollTop(),
						maskHeight = _module.mask().height(),
						percent = (scrollTop - maskTop) / maskHeight * 100;

					if ( (_options.loadMoreType == 'percent' && percent >= _options.loadMoreAmount) || (_options.loadMoreType != 'percent' && scrollTop >= _options.loadMoreAmount) ) {
						_options.loadMoreCallback();
					}
				}
			},

			setAutoplay: function (mask, list) {
				if((mask.scrollLeft() + mask.width()) - list.width() === 0) {
					return false;
				} else {
					clearTimeout(timeoutId);
					timeoutId = setTimeout(function(){
						_module.doScroll('right', mask, list);
					}, _options.autoPlayTimer);
				}
			},
			circularMovement: function(direction, mask) {
				if (direction ==  'left') {
					_options.list.find("li:last").prependTo(_options.list);
					mask.scrollLeft(mask.width());
				} else if (direction ==  'right') {
					_options.list.find("li:first").appendTo(_options.list);
					mask.scrollLeft(0);
				}
			},
		};
		var onAvailable = function(el, fn){			
			if (el.width() > 0) {
				fn.call();
			} else {
				_interval = setInterval(function(){
					if ($(el).width() > 0) {
						clearInterval(_interval);  
						fn.call();
					}
				},50);  
			}
		}

		var scrollCounter = 1,
			scrollTimeoutId;

		_module.mask().on('ontouchmove' in window ? 'touchmove scroll' : 'scroll', function () {
			clearTimeout(scrollTimeoutId);
			if (scrollCounter % 10 === 0) {
				scrollCounter = 1;
				window.Triforce.getMediator().trigger('triforce:pageintouch');
			}
			scrollCounter++;
			scrollTimeoutId = setTimeout(function () {
				window.Triforce.getMediator().trigger('triforce:pageintouch');
			}, 50);
		});

		if (_options.direction == 'horizontal') {
			onAvailable(_element, function(){_module.setupHorizontalScroller();});
		} if (_options.direction == 'flash') {
			onAvailable(_element, function(){_module.setupHorizontalScroller();});
		} else {
			_module.setupVerticalScroller();		
		}
	};
	return this;
}( jQuery));

(function() {
	var baseEasings = {};

	$.each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( i, name ) {
		baseEasings[ name ] = function( p ) {
			return Math.pow( p, i + 2 );
		};
	});

	$.extend( baseEasings, {
		Sine: function ( p ) {
			return 1 - Math.cos( p * Math.PI / 2 );
		},
		Circ: function ( p ) {
			return 1 - Math.sqrt( 1 - p * p );
		},
		Elastic: function( p ) {
			return p === 0 || p === 1 ? p :
				-Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
		},
		Back: function( p ) {
			return p * p * ( 3 * p - 2 );
		},
		Bounce: function ( p ) {
			var pow2,
				bounce = 4;

			while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
			return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
		}
	});

	$.each( baseEasings, function( name, easeIn ) {
		$.easing[ "easeIn" + name ] = easeIn;
		$.easing[ "easeOut" + name ] = function( p ) {
			return 1 - easeIn( 1 - p );
		};
		$.easing[ "easeInOut" + name ] = function( p ) {
			return p < 0.5 ?
				easeIn( p * 2 ) / 2 :
				1 - easeIn( p * -2 + 2 ) / 2;
		};
	});

})();

/* reporting.js */
if(typeof $Crabapple == "undefined") $Crabapple = {};

var vmn_page_data = {};

$Crabapple.repo = {
	_tag:"REPO: ",
	_codaUrl:false,
	_repoUrl:false,
	_repoData:false,
	_adsSelector:"[data-adsize][data-ad-sizes]",
	_extraKeyValues:[],
	_staticAds:true,
	_queryStringValues:{},
	
	_log: function(msg){
		if(typeof console != "undefined"){
			if(typeof console.debug === "function") {
				console.debug($Crabapple.repo._tag+msg);
			} else {
				console.log($Crabapple.repo._tag+msg);
			}
		}
	},
	
	_error: function(msg){
		if(typeof console != "undefined"){
			console.error($Crabapple.repo._tag+msg);
		}
	},
	
	init: function(codaUrl, repoUrl, isStaticAds){
		$.ajaxSetup({cache:true});
		$Crabapple.repo._log("init called");
		$Crabapple.repo._codaUrl = codaUrl;
		$Crabapple.repo._repoUrl = repoUrl;
		$Crabapple.repo._staticAds = (typeof isStaticAds == "undefined"?true:isStaticAds);
		
		//parse query string for add on rules
		var queryString = location.search.substr(1).split("&");
		for(var i in queryString){
			var pair = queryString[i];
			if (pair === "") continue;
		    var parts = pair.split("=");
			$Crabapple.repo._queryStringValues[parts[0]] = decodeURIComponent(parts[1].replace(/\+/g, " "));
		}

		//check if testmode was passed
		if($Crabapple.repo._queryStringValues.testmode != null){
			$Crabapple.repo.addKeyValue("testmode",$Crabapple.repo._queryStringValues.testmode);
		}
	},
	
	loadCoda: function(){
		$Crabapple.repo._log("loadCoda called");
		
		if(typeof btg != "undefined" && typeof btg.DoubleClick != "undefined" && typeof btg.DoubleClick.createAd != "undefined") {
			//coda was already loaded so this is a pushstate page load so we need to refire tracking
			$Crabapple.repo._fireTracking();
			$('body').trigger('codaLoaded');
			return;
		}
		$('body').append('<script src="'+$Crabapple.repo._codaUrl+'" type="text/javascript"></script>');
		//$('body').append('<script id="coda_script" src="'+$Crabapple.repo._codaUrl+'" type="text/javascript"></script>');
		$Crabapple.repo._codaWait=1;
		$Crabapple.repo._codaCallback();
	},
	
	_codaCallback: function(){
		$Crabapple.repo._codaWait++;
		if(typeof btg == "undefined" || typeof btg.DoubleClick == "undefined" || typeof btg.DoubleClick.createAd == "undefined") {
			if($Crabapple.repo._codaWait > 60){
				$Crabapple.repo._error("gave up waiting for coda");
				return;
			}
			setTimeout($Crabapple.repo._codaCallback,250);
			$Crabapple.repo._log("waiting on coda");
			return;
		}
		$Crabapple.repo._log("coda loaded");
		$('body').trigger('codaLoaded');

		var timer = setInterval(function () {
			if(btg.DoubleClick.createdAdsQueueActive !== true) {
                $($Crabapple.repo._adsSelector).show();
				clearInterval(timer);
			}
		}, 1000);
	},
	
	_fireTracking: function(){
        if (btg.Object.isConfigDefined(btg.config.Omniture) && btg.Omniture) {
            new btg.Omniture(btg.config.Omniture);
        }
        if (btg.Object.isConfigDefined(btg.config.Nielsen) && btg.Nielsen){
        	new btg.Nielsen(btg.config.Nielsen);
        }
        if (btg.Object.isConfigDefined(btg.config.QuantCast) && btg.QuantCast) {
        	btg.ReportingManager.isScriptIncluded.quantcast=false;
            (new btg.QuantCast(btg.config.QuantCast)).sendPageCall();
        }
        if (btg.Object.isConfigDefined(btg.config.ComScore) && btg.ComScore){
        	btg.ReportingManager.isScriptIncluded.comscore=false;
        	new btg.ComScore(btg.config.ComScore);
        }
        if (btg.config.ChoiceStream && btg.config.ChoiceStream.enabled && btg.ChoiceStream) {
            new btg.ChoiceStream(btg.config.ChoiceStream);
        }
        if (btg.Object.isConfigDefined(btg.config.ChoiceStream) && btg.ChoiceStream) {
            new btg.ChoiceStream(btg.config.ChoiceStream);
        }
        if (btg.Object.isConfigDefined(btg.config.Demdex) && btg.Demdex) {
            btg.Demdex.init();
            btg.Demdex.sendIdSyncCall();
        }
	},
	
	_loadRepo: function(){
		$Crabapple.repo._log("_loadRepo called");
		$.ajax({
			dataType: "jsonp",
			url: $Crabapple.repo._repoUrl,
			jsonpCallback:'repoLoad',
			success: function(data){
				$Crabapple.repo._log("_loadRepo response");
				$Crabapple.repo._repoData = data;
				
				$Crabapple.repo._parseRepoResponse();
				
				$('body').trigger('repoLoaded');
				$Crabapple.repo.loadCoda();
			}
		});
	},
	
	loadRepoResponseFromData: function(data){
		$Crabapple.repo._repoData = data;
		$Crabapple.repo._repoUrl = '[manual repo data load]';
		$Crabapple.repo._parseRepoResponse();
	},
	
	_parseRepoResponse: function(){
		if(typeof $Crabapple.repo._repoData != "object"){
			throw $Crabapple.repo._tag+"Bad response from Repo url call: "+$Crabapple.repo._repoUrl;
		}
		
		$Crabapple.repo._configDFPP();
		
		//coda init setup must be done before coda lib is loaded
		if (typeof MTVN == "undefined") MTVN = {};
        if (typeof MTVN.config == "undefined") MTVN.config = {};
        if (typeof MTVN.config.btg == "undefined") MTVN.config.btg = {};
        if (typeof MTVN.config.btg.DoubleClick == "undefined") MTVN.config.btg.DoubleClick = {};
        if (typeof MTVN.config.btg.AdSettings == "undefined") MTVN.config.btg.AdSettings = {};
        if (typeof MTVN.config.btg.AdSettings.DoubleClick == "undefined") MTVN.config.btg.AdSettings.DoubleClick = {};
        if (typeof MTVN.config.btg.ReportSettings == "undefined") MTVN.config.btg.ReportSettings = {};
        if (typeof MTVN.config.btg.ReportSettings.Omniture == "undefined") MTVN.config.btg.ReportSettings.Omniture = {};
		
		//ensures ads are not automatically loaded on coda load
		MTVN.config.btg.DoubleClick.auto = false;
		
		$Crabapple.repo._configReporting();
		$Crabapple.repo._configAds();
		$Crabapple.repo._configWebsite();
		$Crabapple.repo._configLegacy();
		
		$Crabapple.repo._extraKeyValues = [];
		$Crabapple.repo._log("_parseRepoResponse ended");
	},
	
	loadRepo: function(){
		if($Crabapple.repo._repoUrl == false){
			throw new Error("repo init() has not been called yet");
		}
		$Crabapple.repo._log("loadRepo called");
		$.ajax({
			dataType: "jsonp",
			url: $Crabapple.repo._repoUrl,
			jsonpCallback:'repoLoad',
			success: function(data){
				$Crabapple.repo._log("loadRepo response");
				$Crabapple.repo._repoData = data;
				$Crabapple.repo._parseRepoResponse();
				$('body').trigger('repoLoaded');
			}
		});
	},
	
	_configDFPP: function(){
		$Crabapple.repo._log("_configDFPP called");
		
		//add in any extra key values
		if($Crabapple.repo._extraKeyValues) {
			for(var i in $Crabapple.repo._extraKeyValues) {
				$Crabapple.repo._repoData.doubleClick.keyValues[i] = $Crabapple.repo._extraKeyValues[i];
			}
		}
		
		window.vmn_page_data = {
			"metadata" : $Crabapple.repo._repoData.doubleClick.metadata,
		    "mappings" : {
		        "ad-unit" : $Crabapple.repo._repoData.doubleClick.adUnits,
		        "exclusion-categories" : $Crabapple.repo._repoData.doubleClick.exclusionCategories
		    },
		    "settings" : {
		    	"reload"  : $Crabapple.repo._repoData.doubleClick.adReloadable,
		        "reload_interval":    $Crabapple.repo._repoData.doubleClick.adReloadTime,
                "autoRefreshByVisibility" : true
		    }
		};
		if($Crabapple.repo._staticAds){
			window.vmn_page_data.mappings['key-values'] = $Crabapple.repo._repoData.doubleClick.keyValues;
		}
	},
	
	_configReporting: function(){
		$Crabapple.repo._log("_configReporting called");
		//Omniture Setup
		MTVN.config.btg.ReportSettings.Omniture.dynamicAccountList = $Crabapple.repo._repoData.omniture.dynamicAccountList;
		MTVN.config.btg.ReportSettings.Omniture.linkInternalFilters = $Crabapple.repo._repoData.omniture.linkInternalFilters;
		MTVN.config.btg.ReportSettings.Omniture.videoViewEventDisable = $Crabapple.repo._repoData.omniture.videoViewEventDisable;
		MTVN.config.btg.ReportSettings.Omniture.enableVisitorNamespace = $Crabapple.repo._repoData.omniture.enableVisitorNameSpace;
		MTVN.config.btg.ReportSettings.Omniture.defaultHier = $Crabapple.repo._repoData.omniture.defaultHier;
		MTVN.config.btg.ReportSettings.Omniture.dynamicAccountSelection = $Crabapple.repo._repoData.omniture.dynamicAccountSelection;
	},
	
	_configAds: function(){
		$Crabapple.repo._log("_configAds called");
		//Doubleclick Setup
		if($Crabapple.repo._staticAds){
			$Crabapple.repo._log("_configAds enabled ondemand ads");
			MTVN.config.btg.DoubleClick.onDemand = false;
		}else{
			$Crabapple.repo._log("_configAds setting doubleclick ads to be ondemand");
			MTVN.config.btg.DoubleClick.onDemand = true;
		}
		MTVN.config.btg.AdSettings.DoubleClick.auto = false;
		MTVN.config.btg.AdSettings.DoubleClick.autoDcopt = $Crabapple.repo._repoData.doubleClick.autoDcopt;
		MTVN.config.btg.AdSettings.DoubleClick.positionThreshold = $Crabapple.repo._repoData.doubleClick.positionThreshold;
		MTVN.config.btg.AdSettings.reloadableAds = $Crabapple.repo._repoData.doubleClick.adReloadable;
		MTVN.config.btg.AdSettings.reloadInterval = $Crabapple.repo._repoData.doubleClick.adReloadTime;
	},
	
	_configWebsite: function(){
		$Crabapple.repo._log("_configWebsite called");
		window.siteSectionId = $Crabapple.repo._repoData.website.videoSiteSectionId;
		window.useSurveyString = $Crabapple.repo._repoData.website.adCall1x2;
		window.adCall6x6 = false;
		$("[data-ad-sizes=1x2],[data-ad-sizes=6x6]").remove();
		//add in the 1x2 ad div if required and is missing
		if($Crabapple.repo._repoData.website.adCall1x2){
			$('body').append('<div id="survey_ad1x2" data-adsize="1x2" data-ad-sizes="1x2" data-ad-keyvalues="" data-ad-reload-interval="-1" />');
		}
		$('body').append('<div id="entrypoint_ad6x6" data-adsize="6x6" data-ad-sizes="6x6" data-ad-keyvalues="" data-ad-reload-interval="-1" />');
	},
	
	//remove once all the sites are on dfpp or we've killed off the old repo code usage
	_configLegacy: function(){
		$Crabapple.repo._log("_configLegacy called");
		window.repCallObject = { 
				pageName: $Crabapple.repo._repoData.omniture.pageName,
				channel:$Crabapple.repo._repoData.omniture.channel,
				prop8:$Crabapple.repo._repoData.omniture.values['prop8'],
				eVar6:$Crabapple.repo._repoData.omniture.values['eVar6'],
				events:"event16"
		};
		// Vars used for ad calls, reporting and, site section Id
		window.pageName = $Crabapple.repo._repoData.omniture.pageName;
		window.exclusionString = '';
		window.allKeyString = MTVN.config.btg.AdSettings.DoubleClick.keyValues;
	},
	
	trackPage: function(){
		if($Crabapple.repo._repoData == false){
			throw new Error("repo data has not been loaded yet");
		}
		$Crabapple.repo._log("trackPage called");
		//Send Reporting call
		btg.Controller.sendPageCall( $Crabapple.repo.getReportingObject() );
	},
	
	getReportingObject: function(){
		if($Crabapple.repo._repoData == false){
			throw new Error("repo data has not been loaded yet");
		}
		$Crabapple.repo._log("getReportingObject called");
		var repCallObject = { 
			pageName: $Crabapple.repo._repoData.omniture.pageName,
			channel: $Crabapple.repo._repoData.omniture.channel,
			events : 'event16'
		};
		for(var i in $Crabapple.repo._repoData.omniture.values){
			repCallObject[i] = $Crabapple.repo._repoData.omniture.values[i];
		}
		
		return repCallObject;
	},
	
	trackSharing: function(){
		if($Crabapple.repo._repoData == false){
			throw new Error("repo data has not been loaded yet");
		}
		$Crabapple.repo._log("trackSharing called");
		
		throw new Error("Not implemented yet");
	},
	
	trackModuleClick: function(){
		$Crabapple.repo._log("trackModuleClick called");
		if($Crabapple.repo._repoData == false){
			throw new Exception("repo data has not been loaded yet");
		}
		
		throw new Error("Not implemented yet");
	},
	
	doFullPageLoad: function(doStaticAds){
		$Crabapple.repo._log("doPageLoad called");
		if($Crabapple.repo._repoUrl == false){
			throw new Error("repo init() has not been called yet");
		}
		//fire off the on coda loaded event to auto load the ads and send out the page tracking
		$('body').one('codaLoaded',function(){
			$Crabapple.repo.trackPage();
			$Crabapple.repo.loadAds(doStaticAds);
		});
		$Crabapple.repo._loadRepo();
	},
	
	doFullPageLoadWithCustomAdFunc: function(func){
		$Crabapple.repo._log("doFullPageLoadWithCustomAdFunc called");
		if($Crabapple.repo._repoUrl == false){
			throw new Error("repo init() has not been called yet");
		}
		//fire off the on coda loaded event to auto load the ads and send out the page tracking
		$('body').one('codaLoaded',function(){
			if(!$Crabapple.repo._staticAds){
				btg.DoubleClick.resetSlotCounter();
			}
			$Crabapple.repo.trackPage();
			func();
		});
		$Crabapple.repo._loadRepo();
	},
	
	addKeyValue: function(key, value){
		$Crabapple.repo._extraKeyValues[key]=value;
	},
	
	loadAds: function(){
		$Crabapple.repo._log("loadAds called");
		
		$Crabapple.repo._checkAdsCanRun();
		
		if($Crabapple.repo._staticAds){
			$Crabapple.repo._log("loading all ads");
			btg.DoubleClick.createAdsFromMarkup();
		}else{
			$($Crabapple.repo._adsSelector).each(function(index, element){
				$Crabapple.repo._log("loading ad: "+index);
				$Crabapple.repo.loadSingleAd(element);
			});
		}
	},
	
	_checkAdsCanRun: function(){
		$Crabapple.repo._log("_checkAdsCanRun called");
		
		$($Crabapple.repo._adsSelector).each(function(){
			var size = $(this).attr("data-ad-sizes");
			//checking if the 1x2 can run
			//checking to make sure we actually have a valid ad size as all sizes are numbers separated by 'x'
			if( ( $Crabapple.repo._repoData.website.adCall1x2 == false && size == "1x2")
					|| null === size
					|| size.indexOf('x') == -1){
				//disable these from running
				$(this).removeAttr("data-ad-sizes");
			}
		});
	},
	
	_createAdObject: function(element) {
		//call the method to create new ad with the ad data values param and the container id param to inject the ad into
		var adData = {
			"size":$(element).attr("data-ad-sizes")
		};
		if($(element).attr("data-ad-keyvalues")) {
			adData.keyValues = $(element).attr("data-ad-keyvalues");
		}
		//add on global key values as this is needed for google when doing html5 pushstate pages
		if(typeof adData.keyValues == "undefined"){
			adData.keyValues = "";
		}
		
		for(var i in $Crabapple.repo._repoData.doubleClick.keyValues){
			adData.keyValues += ';'+i+'='+$Crabapple.repo._repoData.doubleClick.keyValues[i];
		}
		
		if($(element).attr("data-ad-reload-interval")) {
			var reloadInterval = ($(element).attr("data-ad-reload-interval")*1);
			if(parseFloat(reloadInterval) !== +reloadInterval) {
				if(reloadInterval == 0) {
					reloadInterval = -1; //apparently they don't check 0
				}
				adData.reloadInterval = reloadInterval;
			}
		}
		
		return adData;
	},
	
	loadSingleAd: function(element){
		$Crabapple.repo._log("loadSingleAd called");
		if($Crabapple.repo._repoData == false){
			throw new Error("repo data has not been loaded yet");
		}
		if(typeof element == "undefined" || !element){
			throw new Error("element does not exist that was passed to loadSingleAd");
		}
		if(null == $(element).attr("id")){
			$(element).attr('id','ad_'+Math.floor(Math.random()*1000000));
		}
		//turn off the annoying js errors from the ads
		//$(element).bind('onError',function(){return false;});
		
		var size = $(element).attr("data-ad-sizes");
        $Crabapple.repo._log("loading ad size: "+size);

        if($(element).find('div').length) {
            // dont create duplicate ads if there's already a child
            $Crabapple.repo._log("Hitting race condition, tried to load an ad into something with a child ad");
            return;
        }

		//checking if the 1x2 can run
		//checking to make sure we actually have a valid ad size as all sizes are numbers separated by 'x'
		if( ( $Crabapple.repo._repoData.website.adCall1x2 == false && size == "1x2")
				|| null === size
				|| size.indexOf('x') == -1){
			//disable these from running
			$(element).removeAttr("data-ad-sizes");
			return;
		}
		$(element).show();
	    btg.DoubleClick.createAd($Crabapple.repo._createAdObject(element), element);
	},
	
	clearAds: function() {
		$($Crabapple.repo._adsSelector).children().remove();
	},
	
	onLoad: function(func){
		$('body').one('codaLoaded',function(){
			func();
		});
	}
};
/* http://btg.mtvnservices.com/mtvn/jquery-coda/0.2.0/coda.js */
;(function($, w) {

	var version = "0.2.0";
	var logMessage = "";
	var btg;
	
	if ($.fn.coda) {    // do not redefine if the plugin is already there
		return false;
	}
	
	var log = function (str) {
		logMessage =  "CODA Plugin: " + str;

		if ( typeof console !== 'undefined' ) {
			console.log( str );
		}
	};

	var ordUtil = function(url, inc) {
		
		var re = /(\d*)\?$/;
		var ord = +url.match(re)[1];
		var new_ord = (ord/10000 + (inc || 1)) * 10000; // JS can't deal with adding one to big numbers
		var new_url = url.replace(ord, new_ord);

		return {
			"ord": ord,
			"new_ord": new_ord,
			"new_url": new_url
		};
	};
	
	var extractData = function(el, vals) {
		
		if (typeof el === "undefined") {
			return false;
		}
		
		var $el = (el.jquery)?  el : $(el);
	
		if (typeof vals === "string") {
			vals = [vals];
		}
		
		if (Object.prototype.toString.call(vals) === '[object Array]') {
			for (var i = 0; i < vals.length; i++) {
				if ($el.data(vals[i])) {
					return $el.data(vals[i]);
				}
			}		 
		}
	
		return false;
	};

	var loadElement = function(element) {
		var self = this;

		var el, sz, url, adObj, data_replace, data_zone, data_testUrl, data_addkv;

		var activateRefresh = function() {

			var rate = extractData(element, "refreshrate");
			
			if(!rate) {
				return false;

			} else {			
			
				setTimeout(function() {

					url = ordUtil(url, rate).new_url;

					el.empty();
					buildIframe();
					activateRefresh();
					
				}, rate * 1000);			
			}
		};

		var buildIframe = function(new_url) {
			
			var ad_src = new_url || url;
			
			$("<iframe />").attr({
				"scrolling": "no",
				"frameborder": "0",
				"allowtransparency": "true",
				"leftmargin": "0",
				"topmargin": "0",
				"marginwidth": "0",
				"marginheight": "0",
				"width": sz[0],
				"height": sz[1],
				"src": ad_src
			}).appendTo(element).
			bind("load", function() {
			
				el.trigger("coda:ad:load", {
					url:ad_src
				});
			
			
			});		
		};

		el = $(element);


		if (!(btg = window.btg)) {    // grab a local reference to btg
		
			el.trigger("coda:ad:load", {"error": "no CODA"} );
		
			return false;
		}
		
		if (el.css("display") === "none") { // don't put ad in an element that is display: none

			el.trigger("coda:ad:load", {"error": "hidden"} );
		
			return false;
		}

		if (el.children("iframe").length > 0) { // don't put an ad in an element that is already filled

			el.trigger("coda:ad:load", {"error": "occupied"} );

			return false;
		}
		
		adObj = {
			"contentType":"adi",
			"dw": "0", // disable the doc.write in DART mobile
			"size": extractData(el, ["sz", "adSizes"]),
			"keyValues": ""
		};

		
		// First: if we are replacing page level, set keyValues to replacekv

		data_replace = extractData(el, ["replacekv", "adKeyvalues"]);

		if (data_replace) {
			// maybe make sure it starts with a !
			adObj.keyValues = ";" + data_replace;
		} else {
			if(btg && btg.config && btg.config.DoubleClick && btg.config.DoubleClick.keyValues) {
				adObj.keyValues = btg.config.DoubleClick.keyValues;
			}
		}

		data_addkv = extractData(el, "addkv");
		if (data_addkv) {
			adObj.keyValues += ";" + data_addkv;
		}

		data_zone = extractData(el, ["zone", "adUnit"]);
		if (data_zone) {
			adObj.zoneOverride = data_zone;
		}

	
		sz = adObj.size.split("x");
		url = btg.Controller.getAdUrl(adObj);

		data_testUrl = extractData(el, "testUrl");
		if (data_testUrl) {
			url = data_testUrl;
		}

		/*
			assuming we are in dart mobile, 
				- add tp=1 to break the click out of the iframe
				- add sdh=1 to inculde a full document
		*/
		url = url.replace("&dw=0&", "&dw=0&tp=1&sdh=1&"); 

		buildIframe();
		activateRefresh();	

	};

	
	$.fn.coda = function(cmd) {
	
		if (cmd === "info") {
		
			return {
				ordUtil: ordUtil,
				version: version,
				logMessage: logMessage
			};
			
		} else {

			
			if (!window.btg) {
				log("This plugin depends on btg, CODA is not on the page.");
				return false;

			} else {

				return this.each(function() {
					loadElement(this);
				});

			}
		} 
	};
	
})(window["jQuery"], window);


/* http://relaunch.mtv-d.mtvi.com/media/config.js */
var config = {
getSiteBaseHREF : function () {return 'http://relaunch.mtv-d.mtvi.com/';},
getSiteAdViewability : function () {return '';},
getFacebookApiKey : function () {return '';},
getFacebookGraphFeedURL : function () {return '';},
getFacebookSiteName : function () {return '';},
getFacebookAppId : function () {return '';},
getRepoUrl : function () {return '';},
getRepoSiteName : function () {return '';},
getRepoVersion : function () {return '2';},
getRepoCodaUrl : function () {return 'http://btg.mtvnservices.com/aria/coda.html?site=mtv.com&Ads_DFP=1&Ads=0';},
getRepoReportingUrl : function () {return 'http://repo.comedycentral.com/feeds/websites/mtv.com/pages';},
getRepoBoxAdMobile : function () {return '1';},
getRepoBoxAdTablet : function () {return '1';},
getFluxCommunityId : function () {return 'D3FCFFFF0002D51D0002FFFFFCD3';},
getFluxBaseHref : function () {return 'http://daapi.flux.com';},
getFluxLoader : function () {return '';},
getFluxCdnMgidPrefix : function () {return 'mgid:file:fluxcdn:shared:';},
getFluxCdnServerName : function () {return 'http://filesll.fluxstatic.com';},
getFluxStaging : function () {return '';},
getTwitterKey : function () {return '0zBKOd6FJsqRehJufopNQ';},
getTwitterUserDataURL : function () {return 'http://search.twitter.com/search.json?callback=?&rpp=1&q=from%3A';},
getTwitterBaseHref : function () {return 'http://search.twitter.com/search.json';},
getTweetRiverUrl : function () {return 'http://tweetriver.com/';},
getTweetRiverFeed : function () {return '';},
getTweetRiverType : function () {return 'json';},
getMediaMissingImage : function () {return 'http://mtv.mtvnimages.com/images/lyricsmode-mtv_100x100.jpg';},
getMediaConfigParamSite : function () {return 'mtv.com';},
getTriforceScriptLoader : function () {return '/media/triforce/';},
getPlayerContentsidsVideo : function () {return 'MTV_Video_Clip';},
getPlayerContentsidsEpisode : function () {return 'MTV_Video_Episode';},
getPlayerContentsidsPlaylist : function () {return 'MTV_Video_Clip';},
getPlayerContentsidsFight : function () {return '';},
getTriforceGlobalZones : function () {return '';},
getTriforceManifestFeed : function () {return '/feeds/triforce/manifest/v5';}
};

/* http://btg.mtvnservices.com/mtvn/jquery-sm4/0.2.2/sm4.min.js */
(function(e,t){function i(e){return u="SM4 Plugin: "+e,g(document.location.search)?("undefined"!=typeof console&&console.log(u),void 0):!1}if(e.fn.sm4)return!1;var n,o,u,r=[],d={},s=1,a="0.2.2",c=!1,g=function(e){return"boolean"==typeof e?(c=e,void 0):c===!0?!0:e.match(/[\?|&]?enableWidgetsDebug=true[&]?/)},l=function(){var u=n.staging?"http://widgets4.flux-staging.com/Core":"http://widgets4.flux.com/Core",d=[];window.jQuery&&d.push("includeJquery=false"),n.FBJDK&&d.push("loadFacebookJDK=false"),g(document.location.search)&&d.push("enableWidgetsDebug=true"),d.length&&(u=u+"?"+d.join("&")),o=!0,t.Flux4=t.Flux4||{},t.Flux4.addEventListener=t.Flux4.addEventListener||function(){var e=Array.prototype.slice.call(arguments);r.push(function(){t.Flux4.addEventListener.apply(void 0,e)})},t.Flux4.eventListeners=t.Flux4.eventListeners||{},t.Flux4.eventListeners.coreInitialized&&r.push(t.Flux4.eventListeners.coreInitialized),t.Flux4.eventListeners.coreInitialized=function(){if(i("coreInitialized event"),r.length>0){for(var t=0;r.length>t;t++)r[t].call(void 0,window.Flux4);r=[]}e("*").trigger("sm4:coreLoad",[!0]),o=!1};var s=document.createElement("script"),a=document.getElementsByTagName("script")[0];s.setAttribute("id",n.ucid),s.setAttribute("widgets4Debug","true"),n.culture&&s.setAttribute("culture",n.culture),s.src=u,n.testing?n.testing({src:s.src,id:s.getAttribute("id"),widgets4Debug:s.getAttribute("widgets4Debug"),culture:s.getAttribute("culture")}):a.parentNode.insertBefore(s,a)},f=function(o){var u=e(o);u.data("_guid")||u.data("_guid",s++);var r=u.data("_guid"),a=u.data("widget"),c=u.data("contenturi");if(n.widgets[a]){var g=e.extend({},n.widgets[a].opts);c&&(g.contentUri=c,g.contentId=c),d[r]!==a+"|"+(c||s)?(d[r]=a+"|"+(c||s),u.empty(),u.one("sm4:widget:create",function(){i("creating: "+n.widgets[a].name+" with opts: "),"undefined"==typeof JSON?i(g):i(JSON.stringify(g,null,2)),g.container=o,t.Flux4.createWidget(n.widgets[a].name,g,function(e){n.widgets[a].onLoad&&n.widgets[a].onLoad(e),i(n.widgets[a].name+" success"),u.trigger("sm4:widget:load",[e,!0,n.widgets[a].name,g])})}),u.trigger("sm4:widget:create",[n.widgets[a].name,g])):(i(n.widgets[a].name+" fail"),u.trigger("sm4:widget:failed",[!1,!0,n.widgets[a].name,g]))}};e.fn.sm4=function(d){var s;return"debug"===d?{version:a,debugMode:g,logMessage:u,sm4Callbacks:r}:"function"==typeof d?(window.Flux4&&window.Flux4.createWidget?d.call(void 0,window.Flux4):r.push(d),this):d?void 0:t.MTVN&&t.MTVN.conf&&t.MTVN.conf.sm4?(n=t.MTVN.conf.sm4,n.ucid?(s=this.not(function(){return n.widgets[e(this).data("widget")]?!1:!0}),s.length&&(t.Flux4&&t.Flux4.createWidget?(e("*").trigger("sm4:coreLoad",[!0]),s.each(function(){f(this)})):(s.one("sm4:coreLoad",function(){f(this)}),o||l())),this):(i("no ucid configured"),this)):(i("no configuration"),this)}})(window.jQuery,window);
/* http://media.mtvnservices.com/player/api/2.11.7/api.min.js */
var MTVNPlayer=window.MTVNPlayer=window.MTVNPlayer||{};MTVNPlayer.version="2.11.7",MTVNPlayer.build="06/03/2014 01:58:57 PM",function(e,t){var n=e.MTVNPlayer=e.MTVNPlayer||{},r=t(e);n.require||r.extend(n)}(this,function(e){var t=e.yepnope;(function(){(function(e,t,n){function r(e){return!e||"loaded"==e||"complete"==e||"uninitialized"==e}function i(e,n,i,a,l,u){var s,c,d=t.createElement("script");a=a||f.errorTimeout,d.src=e;for(c in i)d.setAttribute(c,i[c]);n=u?o:n||m,d.onreadystatechange=d.onload=function(){!s&&r(d.readyState)&&(s=1,n(),d.onload=d.onreadystatechange=null)},p(function(){s||(s=1,n(1))},a),O(),l?d.onload():h.parentNode.insertBefore(d,h)}function a(e,t,n,r,i,a){var o,l,u,s=document.createElement("link"),c=function(){l||(l=1,s.removeAttribute("id"),setTimeout(t,0))},d="yn"+ +new Date;t=a?f.executeStack:t||function(){},r=r||f.errorTimeout,s.href=e,s.rel="stylesheet",s.type="text/css",s.id=d;for(u in n)s.setAttribute(u,n[u]);if(!i){o=document.getElementsByTagName("base")[0]||document.getElementsByTagName("script")[0],o.parentNode.insertBefore(s,o),s.onload=c;var p=function(){try{for(var e=document.styleSheets,t=0,n=e.length;n>t;t++)if(e[t].ownerNode.id==d&&e[t].cssRules.length)return c();throw Error()}catch(r){setTimeout(p,20)}};p()}}function o(){var e=g.shift();y=1,e?e.t?p(function(){("c"==e.t?f.injectCss:f.injectJs)(e.s,0,e.a,e.x,e.e,1)},0):(e(),o()):y=0}function l(e,n,i,a,l,u,s){function c(t){if(!v&&r(d.readyState)&&(E.r=v=1,!y&&o(),t)){"img"!=e&&p(function(){b.removeChild(d)},50);for(var i in I[n])I[n].hasOwnProperty(i)&&I[n][i].onload();d.onload=d.onreadystatechange=null}}s=s||f.errorTimeout;var d=t.createElement(e),v=0,m=0,E={t:i,s:n,e:l,a:u,x:s};1===I[n]&&(m=1,I[n]=[]),"object"==e?(d.data=n,d.setAttribute("type","text/css")):(d.src=n,d.type=e),d.width=d.height="0",d.onerror=d.onload=d.onreadystatechange=function(){c.call(this,m)},g.splice(a,0,E),"img"!=e&&(m||2===I[n]?(O(),b.insertBefore(d,w?null:h),p(c,s)):I[n].push(d))}function u(e,t,n,r,i){return y=0,t=t||"j",C(e)?l("c"==t?T:P,e,t,this.i++,n,r,i):(g.splice(this.i++,0,e),1==g.length&&o()),this}function s(){var e=f;return e.loader={load:u,i:0},e}var c,f,d=t.documentElement,p=e.setTimeout,h=t.getElementsByTagName("script")[0],v={}.toString,g=[],y=0,m=function(){},E="MozAppearance"in d.style,w=E&&!!t.createRange().compareNode,b=w?d:h.parentNode,A=e.opera&&"[object Opera]"==v.call(e.opera),x=!!t.attachEvent&&!A,P=E?"object":x?"script":"img",T=x?"script":P,N=Array.isArray||function(e){return"[object Array]"==v.call(e)},S=function(e){return Object(e)===e},C=function(e){return"string"==typeof e},M=function(e){return"[object Function]"==v.call(e)},O=function(){h&&h.parentNode||(h=t.getElementsByTagName("script")[0])},_=[],I={},L={timeout:function(e,t){return t.length&&(e.timeout=t[0]),e}};f=function(e){function t(e){var t,n,r,i=e.split("!"),a=_.length,o=i.pop(),l=i.length,u={url:o,origUrl:o,prefixes:i};for(n=0;l>n;n++)r=i[n].split("="),t=L[r.shift()],t&&(u=t(u,r));for(n=0;a>n;n++)u=_[n](u);return u}function r(e){var t=e.split("?")[0];return t.substr(t.lastIndexOf(".")+1)}function i(e,i,a,o,l){var u=t(e),c=u.autoCallback;return r(u.url),u.bypass?void 0:(i&&(i=M(i)?i:i[e]||i[o]||i[e.split("/").pop().split("?")[0]]),u.instead?u.instead(e,i,a,o,l):(I[u.url]&&u.reexecute!==!0?u.noexec=!0:I[u.url]=1,e&&a.load(u.url,u.forceCSS||!u.forceJS&&"css"==r(u.url)?"c":n,u.noexec,u.attrs,u.timeout),(M(i)||M(c))&&a.load(function(){s(),i&&i(u.origUrl,l,o),c&&c(u.origUrl,l,o),I[u.url]=2}),void 0))}function a(e,t){function n(e,n){if(""===e||e){if(C(e))n||(s=function(){var e=[].slice.call(arguments);c.apply(this,e),f()}),i(e,s,t,0,o);else if(S(e)){r=function(){var t,n=0;for(t in e)e.hasOwnProperty(t)&&n++;return n}();for(a in e)e.hasOwnProperty(a)&&(n||--r||(M(s)?s=function(){var e=[].slice.call(arguments);c.apply(this,e),f()}:s[a]=function(e){return function(){var t=[].slice.call(arguments);e&&e.apply(this,t),f()}}(c[a])),i(e[a],s,t,a,o))}}else!n&&f()}var r,a,o=!!e.test,l=o?e.yep:e.nope,u=e.load||e.both,s=e.callback||m,c=s,f=e.complete||m;n(l,!!u||!!e.complete),u&&n(u),!u&&!!e.complete&&n("")}var o,l,u=this.yepnope.loader;if(C(e))i(e,0,u,0);else if(N(e))for(o=0;e.length>o;o++)l=e[o],C(l)?i(l,0,u,0):N(l)?f(l):S(l)&&a(l,u);else S(e)&&a(e,u)},f.addPrefix=function(e,t){L[e]=t},f.addFilter=function(e){_.push(e)},f.errorTimeout=1e4,null==t.readyState&&t.addEventListener&&(t.readyState="loading",t.addEventListener("DOMContentLoaded",c=function(){t.removeEventListener("DOMContentLoaded",c,0),t.readyState="complete"},0)),e.yepnope=s(),e.yepnope.executeStack=o,e.yepnope.injectJs=i,e.yepnope.injectCss=a})(this,document)}).apply(e);var n=e.yepnope;e.yepnope=t;var r=function(){r.extend(this)};return r.extend=function(t){var r=function(){var e=[].slice;return{isFunction:function(e){return"function"==typeof e},isString:function(e){return"[object String]"===Object.prototype.toString.call(e)},isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},after:function(e,t){return 0>=e?t():function(){return 1>--e?t.apply(this,arguments):void 0}},extend:function(t){var n=e.call(arguments,1);for(var r in n)if(n.hasOwnProperty(r)){var i=n[r];if(i)for(var a in i)i.hasOwnProperty(a)&&(t[a]=i[a])}return t},partial:function(t){var n=e.call(arguments,1);return function(){return t.apply(this,n.concat(e.call(arguments)))}}}}(),i=!1,a={yepnope:n,"pacakge-manager-info":{version:"0.10.0",build:"Mon Jun 02 2014 14:49:50"}},o={},l={},u=[],s={},c={},f=function(e){if(r.isArray(e)){for(var t=e.length-1;t>=0;t--){var n=e[t];r.isString(n)&&(e[t]=n.toLowerCase())}return e}for(var i in e)if(e.hasOwnProperty(i)){var a=e[i];delete e[i],e[i.toLowerCase()]=a}return e},d=function(e){return-1!==e.indexOf(".css")?c[e]:!1},p=function(e,t){if(!r.isArray(e)||!t){if(r.isString(e)&&(e=e.toLowerCase()),a[e])r.isFunction(t)&&E(e,t);else{if(!r.isFunction(t))throw Error("PJS PackageManager: package "+e+" not found.");E(e,t)}return a[e]}g(f(e),t)},h=function(e){var t=[];for(var n in e)A(n)&&t.push(p(n));return t},v=function(e){var t=s[e];if(t)for(;t.length>0;){var n=t.pop();A(e)&&n(p(e))}},g=function(e,t){var n=function(){var n=[];for(var r in e)if(e.hasOwnProperty(r)){var i=e[r];n.push(a[i])}t.apply(null,n)},i=r.after(e.length,n);for(var o in e)if(e.hasOwnProperty(o)){var l=e[o];A(l)?i():p(e[o],i)}},y=function(t,n,r,i,a){if(t=t||a,!e[t])throw"mtvn-package-manager: Can't shim \""+t+'", not found in global scope.';b(a,e[t]),n?e[a]=e[t]:e[t]=o[t]},m=function(t,a){function l(e,t){s.load[t]=e,c[e]=!0,p=!0}if(i)return u.push(function(){m(t,a)}),void 0;t=f(t),i=!0;var s={load:{},callback:{},complete:function(){i=!1,a&&a.apply(null,h(t)),u.length>0&&u.shift()();for(var e in t)t.hasOwnProperty(e)&&v(e)}},p=!1;for(var g in t)if(t.hasOwnProperty(g)){var E=t[g],w=E.url||E.src||E;if(!A(g)&&!d(w)){if(E.shim){var b=E.exports||g;o[b]=e[b],s.callback[g]=r.partial(y,E.exports,E.global)}l(w,g)}E.css&&!d(E.css)&&l(E.css,g+"-css")}p?n.call({yepnope:n},s):s.complete()},E=function(e,t){if(A(e))t(p(e));else if(s[e]?s[e].push(t):s[e]=[t],l[e]){var n={};n[e]=l[e],m(n)}},w=function(e){r.extend(l,f(e))},b=function(e,t){r.isString(e)&&(e=e.toLowerCase()),t?(a[e]=t,v(e)):delete a[e]},A=function(e){return void 0!==a[e]&&null!==a[e]},x=function(e){var t=[];for(var n in a)if(a.hasOwnProperty(n)){var r=n;e||(a[n].version&&(r+=" "+a[n].version),a[n].build&&(r+=" built:"+a[n].build)),t.push(r)}return t};n.errorTimeout=18e4,r.extend(t,{require:p,provide:b,has:A,loadPackages:m,listPackages:x,configurePackages:w})},r}),function(){if(!MTVNPlayer.Player){var e=MTVNPlayer.require,t=MTVNPlayer.provide,n=window._mtvnPlayerReady=window._mtvnPlayerReady||[];MTVNPlayer.module||(MTVNPlayer.module=function(){var e={};return function(t){return e[t]?e[t]:(e[t]={},e[t])}}()),function(e){var t=e.yepnope;MTVNPlayer.noConflict=function(){e.yepnope=t}}(window),function(){(function(e){e.getSWFObject=function(){if(!window.MTVNPlayer.swfobject){var t=function(){function e(){if(!G){try{var e=R.getElementsByTagName("body")[0].appendChild(y("span"));e.parentNode.removeChild(e)}catch(t){return}G=!0;for(var n=B.length,r=0;n>r;r++)B[r]()}}function n(e){G?e():B[B.length]=e}function r(e){if(typeof k.addEventListener!=M)k.addEventListener("load",e,!1);else if(typeof R.addEventListener!=M)R.addEventListener("load",e,!1);else if(typeof k.attachEvent!=M)m(k,"onload",e);else if("function"==typeof k.onload){var t=k.onload;k.onload=function(){t(),e()}}else k.onload=e}function i(){D?a():o()}function a(){var e=R.getElementsByTagName("body")[0],t=y(O);t.setAttribute("type",L);var n=e.appendChild(t);if(n){var r=0;(function(){if(typeof n.GetVariable!=M){var i=n.GetVariable("$version");i&&(i=i.split(" ")[1].split(","),Y.pv=[parseInt(i[0],10),parseInt(i[1],10),parseInt(i[2],10)])}else if(10>r)return r++,setTimeout(arguments.callee,10),void 0;e.removeChild(t),n=null,o()})()}else o()}function o(){var e=U.length;if(e>0)for(var t=0;e>t;t++){var n=U[t].id,r=U[t].callbackFn,i={success:!1,id:n};if(Y.pv[0]>0){var a=g(n);if(a)if(!E(U[t].swfVersion)||Y.wk&&312>Y.wk)if(U[t].expressInstall&&u()){var o={};o.data=U[t].expressInstall,o.width=a.getAttribute("width")||"0",o.height=a.getAttribute("height")||"0",a.getAttribute("class")&&(o.styleclass=a.getAttribute("class")),a.getAttribute("align")&&(o.align=a.getAttribute("align"));for(var f={},d=a.getElementsByTagName("param"),p=d.length,h=0;p>h;h++)"movie"!=d[h].getAttribute("name").toLowerCase()&&(f[d[h].getAttribute("name")]=d[h].getAttribute("value"));s(o,f,n,r)}else c(a),r&&r(i);else b(n,!0),r&&(i.success=!0,i.ref=l(n),r(i))}else if(b(n,!0),r){var v=l(n);v&&typeof v.SetVariable!=M&&(i.success=!0,i.ref=v),r(i)}}}function l(e){var t=null,n=g(e);if(n&&"OBJECT"==n.nodeName)if(typeof n.SetVariable!=M)t=n;else{var r=n.getElementsByTagName(O)[0];r&&(t=r)}return t}function u(){return!W&&E("6.0.65")&&(Y.win||Y.mac)&&!(Y.wk&&312>Y.wk)}function s(e,t,n,r){W=!0,T=r||null,N={success:!1,id:n};var i=g(n);if(i){"OBJECT"==i.nodeName?(x=f(i),P=null):(x=i,P=n),e.id=j,(typeof e.width==M||!/%$/.test(e.width)&&310>parseInt(e.width,10))&&(e.width="310"),(typeof e.height==M||!/%$/.test(e.height)&&137>parseInt(e.height,10))&&(e.height="137"),R.title=R.title.slice(0,47)+" - Flash Player Installation";var a=Y.ie&&Y.win?"ActiveX":"PlugIn",o="MMredirectURL="+(""+k.location).replace(/&/g,"%26")+"&MMplayerType="+a+"&MMdoctitle="+R.title;if(typeof t.flashvars!=M?t.flashvars+="&"+o:t.flashvars=o,Y.ie&&Y.win&&4!=i.readyState){var l=y("div");n+="SWFObjectNew",l.setAttribute("id",n),i.parentNode.insertBefore(l,i),i.style.display="none",function(){4==i.readyState?i.parentNode.removeChild(i):setTimeout(arguments.callee,10)}()}d(e,t,n)}}function c(e){if(Y.ie&&Y.win&&4!=e.readyState){var t=y("div");e.parentNode.insertBefore(t,e),t.parentNode.replaceChild(f(e),t),e.style.display="none",function(){4==e.readyState?e.parentNode.removeChild(e):setTimeout(arguments.callee,10)}()}else e.parentNode.replaceChild(f(e),e)}function f(e){var t=y("div");if(Y.win&&Y.ie)t.innerHTML=e.innerHTML;else{var n=e.getElementsByTagName(O)[0];if(n){var r=n.childNodes;if(r)for(var i=r.length,a=0;i>a;a++)1==r[a].nodeType&&"PARAM"==r[a].nodeName||8==r[a].nodeType||t.appendChild(r[a].cloneNode(!0))}}return t}function d(e,t,n){var r,i=g(n);if(Y.wk&&312>Y.wk)return r;if(i)if(typeof e.id==M&&(e.id=n),Y.ie&&Y.win){var a="";for(var o in e)e[o]!=Object.prototype[o]&&("data"==o.toLowerCase()?t.movie=e[o]:"styleclass"==o.toLowerCase()?a+=' class="'+e[o]+'"':"classid"!=o.toLowerCase()&&(a+=" "+o+'="'+e[o]+'"'));var l="";for(var u in t)t[u]!=Object.prototype[u]&&(l+='<param name="'+u+'" value="'+t[u]+'" />');i.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+a+">"+l+"</object>",H[H.length]=e.id,r=g(e.id)}else{var s=y(O);s.setAttribute("type",L);for(var c in e)e[c]!=Object.prototype[c]&&("styleclass"==c.toLowerCase()?s.setAttribute("class",e[c]):"classid"!=c.toLowerCase()&&s.setAttribute(c,e[c]));for(var f in t)t[f]!=Object.prototype[f]&&"movie"!=f.toLowerCase()&&p(s,f,t[f]);i.parentNode.replaceChild(s,i),r=s}return r}function p(e,t,n){var r=y("param");r.setAttribute("name",t),r.setAttribute("value",n),e.appendChild(r)}function h(e){var t=g(e);t&&"OBJECT"==t.nodeName&&(Y.ie&&Y.win?(t.style.display="none",function(){4==t.readyState?v(e):setTimeout(arguments.callee,10)}()):t.parentNode.removeChild(t))}function v(e){var t=g(e);if(t){for(var n in t)"function"==typeof t[n]&&(t[n]=null);t.parentNode.removeChild(t)}}function g(e){var t=null;try{t=R.getElementById(e)}catch(n){}return t}function y(e){return R.createElement(e)}function m(e,t,n){e.attachEvent(t,n),$[$.length]=[e,t,n]}function E(e){var t=Y.pv,n=e.split(".");return n[0]=parseInt(n[0],10),n[1]=parseInt(n[1],10)||0,n[2]=parseInt(n[2],10)||0,t[0]>n[0]||t[0]==n[0]&&t[1]>n[1]||t[0]==n[0]&&t[1]==n[1]&&t[2]>=n[2]?!0:!1}function w(e,t,n,r){if(!Y.ie||!Y.mac){var i=R.getElementsByTagName("head")[0];if(i){var a=n&&"string"==typeof n?n:"screen";if(r&&(S=null,C=null),!S||C!=a){var o=y("style");o.setAttribute("type","text/css"),o.setAttribute("media",a),S=i.appendChild(o),Y.ie&&Y.win&&typeof R.styleSheets!=M&&R.styleSheets.length>0&&(S=R.styleSheets[R.styleSheets.length-1]),C=a}Y.ie&&Y.win?S&&typeof S.addRule==O&&S.addRule(e,t):S&&typeof R.createTextNode!=M&&S.appendChild(R.createTextNode(e+" {"+t+"}"))}}}function b(e,t){if(z){var n=t?"visible":"hidden";G&&g(e)?g(e).style.visibility=n:w("#"+e,"visibility:"+n)}}function A(e){var t=/[\\\"<>\.;]/,n=null!=t.exec(e);return n&&typeof encodeURIComponent!=M?encodeURIComponent(e):e}var x,P,T,N,S,C,M="undefined",O="object",_="Shockwave Flash",I="ShockwaveFlash.ShockwaveFlash",L="application/x-shockwave-flash",j="SWFObjectExprInst",F="onreadystatechange",k=window,R=document,V=navigator,D=!1,B=[i],U=[],H=[],$=[],G=!1,W=!1,z=!0,Y=function(){var e=typeof R.getElementById!=M&&typeof R.getElementsByTagName!=M&&typeof R.createElement!=M,t=V.userAgent.toLowerCase(),n=V.platform.toLowerCase(),r=n?/win/.test(n):/win/.test(t),i=n?/mac/.test(n):/mac/.test(t),a=/webkit/.test(t)?parseFloat(t.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,o=!1,l=[0,0,0],u=null;if(typeof V.plugins!=M&&typeof V.plugins[_]==O)u=V.plugins[_].description,!u||typeof V.mimeTypes!=M&&V.mimeTypes[L]&&!V.mimeTypes[L].enabledPlugin||(D=!0,o=!1,u=u.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),l[0]=parseInt(u.replace(/^(.*)\..*$/,"$1"),10),l[1]=parseInt(u.replace(/^.*\.(.*)\s.*$/,"$1"),10),l[2]=/[a-zA-Z]/.test(u)?parseInt(u.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if(typeof k.ActiveXObject!=M)try{var s=new ActiveXObject(I);s&&(u=s.GetVariable("$version"),u&&(o=!0,u=u.split(" ")[1].split(","),l=[parseInt(u[0],10),parseInt(u[1],10),parseInt(u[2],10)]))}catch(c){}return{w3:e,pv:l,wk:a,ie:o,win:r,mac:i}}();return function(){Y.w3&&((typeof R.readyState!=M&&"complete"==R.readyState||typeof R.readyState==M&&(R.getElementsByTagName("body")[0]||R.body))&&e(),G||(typeof R.addEventListener!=M&&R.addEventListener("DOMContentLoaded",e,!1),Y.ie&&Y.win&&(R.attachEvent(F,function(){"complete"==R.readyState&&(R.detachEvent(F,arguments.callee),e())}),k==top&&function(){if(!G){try{R.documentElement.doScroll("left")}catch(t){return setTimeout(arguments.callee,0),void 0}e()}}()),Y.wk&&function(){return G?void 0:/loaded|complete/.test(R.readyState)?(e(),void 0):(setTimeout(arguments.callee,0),void 0)}(),r(e)))}(),function(){Y.ie&&Y.win&&window.attachEvent("onunload",function(){for(var e=$.length,n=0;e>n;n++)$[n][0].detachEvent($[n][1],$[n][2]);for(var r=H.length,i=0;r>i;i++)h(H[i]);for(var a in Y)Y[a]=null;Y=null;for(var o in t)t[o]=null;t=null})}(),{registerObject:function(e,t,n,r){if(Y.w3&&e&&t){var i={};i.id=e,i.swfVersion=t,i.expressInstall=n,i.callbackFn=r,U[U.length]=i,b(e,!1)}else r&&r({success:!1,id:e})},getObjectById:function(e){return Y.w3?l(e):void 0},embedSWF:function(e,t,r,i,a,o,l,c,f,p){var h={success:!1,id:t};Y.w3&&!(Y.wk&&312>Y.wk)&&e&&t&&r&&i&&a?(b(t,!1),n(function(){r+="",i+="";var n={};if(f&&typeof f===O)for(var v in f)n[v]=f[v];n.data=e,n.width=r,n.height=i;var g={};if(c&&typeof c===O)for(var y in c)g[y]=c[y];if(l&&typeof l===O)for(var m in l)typeof g.flashvars!=M?g.flashvars+="&"+m+"="+l[m]:g.flashvars=m+"="+l[m];if(E(a)){var w=d(n,g,t);n.id==t&&b(t,!0),h.success=!0,h.ref=w}else{if(o&&u())return n.data=o,s(n,g,t,p),void 0;b(t,!0)}p&&p(h)})):p&&p(h)},switchOffAutoHideShow:function(){z=!1},ua:Y,getFlashPlayerVersion:function(){return{major:Y.pv[0],minor:Y.pv[1],release:Y.pv[2]}},hasFlashPlayerVersion:E,createSWF:function(e,t,n){return Y.w3?d(e,t,n):void 0},showExpressInstall:function(e,t,n,r){Y.w3&&u()&&s(e,t,n,r)},removeSWF:function(e){Y.w3&&h(e)},createCSS:function(e,t,n,r){Y.w3&&w(e,t,n,r)},addDomLoadEvent:n,addLoadEvent:r,getQueryParamValue:function(e){var t=R.location.search||R.location.hash;if(t){if(/\?/.test(t)&&(t=t.split("?")[1]),null==e)return A(t);for(var n=t.split("&"),r=0;n.length>r;r++)if(n[r].substring(0,n[r].indexOf("="))==e)return A(n[r].substring(n[r].indexOf("=")+1))}return""},expressInstallCallback:function(){if(W){var e=g(j);e&&x&&(e.parentNode.replaceChild(x,e),P&&(b(P,!0),Y.ie&&Y.win&&(x.style.display="block")),T&&T(N)),W=!1}}}}();return e.getSWFObject=function(){return t},t}}})(window.MTVNPlayer.module("swfobject"))}.apply(window),function(){(function(){var e=this,t=e._,n={},r=Array.prototype,i=Object.prototype,a=Function.prototype,o=r.push,l=r.slice,u=r.concat,s=i.toString,c=i.hasOwnProperty,f=r.forEach,d=r.map,p=r.reduce,h=r.reduceRight,v=r.filter,g=r.every,y=r.some,m=r.indexOf,E=r.lastIndexOf,w=Array.isArray,b=Object.keys,A=a.bind,x=function(e){return e instanceof x?e:this instanceof x?(this._wrapped=e,void 0):new x(e)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=x),exports._=x):e._=x,x.VERSION="1.5.1";var P=x.each=x.forEach=function(e,t,r){if(null!=e)if(f&&e.forEach===f)e.forEach(t,r);else if(e.length===+e.length){for(var i=0,a=e.length;a>i;i++)if(t.call(r,e[i],i,e)===n)return}else for(var o in e)if(x.has(e,o)&&t.call(r,e[o],o,e)===n)return};x.map=x.collect=function(e,t,n){var r=[];return null==e?r:d&&e.map===d?e.map(t,n):(P(e,function(e,i,a){r.push(t.call(n,e,i,a))}),r)};var T="Reduce of empty array with no initial value";x.reduce=x.foldl=x.inject=function(e,t,n,r){var i=arguments.length>2;if(null==e&&(e=[]),p&&e.reduce===p)return r&&(t=x.bind(t,r)),i?e.reduce(t,n):e.reduce(t);if(P(e,function(e,a,o){i?n=t.call(r,n,e,a,o):(n=e,i=!0)}),!i)throw new TypeError(T);return n},x.reduceRight=x.foldr=function(e,t,n,r){var i=arguments.length>2;if(null==e&&(e=[]),h&&e.reduceRight===h)return r&&(t=x.bind(t,r)),i?e.reduceRight(t,n):e.reduceRight(t);var a=e.length;if(a!==+a){var o=x.keys(e);a=o.length}if(P(e,function(l,u,s){u=o?o[--a]:--a,i?n=t.call(r,n,e[u],u,s):(n=e[u],i=!0)}),!i)throw new TypeError(T);return n},x.find=x.detect=function(e,t,n){var r;return N(e,function(e,i,a){return t.call(n,e,i,a)?(r=e,!0):void 0}),r},x.filter=x.select=function(e,t,n){var r=[];return null==e?r:v&&e.filter===v?e.filter(t,n):(P(e,function(e,i,a){t.call(n,e,i,a)&&r.push(e)}),r)},x.reject=function(e,t,n){return x.filter(e,function(e,r,i){return!t.call(n,e,r,i)},n)},x.every=x.all=function(e,t,r){t||(t=x.identity);var i=!0;return null==e?i:g&&e.every===g?e.every(t,r):(P(e,function(e,a,o){return(i=i&&t.call(r,e,a,o))?void 0:n}),!!i)};var N=x.some=x.any=function(e,t,r){t||(t=x.identity);var i=!1;return null==e?i:y&&e.some===y?e.some(t,r):(P(e,function(e,a,o){return i||(i=t.call(r,e,a,o))?n:void 0}),!!i)};x.contains=x.include=function(e,t){return null==e?!1:m&&e.indexOf===m?-1!=e.indexOf(t):N(e,function(e){return e===t})},x.invoke=function(e,t){var n=l.call(arguments,2),r=x.isFunction(t);return x.map(e,function(e){return(r?t:e[t]).apply(e,n)})},x.pluck=function(e,t){return x.map(e,function(e){return e[t]})},x.where=function(e,t,n){return x.isEmpty(t)?n?void 0:[]:x[n?"find":"filter"](e,function(e){for(var n in t)if(t[n]!==e[n])return!1;return!0})},x.findWhere=function(e,t){return x.where(e,t,!0)},x.max=function(e,t,n){if(!t&&x.isArray(e)&&e[0]===+e[0]&&65535>e.length)return Math.max.apply(Math,e);if(!t&&x.isEmpty(e))return-1/0;var r={computed:-1/0,value:-1/0};return P(e,function(e,i,a){var o=t?t.call(n,e,i,a):e;o>r.computed&&(r={value:e,computed:o})}),r.value},x.min=function(e,t,n){if(!t&&x.isArray(e)&&e[0]===+e[0]&&65535>e.length)return Math.min.apply(Math,e);if(!t&&x.isEmpty(e))return 1/0;var r={computed:1/0,value:1/0};return P(e,function(e,i,a){var o=t?t.call(n,e,i,a):e;r.computed>o&&(r={value:e,computed:o})}),r.value},x.shuffle=function(e){var t,n=0,r=[];return P(e,function(e){t=x.random(n++),r[n-1]=r[t],r[t]=e}),r};var S=function(e){return x.isFunction(e)?e:function(t){return t[e]}};x.sortBy=function(e,t,n){var r=S(t);return x.pluck(x.map(e,function(e,t,i){return{value:e,index:t,criteria:r.call(n,e,t,i)}}).sort(function(e,t){var n=e.criteria,r=t.criteria;if(n!==r){if(n>r||void 0===n)return 1;if(r>n||void 0===r)return-1}return e.index<t.index?-1:1}),"value")};var C=function(e,t,n,r){var i={},a=S(null==t?x.identity:t);return P(e,function(t,o){var l=a.call(n,t,o,e);r(i,l,t)}),i};x.groupBy=function(e,t,n){return C(e,t,n,function(e,t,n){(x.has(e,t)?e[t]:e[t]=[]).push(n)})},x.countBy=function(e,t,n){return C(e,t,n,function(e,t){x.has(e,t)||(e[t]=0),e[t]++})},x.sortedIndex=function(e,t,n,r){n=null==n?x.identity:S(n);for(var i=n.call(r,t),a=0,o=e.length;o>a;){var l=a+o>>>1;i>n.call(r,e[l])?a=l+1:o=l}return a},x.toArray=function(e){return e?x.isArray(e)?l.call(e):e.length===+e.length?x.map(e,x.identity):x.values(e):[]},x.size=function(e){return null==e?0:e.length===+e.length?e.length:x.keys(e).length},x.first=x.head=x.take=function(e,t,n){return null==e?void 0:null==t||n?e[0]:l.call(e,0,t)},x.initial=function(e,t,n){return l.call(e,0,e.length-(null==t||n?1:t))},x.last=function(e,t,n){return null==e?void 0:null==t||n?e[e.length-1]:l.call(e,Math.max(e.length-t,0))},x.rest=x.tail=x.drop=function(e,t,n){return l.call(e,null==t||n?1:t)},x.compact=function(e){return x.filter(e,x.identity)};var M=function(e,t,n){return t&&x.every(e,x.isArray)?u.apply(n,e):(P(e,function(e){x.isArray(e)||x.isArguments(e)?t?o.apply(n,e):M(e,t,n):n.push(e)}),n)};x.flatten=function(e,t){return M(e,t,[])},x.without=function(e){return x.difference(e,l.call(arguments,1))},x.uniq=x.unique=function(e,t,n,r){x.isFunction(t)&&(r=n,n=t,t=!1);var i=n?x.map(e,n,r):e,a=[],o=[];return P(i,function(n,r){(t?r&&o[o.length-1]===n:x.contains(o,n))||(o.push(n),a.push(e[r]))}),a},x.union=function(){return x.uniq(x.flatten(arguments,!0))},x.intersection=function(e){var t=l.call(arguments,1);return x.filter(x.uniq(e),function(e){return x.every(t,function(t){return x.indexOf(t,e)>=0})})},x.difference=function(e){var t=u.apply(r,l.call(arguments,1));return x.filter(e,function(e){return!x.contains(t,e)})},x.zip=function(){for(var e=x.max(x.pluck(arguments,"length").concat(0)),t=Array(e),n=0;e>n;n++)t[n]=x.pluck(arguments,""+n);return t},x.object=function(e,t){if(null==e)return{};for(var n={},r=0,i=e.length;i>r;r++)t?n[e[r]]=t[r]:n[e[r][0]]=e[r][1];return n},x.indexOf=function(e,t,n){if(null==e)return-1;var r=0,i=e.length;if(n){if("number"!=typeof n)return r=x.sortedIndex(e,t),e[r]===t?r:-1;r=0>n?Math.max(0,i+n):n}if(m&&e.indexOf===m)return e.indexOf(t,n);for(;i>r;r++)if(e[r]===t)return r;return-1},x.lastIndexOf=function(e,t,n){if(null==e)return-1;var r=null!=n;if(E&&e.lastIndexOf===E)return r?e.lastIndexOf(t,n):e.lastIndexOf(t);for(var i=r?n:e.length;i--;)if(e[i]===t)return i;return-1},x.range=function(e,t,n){1>=arguments.length&&(t=e||0,e=0),n=arguments[2]||1;for(var r=Math.max(Math.ceil((t-e)/n),0),i=0,a=Array(r);r>i;)a[i++]=e,e+=n;return a};var O=function(){};x.bind=function(e,t){var n,r;if(A&&e.bind===A)return A.apply(e,l.call(arguments,1));if(!x.isFunction(e))throw new TypeError;return n=l.call(arguments,2),r=function(){if(!(this instanceof r))return e.apply(t,n.concat(l.call(arguments)));O.prototype=e.prototype;var i=new O;O.prototype=null;var a=e.apply(i,n.concat(l.call(arguments)));return Object(a)===a?a:i}},x.partial=function(e){var t=l.call(arguments,1);return function(){return e.apply(this,t.concat(l.call(arguments)))}},x.bindAll=function(e){var t=l.call(arguments,1);if(0===t.length)throw Error("bindAll must be passed function names");return P(t,function(t){e[t]=x.bind(e[t],e)}),e},x.memoize=function(e,t){var n={};return t||(t=x.identity),function(){var r=t.apply(this,arguments);return x.has(n,r)?n[r]:n[r]=e.apply(this,arguments)}},x.delay=function(e,t){var n=l.call(arguments,2);return setTimeout(function(){return e.apply(null,n)},t)},x.defer=function(e){return x.delay.apply(x,[e,1].concat(l.call(arguments,1)))},x.throttle=function(e,t,n){var r,i,a,o=null,l=0;n||(n={});var u=function(){l=n.leading===!1?0:new Date,o=null,a=e.apply(r,i)};return function(){var s=new Date;l||n.leading!==!1||(l=s);var c=t-(s-l);return r=this,i=arguments,0>=c?(clearTimeout(o),o=null,l=s,a=e.apply(r,i)):o||n.trailing===!1||(o=setTimeout(u,c)),a}},x.debounce=function(e,t,n){var r,i=null;return function(){var a=this,o=arguments,l=function(){i=null,n||(r=e.apply(a,o))},u=n&&!i;return clearTimeout(i),i=setTimeout(l,t),u&&(r=e.apply(a,o)),r}},x.once=function(e){var t,n=!1;return function(){return n?t:(n=!0,t=e.apply(this,arguments),e=null,t)}},x.wrap=function(e,t){return function(){var n=[e];return o.apply(n,arguments),t.apply(this,n)}},x.compose=function(){var e=arguments;return function(){for(var t=arguments,n=e.length-1;n>=0;n--)t=[e[n].apply(this,t)];return t[0]}},x.after=function(e,t){return function(){return 1>--e?t.apply(this,arguments):void 0}},x.keys=b||function(e){if(e!==Object(e))throw new TypeError("Invalid object");var t=[];for(var n in e)x.has(e,n)&&t.push(n);return t},x.values=function(e){var t=[];for(var n in e)x.has(e,n)&&t.push(e[n]);return t},x.pairs=function(e){var t=[];for(var n in e)x.has(e,n)&&t.push([n,e[n]]);return t},x.invert=function(e){var t={};for(var n in e)x.has(e,n)&&(t[e[n]]=n);return t},x.functions=x.methods=function(e){var t=[];for(var n in e)x.isFunction(e[n])&&t.push(n);return t.sort()},x.extend=function(e){return P(l.call(arguments,1),function(t){if(t)for(var n in t)e[n]=t[n]}),e},x.pick=function(e){var t={},n=u.apply(r,l.call(arguments,1));return P(n,function(n){n in e&&(t[n]=e[n])}),t},x.omit=function(e){var t={},n=u.apply(r,l.call(arguments,1));for(var i in e)x.contains(n,i)||(t[i]=e[i]);return t},x.defaults=function(e){return P(l.call(arguments,1),function(t){if(t)for(var n in t)void 0===e[n]&&(e[n]=t[n])}),e},x.clone=function(e){return x.isObject(e)?x.isArray(e)?e.slice():x.extend({},e):e},x.tap=function(e,t){return t(e),e};var _=function(e,t,n,r){if(e===t)return 0!==e||1/e==1/t;if(null==e||null==t)return e===t;e instanceof x&&(e=e._wrapped),t instanceof x&&(t=t._wrapped);var i=s.call(e);if(i!=s.call(t))return!1;switch(i){case"[object String]":return e==t+"";case"[object Number]":return e!=+e?t!=+t:0==e?1/e==1/t:e==+t;case"[object Date]":case"[object Boolean]":return+e==+t;case"[object RegExp]":return e.source==t.source&&e.global==t.global&&e.multiline==t.multiline&&e.ignoreCase==t.ignoreCase}if("object"!=typeof e||"object"!=typeof t)return!1;for(var a=n.length;a--;)if(n[a]==e)return r[a]==t;var o=e.constructor,l=t.constructor;if(o!==l&&!(x.isFunction(o)&&o instanceof o&&x.isFunction(l)&&l instanceof l))return!1;n.push(e),r.push(t);var u=0,c=!0;if("[object Array]"==i){if(u=e.length,c=u==t.length)for(;u--&&(c=_(e[u],t[u],n,r)););}else{for(var f in e)if(x.has(e,f)&&(u++,!(c=x.has(t,f)&&_(e[f],t[f],n,r))))break;if(c){for(f in t)if(x.has(t,f)&&!u--)break;c=!u}}return n.pop(),r.pop(),c};x.isEqual=function(e,t){return _(e,t,[],[])},x.isEmpty=function(e){if(null==e)return!0;if(x.isArray(e)||x.isString(e))return 0===e.length;for(var t in e)if(x.has(e,t))return!1;return!0},x.isElement=function(e){return!(!e||1!==e.nodeType)},x.isArray=w||function(e){return"[object Array]"==s.call(e)},x.isObject=function(e){return e===Object(e)},P(["Arguments","Function","String","Number","Date","RegExp"],function(e){x["is"+e]=function(t){return s.call(t)=="[object "+e+"]"}}),x.isArguments(arguments)||(x.isArguments=function(e){return!(!e||!x.has(e,"callee"))}),x.isFunction=function(e){return"function"==typeof e},x.isFinite=function(e){return isFinite(e)&&!isNaN(parseFloat(e))},x.isNaN=function(e){return x.isNumber(e)&&e!=+e},x.isBoolean=function(e){return e===!0||e===!1||"[object Boolean]"==s.call(e)},x.isNull=function(e){return null===e},x.isUndefined=function(e){return void 0===e},x.has=function(e,t){return c.call(e,t)},x.noConflict=function(){return e._=t,this},x.identity=function(e){return e},x.times=function(e,t,n){for(var r=Array(Math.max(0,e)),i=0;e>i;i++)r[i]=t.call(n,i);return r},x.random=function(e,t){return null==t&&(t=e,e=0),e+Math.floor(Math.random()*(t-e+1))};var I={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};I.unescape=x.invert(I.escape);var L={escape:RegExp("["+x.keys(I.escape).join("")+"]","g"),unescape:RegExp("("+x.keys(I.unescape).join("|")+")","g")};x.each(["escape","unescape"],function(e){x[e]=function(t){return null==t?"":(""+t).replace(L[e],function(t){return I[e][t]})}}),x.result=function(e,t){if(null==e)return void 0;var n=e[t];return x.isFunction(n)?n.call(e):n},x.mixin=function(e){P(x.functions(e),function(t){var n=x[t]=e[t];x.prototype[t]=function(){var e=[this._wrapped];return o.apply(e,arguments),V.call(this,n.apply(x,e))}})};var j=0;x.uniqueId=function(e){var t=++j+"";return e?e+t:t},x.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var F=/(.)^/,k={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},R=/\\|'|\r|\n|\t|\u2028|\u2029/g;x.template=function(e,t,n){var r;n=x.defaults({},n,x.templateSettings);var i=RegExp([(n.escape||F).source,(n.interpolate||F).source,(n.evaluate||F).source].join("|")+"|$","g"),a=0,o="__p+='";e.replace(i,function(t,n,r,i,l){return o+=e.slice(a,l).replace(R,function(e){return"\\"+k[e]}),n&&(o+="'+\n((__t=("+n+"))==null?'':_.escape(__t))+\n'"),r&&(o+="'+\n((__t=("+r+"))==null?'':__t)+\n'"),i&&(o+="';\n"+i+"\n__p+='"),a=l+t.length,t}),o+="';\n",n.variable||(o="with(obj||{}){\n"+o+"}\n"),o="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+o+"return __p;\n";try{r=Function(n.variable||"obj","_",o)}catch(l){throw l.source=o,l}if(t)return r(t,x);var u=function(e){return r.call(this,e,x)};return u.source="function("+(n.variable||"obj")+"){\n"+o+"}",u},x.chain=function(e){return x(e).chain()};var V=function(e){return this._chain?x(e).chain():e};x.mixin(x),P(["pop","push","reverse","shift","sort","splice","unshift"],function(e){var t=r[e];x.prototype[e]=function(){var n=this._wrapped;return t.apply(n,arguments),"shift"!=e&&"splice"!=e||0!==n.length||delete n[0],V.call(this,n)}}),P(["concat","join","slice"],function(e){var t=r[e];x.prototype[e]=function(){return V.call(this,t.apply(this._wrapped,arguments))}}),x.extend(x.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this),t("_",this._)}.apply({}),function(r,i){"use strict";var a=e("_"),o=function(e,t){var i="http://media.mtvnservices.com/",o=[],l=function(e){return"uiStateChange"===e?"onUIStateChange":"on"+e.charAt(0).toUpperCase()+e.substr(1)};return e.instances=[],e.baseURL=i,e.onPlayerCallbacks=o,e.$=t,e.playerInit=function(e,t){var n=[];e.module=function(){var e={};return function(t){return e[t]?e[t]:(e[t]={},e[t])}}(),e.destroy=function(){t.destroy.apply(this,arguments)},e.message=function(){return this.ready?t.message.apply(this,arguments):(n.push(arguments),void 0)},e.one("ready",function(e){for(var t=e.target,r=t.message,i=0,a=n.length;a>i;i++)r.apply(t,n[i])})},e.isHTML5Player=function(e){var t=e?e.toLowerCase():"",n=function(e){if(-1!==e.indexOf("silk")){var t=/silk\/(\d)/gi,n=parseInt(t.exec(e)[1],10);return!isNaN(n)&&n>=2}return!1},r=function(e){if(-1!==e.indexOf("android")){if(-1!==e.indexOf("firefox"))return!0;var t=/android (\d)/gi,n=parseInt(t.exec(e)[1],10);
return!isNaN(n)&&n>=4}return!1},i=function(e){return-1!==e.indexOf("wiiu")},a=function(e){return-1!==e.indexOf("playstation 4")};return-1!==t.indexOf("iphone")||-1!==t.indexOf("ipad")||n(t)||r(t)||i(t)||a(t)},e.appendStyle=function(e){var t=document.createElement("style");t.setAttribute("type","text/css"),document.getElementsByTagName("head")[0].appendChild(t),t.styleSheet?t.styleSheet.cssText=e:t.appendChild(document.createTextNode(e))},e.getPath=function(t){var n=i+t.uri;return t.templateURL&&(n=t.templateURL.replace("{uri}",t.uri)),r.isHTML5Player&&(n=e.processQSParams(n,t)),n},e.processQSParams=function(e,t){return a.isObject(t.flashVars)&&(e=u.addQueryStringParam(e,"flashVars",encodeURIComponent(JSON.stringify(t.flashVars)))),a.isObject(t.test)&&(e=u.addQueryStringParam(e,"testConfig",encodeURIComponent(JSON.stringify(t.test)))),e},e.processPerformance=function(t,n){var i=t.config.performance.startTime,a=r.Events.PERFORMANCE;for(var o in n)n[o]=n[o]-i;e.processEvent(t.events[a],{data:n,target:t,type:a})},e.processEvent=function(e,t){if(t&&t.target&&t.target.$el&&(t.target.$el.trigger("MTVNPlayer:"+t.type,t),t.target.$el.trigger("MTVNPlayer:"+l(t.type),t)),e)if(e instanceof Array){e=e.slice();for(var n=0,r=e.length;r>n;n++)e[n](t)}else e(t)},e.executeCallbacks=function(e){var t=o.concat(n).slice(),r=0,i=t.length;for(r;i>r;r++)t[r](e)},e}(window.MTVNPlayer.module("core"),window.jQuery||window.Zepto),l=r.module("config");l.copyEvents=function(e,t){var n,r;if(t)for(var i in t)t.hasOwnProperty(i)&&(n=t[i],(a.isFunction(n)||a.isArray(n))&&(r=e[i],r?a.isArray(r)?a.isArray(n)?e[i]=r.concat(n):r.push(n):e[i]=a.isArray(n)?[r].concat(n):[r,n]:e[i]=n));return e},l.copyProperties=function(e,t,n){function r(e){return void 0!==e&&null!==e}if(t)for(var i in t)if(t.hasOwnProperty(i)&&r(t[i])){var a=i.toLowerCase();if("flashvars"===a||"attributes"===a||"params"===a)e[i]=e[i]||{},l.copyProperties(e[i],t[i],n);else{if(("width"===i||"height"===i)&&!t[i])continue;if(!n&&r(e[i]))continue;e[i]=t[i]}}return e},l.needsScrollToForFullScreen=function(e){var t=/OS (\d*)/gi,n=t.exec(e);if(!a.isEmpty(n)){var r=parseInt(n[1],10);if(!isNaN(r)&&4>=r)return!0}return!1},l.versionIsMinimum=function(e,t){function n(t){return-1!==t.indexOf("-")?t.slice(0,e.indexOf("-")):t}if(e&&t){if(e=n(e),t=n(t),e===t)return!0;e=e.split("."),t=t.split(".");for(var r=0,i=t.length;i>r;r++){var a=parseInt(e[r],10),o=parseInt(t[r],10);if(a=isNaN(a)?0:a,o=isNaN(o)?0:o,a!=o)return o>a}}},l.provideJQuery=function(){if(!r.has("$")){var e=window.jQuery;e&&l.versionIsMinimum("1.9.0",e.fn.jquery)&&t("$",e)}},l.buildConfig=function(e,t){t=l.copyProperties(t,window.MTVNPlayer.defaultConfig),t=l.copyProperties(t,{width:640,height:360});var n=function(t){return e.getAttribute("data-"+t)},r=function(t){return parseInt(e.style[t],10)},i=function(e){if(e=n(e)){var t,r,i={},a=e.split("&");for(t=a.length;t--;)r=a[t].split("="),r&&2==r.length&&(i[r[0]]=r[1]);return i}},a=function(e){var t,r,i,a=["autoPlay","sid","ssid"];for(t=a.length;t--;)i=a[t],r=n(i),r&&(e||(e={}),e[i]=r);return e},o={uri:n("contenturi"),width:r("width")||null,height:r("height")||null,flashVars:a(i("flashVars")),attributes:i("attributes")};return l.copyProperties(t,o,!0)},function(e,t){var n=null;e.find=function(t){return e.initialize(),n(t)},e.initialize=function(){e.initialize=function(){};var r,i,a,o,l,u,s={},c=/^\s+|\s+$/g,f=!!t.querySelectorAll,d=function(e,t,n){if(r=n||[],l=t||d.context,f)try{return m(l.querySelectorAll(e)),r}catch(i){}return u=l.ownerDocument||l,v(e.replace(c,"")),h(),r},p=function(e){if(i.tag){var t=e.nodeName.toUpperCase();if("*"==i.tag){if("@">t)return!1}else if(t!=i.tag)return!1}if(i.id&&e.getAttribute("id")!=i.id)return!1;if(a=i.classes)for(var n=" "+e.className+" ",r=a.length;r--;)if(0>n.indexOf(" "+a[r]+" "))return!1;if(o=i.pseudos)for(var l=o.length;l--;){var u=s[o[l]];if(!u||!u.call(d,e))return!1}return!0},h=function(){var e=i.id,t=e&&i.tag||i.classes||i.pseudos||!e&&(i.classes||i.pseudos)?b:E;if(e){var n=u.getElementById(e);n&&(u===l||A(n))&&t([n])}else t(l.getElementsByTagName(i.tag||"*"))},v=function(e){for(i={};e=e.replace(/([#.:])?([^#.:]*)/,g););},g=function(e,t,n){return t?"#"==t?i.id=n:"."==t?i.classes?i.classes.push(n):i.classes=[n]:":"==t&&(i.pseudos?i.pseudos.push(n):i.pseudos=[n]):i.tag=n.toUpperCase(),""},y=Array.prototype.slice,m=function(e){r=y.call(e,0)},E=function(e){for(var t=0,n=e.length;n>t;t++)r.push(e[t])};try{y.call(t.documentElement.childNodes,0)}catch(w){m=E}var b=function(e){for(var t=0,n=e.length;n>t;t++){var i=e[t];p(i)&&r.push(i)}},A=function(e){do if(e===l)return!0;while(e=e.parentNode);return!1};d.pseudos=s,d.context=t,n=d}}(window.MTVNPlayer.module("selector"),window.document);var u={addQueryStringParam:function(e,t,n){var r=t+"="+n;if(-1===e.indexOf(r)){var i=e.length-1,a=e.lastIndexOf("?"),o=e.lastIndexOf("&")===i||a===i?"":-1===a?"?":"&";e+=o+r}return e},setQueryStringParam:function(e,t,n){var r=RegExp("([?|&])"+t+"=.*?(&|$)","i");return e.match(r)?e.replace(r,"$1"+t+"="+n+"$2"):u.addQueryStringParam(e,t,n)}};r.configurePackages({$:{shim:!0,exports:"Zepto",url:"http://cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min.js"},"mtvn-util":{url:"http://media.mtvnservices.com/player/js/util/1.5.0/mtvn-util.min.js"}}),r.module("flash").initialize=a.once(function(){var e={play:"unpause",seek:"setPlayheadTime"},t=function(e){var t,n,r=null,i=o.instances.length;for(t=i;t--;)if(n=o.instances[t],n.source===e){r=n.player;break}return r},n=r.module("swfobject").getSWFObject(),i=function(e,r){var i=r.attributes||{},a=r.params||{allowFullScreen:!0},l=r.flashVars||{};i.data=o.getPath(r),i.width=i.height="100%",a.allowScriptAccess="always",l.objectID=e,a.flashVars=function(e){var t="";for(var n in e)t+=n+"="+e[n]+"&";return t?t.slice(0,-1):""}(l),t(e).element=n.createSWF(i,a,e)},u=function(e){o.instances=a.reject(o.instances,function(t){return t.source===e})},s=function(){try{this.element.exitFullScreen()}catch(e){}},f=function(e,t,n,r){var i,a={};return a.duration=e.duration,a.live=!1,a.isAd=e.isAd,a.isBumper=e.isBumper,a.index=void 0!==n&&null!==n?n:r?function(e){for(var t=r.length;t--;)if(r[t].rss.guid===e)return t;return-1}(e.guid):function(e){for(var n=t.length;n--;)if(t[n].metaData.guid===e)return n;return-1}(e.guid),i=a.rss={},i.title=e.title,i.description=e.description,i.guid=e.guid,i.link=e.link,i.image=e.thumbnail,i.group={},i.group.categories=function(){var t=e.displayData;return{isReportable:e.reportable,source:t.source,sourceLink:t.sourceLink,seoHTMLText:t.seoHTMLText}}(),a},d=function(e){var t,n={},r=e.items,i=r.length;for(n.description=e.description,n.title=e.title,n.link=e.link,n.items=[],t=i;t--;)n.items[t]=f(r[t],null,t);return n},p=function(e){var t,n={items:[]},r=e.length;for(t=r;t--;)n.items[t]=f(e[t].metaData,null,t);return n},h=function(e){var t=r.Player.flashEventMap,n="player"+Math.round(1e6*Math.random()),i=e.element,a="MTVNPlayer.Player.flashEventMap."+n,o=r.Events.METADATA,u=r.Events.FULL_SCREEN_CHANGE,s=r.Events.STATE_CHANGE,h=r.Events.PLAYLIST_COMPLETE,v=r.Events.READY,g=r.Events.MEDIA_END,y=r.Events.MEDIA_START,m=r.Events.PERFORMANCE,E=r.Events.INDEX_CHANGE,w=r.Events.PLAYHEAD_UPDATE;t[n+o]=function(t){var n=i.getPlaylist().items,r=e.playlistMetadata,a=f(t,n,null,r?r.items:null),u=!1,s=a.index,c=r?r.index:-1;if(e.currentMetadata=a,!r){u=!0;try{r=d(i.getPlaylistMetadata())}catch(h){r=p(n)}}if(-1!==s&&(r.items[s]=a,r.index=s,c!==s&&e.trigger(E,s)),e.playlistMetadata=r,u){e.ready=!0;try{var g=i.getJSConfig();l.copyProperties(e.config,g)}catch(h){}e.trigger(v,a)}e.trigger(o,a)},i.addEventListener("METADATA",a+o),t[n+s]=function(t){t=t.replace("playstates.",""),e.state=t,e.trigger(s,t),e.trigger(s+":"+t,t)},i.addEventListener("STATE_CHANGE",a+s),t[n+u]=function(t){e.isFullScreen!==t&&(e.isFullScreen=t,e.trigger(u,t))},i.addEventListener("FULL_SCREEN_CHANGE",a+u),t[n+w]=function(t){var n=Math.floor(e.playhead);e.playhead=t,e.trigger(w,t),n!=Math.floor(t)&&e.trigger(w+":"+Math.floor(t),t)},i.addEventListener("PLAYHEAD_UPDATE",a+w),t[n+h]=function(){e.trigger(h)},i.addEventListener("PLAYLIST_COMPLETE",a+h),t[n+m]=function(t){e.trigger(m,t)},i.addEventListener("PERFORMANCE",a+m),t[n+y]=function(){e.trigger(y)},i.addEventListener("READY",a+y),t[n+g]=function(){e.trigger(g)},i.addEventListener("MEDIA_ENDED",a+g),t[n+"onEndSlate"]=function(t){e.trigger(c.Events.ENDSLATE,t)},i.addEventListener("ENDSLATE",a+"onEndSlate")};r.Player.flashEventMap={},this.create=function(e,t){var n=e.id,r=e.config;o.instances.push({source:n,player:e}),t||i(n,r)},this.destroy=function(){n.removeSWF(this.element.id),u(this.id)},this.message=function(t){if(!this.ready)throw Error("MTVNPlayer.Player."+t+"() called before player loaded.");switch(t=e[t]||t){case"exitFullScreen":return s.call(this),void 0;case"goFullScreen":return;default:}return void 0!==arguments[1]&&void 0!==arguments[2]?this.element[t](arguments[1],arguments[2]):void 0!==arguments[1]?this.element[t](arguments[1]):this.element[t]()},window.mtvnPlayerLoaded=function(e){return function(n){e&&e(n);var r=t(n);o.executeCallbacks(r),h(r)}}(window.mtvnPlayerLoaded)}),r.module("html5").initialize=a.once(function(){function e(){var e,t=null,n=o.instances,r=n.length;for(e=r;e--;)t=n[e].player,t.isFullScreen&&f(t)}var t=function(e,t,n){e.style.cssText+=t+":"+n},n=function(e){var t,n,r=null,i=o.instances.length;for(t=i;t--;)if(n=o.instances[t],n.player.element.contentWindow===e){r=n.player;break}return r},u=function(e){o.instances=a.reject(o.instances,function(t){return t.player.element.contentWindow===e})},s=function(e){e.isFullScreen=!1;var n=e.config,i=e.containerElement;t(i,"position","static"),t(i,"z-index","auto"),t(i,"width",n.width+"px"),t(i,"height",n.height+"px"),t(e.element,"width",n.width+"px"),t(e.element,"height",n.height+"px"),e.trigger(r.Events.FULL_SCREEN_CHANGE)},f=function(e){var n=e.containerElement,i=e.config.highestZIndex,a=e.config.fullScreenCssText;e.isFullScreen=!0,n.style.cssText=a?a:"position:fixed;left:0px;top:0px;z-index:"+(i||2147483645)+";",t(n,"width",window.innerWidth+"px"),t(n,"height",window.innerHeight+"px"),t(e.element,"width",window.innerWidth+"px"),t(e.element,"height",window.innerHeight+"px"),l.needsScrollToForFullScreen(navigator.userAgent)&&window.scrollTo(0,0),e.trigger(r.Events.FULL_SCREEN_CHANGE)},d=function(e){return d=function(){return window.JSON?function(e){return e?JSON.parse(e):null}:i&&i.parseJSON?function(e){return i.parseJSON(e)}:function(){}}(),d(e)},p=function(e){return e.slice(e.indexOf(":")+1)},h=function(e,t){var n=d(p(e)),i=n.index,a=t.playlistMetadata.index;t.currentMetadata=n,-1!==i&&(t.playlistMetadata.items[n.index]=n,t.playlistMetadata.index=n.index,i!==a&&t.trigger(r.Events.INDEX_CHANGE,i)),t.trigger(r.Events.METADATA,n)},v=function(e){e.ready=!0;var t=e.config.flashVars;t&&t.sid&&e.message.call(e,"setSSID:"+t.sid);var n=parseInt(e.config.startIndex,10);!isNaN(n)&&n>0&&e.message.call(e,"startIndex:"+n),o.executeCallbacks(e),e.trigger(r.Events.READY)},g=function(e){var t,i,a,u=e.data,g=r.Events;if(u&&u.indexOf&&-1===u.indexOf("logMessage:")&&(t=n(e.source)))if(a=t.events,0===u.indexOf("playState:"))t.state=p(u),t.trigger(g.STATE_CHANGE,t.state),t.trigger(g.STATE_CHANGE+":"+t.state,t.state);else if(0===u.indexOf("config:"))l.copyProperties(t.config,d(p(u)));else if(0===u.indexOf("performance:"))t.config.performance&&o.processPerformance(t,d(p(u)));else if(0===u.indexOf("playlistComplete"))t.trigger(g.PLAYLIST_COMPLETE);else if(0===u.indexOf("metadata:"))h(u,t);else if(0===u.indexOf("mediaStart"))t.trigger(g.MEDIA_START);else if(0===u.indexOf("mediaEnd"))t.trigger(g.MEDIA_END);else if(0===u.indexOf("playheadUpdate")){var y=Math.floor(t.playhead);i=parseInt(p(u),10),t.playhead=i,t.trigger(g.PLAYHEAD_UPDATE,i),y!=Math.floor(i)&&t.trigger(g.PLAYHEAD_UPDATE+":"+Math.floor(i),i)}else 0===u.indexOf("playlistMetadata:")?t.playlistMetadata=d(p(u)):"onReady"===u?v(t):"fullscreen"===u?t.isFullScreen?s(t):f(t):0===u.indexOf("overlayRectChange:")?t.trigger(g.OVERLAY_RECT_CHANGE,d(p(u))):0===u.indexOf("onUIStateChange:")?t.trigger(g.UI_STATE_CHANGE,d(p(u))):0===u.indexOf("airplay")?t.trigger(g.AIRPLAY):0===u.indexOf("showCCPrefs:")?t.trigger(c.Events.CC_PREFS,d(p(u))):(0===u.indexOf("onEndSlate:")||0===u.indexOf("endslate"))&&t.trigger(c.Events.ENDSLATE,d(p(u)))},y=function(e,t){return e.element.contentWindow.postMessage(t,"*")},m=function(e){var n=e.config,r=document.createElement("iframe"),i=document.getElementById(e.id);r.setAttribute("id",e.id),r.setAttribute("src",o.getPath(n)),r.setAttribute("frameborder","0"),r.setAttribute("scrolling","no"),r.setAttribute("type","text/html"),t(r,"width",n.width+"px"),t(r,"height",n.height+"px"),t(r,"position","absolute"),i.parentNode.replaceChild(r,i),e.element=r};this.create=function(e){e.config.isSyndicatedLegacyHTML5?(e.element=window,o.instances.push({player:e}),y=function(e,t){return window.postMessage(t,"*")},v(e)):(m(e),o.instances.push({player:e})),window.addEventListener!==void 0?window.addEventListener("message",g,!1):window.attachEvent!==void 0&&window.attachEvent("onmessage",g)},this.message=function(e){if(!this.ready)throw Error("MTVNPlayer.Player."+e+"() called before player loaded.");switch(e){case"goFullScreen":f.apply(this,[this]);break;case"exitFullScreen":s.apply(this,[this]);break;case"playUri":case"playURI":this.config.uri=arguments[1],this.element.src=o.getPath(this.config);break;default:return void 0!==arguments[1]&&(e+=":"+arguments[1]+(void 0!==arguments[2]?","+arguments[2]:"")),y(this,e)}},this.destroy=function(){u(this.element.contentWindow),this.element.parentNode.removeChild(this.element)},window.addEventListener("orientationchange",function(){e(),setTimeout(e,500)},!1)});var s={configure:function(e){this.message("configure",e)},disableAds:function(e){this.message("disableAds",e)},spoofAdURI:function(e){this.message("spoofAdURI",e)},loadVideo:function(e){this.message("loadVideo",e)},loadPlaylist:function(e,t){this.message("loadPlaylist",e,t)}};r.Events={METADATA:"metadata",STATE_CHANGE:"stateChange",MEDIA_START:"mediaStart",MEDIA_END:"mediaEnd",PLAYHEAD_UPDATE:"playheadUpdate",PLAYLIST_COMPLETE:"playlistComplete",OVERLAY_RECT_CHANGE:"overlayRectChange",READY:"ready",UI_STATE_CHANGE:"uiStateChange",INDEX_CHANGE:"indexChange",FULL_SCREEN_CHANGE:"fullScreenChange",AIRPLAY:"airplay",PERFORMANCE:"performance"},r.PlayState={PLAYING:"playing",PAUSED:"paused",SEEKING:"seeking",STOPPED:"stopped",BUFFERING:"buffering"},r.defaultConfig=r.defaultConfig,r.defaultEvents=r.defaultEvents,r.Player=function(e){var t,n=function(e){throw Error("Embed API:"+e)},u=e.document,f=function(e){return e&&0===e.indexOf("on")?"onUIStateChange"===e?"uiStateChange":e.charAt(2).toLowerCase()+e.substr(3):e},d=function(e){-1!==e.indexOf(":")&&(e=e.split(":")[0]);var t=function(t){for(var n in t)if(t.hasOwnProperty(n)&&t[n]===e)return!0;return!1};t(r.Events)||t(c.Events)||n("event:"+e+" doesn't exist.")},p=function(e){for(var t in e)e.hasOwnProperty(t)&&0===t.indexOf("on")&&(e[f(t)]=e[t],delete e[t]);for(t in e)e.hasOwnProperty(t)&&d(t)},h=function(e,t){var n="100%"===e.width?t.clientWidth:e.width,r="100%"===e.height?t.clientHeight:e.height,i={width:512,height:288},a={width:360,height:293},o=n/r,l=Math.abs(o-4/3),u=Math.abs(o-16/9);return l>u?i:a},v=function(){var e=this.config,t=this.currentMetadata,n='<p style="text-align:left;background-color:#FFFFFF;padding:4px;margin-top:4px;margin-bottom:0px;font-family:Arial, Helvetica, sans-serif;font-size:12px;">',r=function(){if(!t)return"";var e="",r=t.rss.group.categories,i=r.source,a=r.sourceLink,o=r.seoHTMLText;return i&&(e+=a?'<b><a href="'+a+'">'+i+"</a></b>":"<b>"+i+"</b> "),o&&(e&&(e+="<br/>"),e+="Get More: "+o),e&&(e=n+e+"</p>"),e}(),i=h(e,this.element),a='<div style="background-color:#000000;width:{divWidth}px;"><div style="padding:4px;"><iframe src="http://media.mtvnservices.com/embed/{uri}" width="{width}" height="{height}" frameborder="0"></iframe>{displayMetadata}</div></div>';return a=a.replace(/\{uri\}/,e.uri),a=a.replace(/\{width\}/,i.width),a=a.replace(/\{divWidth\}/,i.width+8),a=a.replace(/\{height\}/,i.height),a=a.replace(/\{displayMetadata\}/,r)},g=function(e){return isNaN(e)?e:e+"px"},y=function(){var e=u.createElement("div");return e.setAttribute("id","mtvnPlayer"+Math.round(1e7*Math.random())),e};return r.isHTML5Player=o.isHTML5Player(e.navigator.userAgent),r.onPlayer=function(e){o.onPlayerCallbacks.push(e)},r.removeOnPlayer=function(e){var t=o.onPlayerCallbacks.indexOf(e);-1!==t&&o.onPlayerCallbacks.splice(t,1)},r.getPlayers=function(){var e=[],t=o.instances,n=t.length;for(n;n--;)e.push(t[n].player);return e},r.getPlayer=function(e){var t=o.instances,n=t.length;for(n;n--;)if(t[n].player.config.uri===e)return t[n].player;return null},r.gc=function(){var e=function(e){for(;e.parentNode;)if(e=e.parentNode,e==u)return!0;return!1},t=o.instances,n=t.length;for(n;n--;)e(t[n].player.element)||t.splice(n,1)},r.createPlayers=function(e,t,n){e||(e="div.MTVNPlayer");for(var i=r.module("selector").find(e),a=0,o=i.length;o>a;a++)new r.Player(i[a],t,n);return i.length},t=function(e,c,f){if(!(this instanceof t))return new t(e,c,f);this.ready=!1,this.state=null,this.currentMetadata=null,this.playlistMetadata=null,this.playhead=0,this.element=null,this.config=c||{},this.config.performance&&(this.config.performance={startTime:(new Date).getTime()}),this.config.contentless&&a.extend(t.prototype,s),this.isFullScreen=!1;var d,h=y();return this.containerElement=a.isElement(e)?e:u.getElementById(e),this.id=h.id,this.config=l.buildConfig(this.containerElement,this.config),this.containerElement.style.width=g(this.config.width),this.containerElement.style.height=g(this.config.height),this.containerElement.style.position="relative",this.containerElement.appendChild(h),this.events=l.copyEvents(f||{},r.defaultEvents),this.isFlash=void 0===this.config.isFlash?!r.isHTML5Player:this.config.isFlash,p(f),d=r.module(this.isFlash?"flash":"html5"),d.initialize(),o.playerInit(this,d),this.containerElement?(d.create(this),void 0):("complete"===u.readyState?n("target div "+this.id+" not found"):i?function(e){i(u).ready(function(){u.getElementById(e.id)?d.create(e):n("target div "+e.id+" not found")})}(this):n("Only call new MTVNPlayer.Player(targetID,..) after the targetID element is in the DOM."),void 0)},t.prototype={getPlayerElement:function(){return this.element},play:function(){this.message("play")},pause:function(){this.message("pause")},mute:function(){this.message("mute")},unmute:function(){this.message("unmute")},playIndex:function(e,t){this.message("playIndex",e,t)},playURI:function(e){this.message("playUri",e)},setVolume:function(e){this.message("setVolume",e)},seek:function(e){this.message("seek",e)},getEmbedCode:function(){return v.call(this)},goFullScreen:function(){this.message("goFullScreen")},exitFullScreen:function(){this.message("exitFullScreen")},createUserClip:function(){return this.message("createUserClip")},bind:function(e,t){e=f(e),d(e);var n=this.events[e];n?n instanceof Array?n.push(t):n=[t,n]:n=t,this.events[e]=n},unbind:function(e,t){e=f(e),d(e);var n,r=this.events[e];if(r)if(r instanceof Array){for(n=r.length;n--;)if(r[n]===t){r.splice(n,1);break}}else this.events[e]=null},once:function(e,t){var n=this,r=function(i){n.unbind(e,r),t(i)};this.on(e,r)},trigger:function(e,t){o.processEvent(this.events[e],{target:this,data:t,type:e})},destroy:function(){}},t.prototype.on=t.prototype.bind,t.prototype.off=t.prototype.unbind,t.prototype.one=t.prototype.once,t}(window),function(e){if(e){var t="MTVNPlayer:",n=function(e){return e&&e.config&&e.config.player?e.config.player:void 0}(window.MTVN),i=l.copyProperties({width:"100%",height:"100%"},n||r.defaultConfig),a=function(){a=function(){};var e="\n.MTVNPlayer_placeholder {cursor:pointer; position: relative;}\n.MTVNPlayer_placeholder_button {\nposition:absolute;\nheight: 100%;\nwidth: 100%;\ntop:0;\nleft:0;\nbackground: no-repeat url(http://media.mtvnservices.com/player/images/Button_playBig_upSkin.png) center;\n}\n\n.MTVNPlayer_placeholder_button:hover {\nbackground-image: url(http://media.mtvnservices.com/player/images/Button_playBig_overSkin.png)\n}\n";o.appendStyle(e)},u=function(e){var n=e.data("player"),i=function(e,r,i){var a=e.type.replace(t,"");n[a].apply(n,[r,i])};for(var a in r.Player.prototype)e.bind(t+a,i)},s=function(e){var t,n=l.buildConfig(e[0],i);t=new r.Player(e[0],n),e.data("player",t),t.$el=e,u(e)};e.fn.player=function(t){var n=e.isFunction(t)?t:function(){},i=this.not(function(){return e(this).data("contenturi")?!1:!0});i.length>0?i.each(function(){var t=e(this);!r.isHTML5Player&&t.children().length>0?(a(),t.html(function(e,t){return'<div class="MTVNPlayer_placeholder">'+t+'<div class="MTVNPlayer_placeholder_button"></div></div>'}),t.delegate("div.MTVNPlayer_placeholder","click",function(e){e.preventDefault(),t.find("div.MTVNPlayer_placeholder").hide(),t.bind("MTVNPlayer:showPlaceholder",function(){t.children().not("div.MTVNPlayer_placeholder").remove(),t.find("div.MTVNPlayer_placeholder").show(),delete t.data().player}),t.data("autoplay",!0),s(t),n()})):(t.empty(),s(t),n())}):n()}}}(window.jQuery||window.Zepto);var c=function(){var e={ENDSLATE:"endslate"},t="http://media.mtvnservices.com/player/api/module/",n={$:{shim:!0,url:"http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},"mtvn-util":t+"mtvn-util/latest/mtvn-util.min.js","endslate-css":t+"endslate/latest/style.css",endslate:t+"endslate/latest/endslate.min.js"},i=function(e){l.provideJQuery();var t=e.target,i=t.config.module||{};r.loadPackages(a.extend(n,i.endslate),function(){new(r.require("endslate"))({config:e.data,player:t})})};return r.onPlayer(function(e){e.bind(c.Events.ENDSLATE,i)}),{Events:e}}();(function(e){var t=e.MTVNPlayer,n=t.require("_");t.noConflict(),delete t.noConflict,n.isFunction(t.onAPIReady)&&t.onAPIReady(),n.isArray(e._mtvnPlayerAPIReady)&&n.each(e._mtvnPlayerAPIReady,function(e){n.isFunction(e)&&e()}),e._mtvnPlayerAPIReady=[],e._mtvnPlayerAPIReady.push=function(e){e()}})(window),r.isReady=!0}(MTVNPlayer,window.jQuery||window.Zepto)}}();
/* http://relaunch.mtv-d.mtvi.com/media/triforce_config.js */
window.TriforceConfiguration = {"globalZones":["header","footer","ads-reporting"],"manifestFeed":"http:\/\/relaunch.mtv-d.mtvi.com\/feeds\/triforce\/manifest\/v5","scriptConcatenator":"http:\/\/relaunch.mtv-d.mtvi.com\/media\/module\/","priorityTimeout":"300","stragglersTimeout":"3000","tierWrapper":"true","playerScript":"http:\/\/media.mtvnservices.com\/pjs\/?v=0.13.0"};


(function($) {
	$Crabapple.TriforceDebug_v1 = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforceDebug_v1, {
		sprite: '/webclient/mike/megaman_sprite.png',
		background:"#FFFFFF",
		currentFrame:0,
		elm: null,
		animation: [
			'megaman-0',
			'megaman-1',
			'megaman-2',
			'megaman-3',
			'megaman-4',
			'megaman-5',
			'megaman-6',
			'megaman-7'
		],
		init:function() {
			var self = this;
			if (this.hasAuthCookie()) {
				this.drawModule();				
				var cookie = $.cookie("crabappleInformation");
				if (cookie) {
					var info = JSON.parse(cookie);
					this.elm.find('li[data-mode]').each(function() {
						if (self.hasMode($(this).attr('data-mode'), info)) {
							$(this).find('.switch').addClass('on');
							if ($(this).attr('data-mode').indexOf('crap') >= 0) {
								$(this).find('.switch').removeClass('on');
							}
						}
					});
				}
			}
		},
		cleanup: function() {
			$('li[data-mode="modes.debug.sections.crap"] .switch').trigger('click');
			$('body').attr('style', '');
			$('head').append('<link rel="stylesheet" type="text/css" href="/media/base.css?r=' + Math.floor(Math.random() * 1000000) + '" />');
		},
		debugEnabled: function() {
			var cookie = $.cookie("crabappleInformation");
			var info = JSON.parse(cookie);
			return this.hasMode('modes.debug.sections.javascript', info);
		},
		hasMode: function(mode, info) {
			var parts = mode.split('.'),
				tmp = info;
			if (tmp == null) return false;
			
			for (var i=0; i<parts.length-1; i++) {
				if (tmp[parts[i]] != null && tmp[parts[i]]) tmp = tmp[parts[i]];
				else return false;
			}
			return tmp[parts[i]];
		},
		drawModule: function() {
			var self = this;
			var body = $('body');
			body.append('<div id="triforce_debug"></div>');
			this.elm = $('#triforce_debug');
			this.elm.html(this.getHTML());
			this.fetchManifests();
			this.fetchArcStages();
			this.startAnimation();
			
			this.elm.find('.corner').on('click', function(event) {
				event.preventDefault();
				if ($(this).hasClass('stopped')) {
					$(this).removeClass('stopped'); 
					self.startAnimation();
					self.hideOverlay();
				}
				else {
					$(this).addClass('stopped');
					self.stopAnimation();
					self.showOverlay();
				}
			});
			
			this.elm.find('div.manifest select').on('change', function(event) {
				var manifest = $(this).val();
				self.setCurrentManifest(manifest);
			});
			
			this.elm.find('div.arcStageOverride select').on('change', function(event) {
				var stage = $(this).val();
				self.setCurrentArcStage(stage);
			});

            this.elm.find('div.logout').on('click', function(event) {
                event.preventDefault();
				$.cookie('crabappleAuthorization', '', {expires:-1});
				$.cookie('crabappleAuthorizationName', '', {expires:-1});
				$.cookie('crabappleInformation', '', {expires:-1});
				$.removeCookie('crabappleAuthorization', {path:'/'});
				$.removeCookie('crabappleAuthorizationName', {path:'/'});
				$.removeCookie('crabappleInformation', {path:'/'});
                window.location.reload();
            });
			
			this.elm.find('.switch').on('click', function(event) {
				var mode = $(this).parents('li').attr('data-mode');
				var crabappleInformation = $.cookie('crabappleInformation');
				if (crabappleInformation)
					var crabappleInformationObject = JSON.parse(crabappleInformation);
				
				else {
					var crabappleInformationObject = {
						'modes':{
							'manifest':'production',
						},
						'configuration':{}
					};
				}
				if ($(this).hasClass('on')) {
					$(this).removeClass('on');
					self.setModeValue(mode, false, crabappleInformationObject);
				}
				else {
					$(this).addClass('on');
					if (mode.indexOf('crap') >= 0) {
						$('head').find('link').each(function() {
							var href = $(this).attr('href');
							if (href.indexOf('base.css') >= 0) $(this).remove();
						});
						$('body').attr('style','font-family:"comic sans ms" !important;background:url("http://thecatapi.com/api/images/get?format=src&type=gif") repeat;');
						setTimeout(function() {
							self.cleanup();
						}, 5000);
					}
					self.setModeValue(mode, true, crabappleInformationObject);
				} 
				$.cookie('crabappleInformation', JSON.stringify(crabappleInformationObject), {path:'/'});
			});

			this.elm.find('.standalone_debug').on('click', function(event) {

				for(var zone in triforceManifestFeed.zones) {				
					var standAlone_url = '/triforce/module_debug/'+triforceManifestFeed.zones[zone].moduleName+'?feedUrl='+triforceManifestFeed.zones[zone].feed+'&crabappleErrors=true',
						html='';

					if (zone.replace('_promo','') == zone) {
						html += '<a title="'+zone+'" class="standalone_debug" target="_blank" href="'+standAlone_url+'">'+triforceManifestFeed.zones[zone].moduleDriver+'promo#'+promo+' </a>';
					} else {
						var tier = zone.split('_')[0].replace(/(t|tier)/ig, '');
							promo = zone.split('_')[2].replace(/(promo)/ig, '');
							
						//console.info('#tier_'+tier +' '+triforceManifestFeed.zones[zone].moduleDriver);
						//$('#tier_'+tier +' .'+triforceManifestFeed.zones[zone].moduleDriver).append('<a title="'+zone+'" class="standalone_debug" target="_blank" href="'+standAlone_url+'">StandAlone '+triforceManifestFeed.zones[zone].moduleDriver+'promo#'+promo+' </a>');
						html += '<a title="'+zone+'" class="standalone_debug" target="_blank" href="'+standAlone_url+'">'+triforceManifestFeed.zones[zone].moduleDriver+'promo#'+promo+' </a>';
					}
					$('body').prepend(html);					
				}

			});
		},
		setModeValue: function(mode, value, o) {
			var parts = mode.split('.');
			for (var i=0, tmp=o; i<parts.length - 1; i++) {
				if (!tmp[parts[i]]) {
					tmp = tmp[parts[i]] = {};
				}
				else { 
					tmp = tmp[parts[i]];
				}
			}
			tmp[parts[i]] = value;
			return o;
		},
		getHTML: function() {
			var self = this;
			var html = '';
			html += '<div class="corner">';
			html += '	<div class="megaman ' + self.animation[self.currentFrame] + '">';
			html += '	</div>';
			html += '</div>';
			html += '<div class="overlay">';
			html += '   <div class="manifest"></div>';
			html += '   <div class="arcStageOverride"></div>';
			html += '	<ul>';
			html +=	'		<li data-mode="modes.debug.sections.javascript" class="debug"><div class="switch"><span class="thumb"></span><input type="checkbox" /></div><div class="text">Debug</div></li>';
			html +=	'		<li data-mode="modes.cache.refreshObjects" class="cache"><div class="switch"><span class="thumb"></span><input type="checkbox" /></div><div class="text">Cache Refresh</div></li>';
			html +=	'		<li data-mode="modes.cdn.akamai.clearRequests" class="akamai"><div class="switch"><span class="thumb"></span><input type="checkbox" /></div><div class="text">Akamai Clear</div></li>';
			html +=	'		<li data-mode="modes.cache.refreshFeeds" class="feed"><div class="switch"><span class="thumb"></span><input type="checkbox" /></div><div class="text">Feed Refresh</div></li>';			
			html +=	'		<li data-mode="modes.debug.sections.crap" class="feed"><div class="switch"><span class="thumb"></span><input type="checkbox" /></div><div class="text">MEOW!</div></li>';
			html += '	</ul>';
			html += '	<div class="standalone_debug">StandAlone fragment</div>';
            html += '   <div class="logout">Logout</div>';
			html += '</div>';
			return html;
		},
		hasAuthCookie: function() {
			if (document.cookie.indexOf('crabappleAuthorization') > -1) return true;
			return false;
		},
		nextFrame: function() {
			var self = this;
			var timeout = 100;
			var previousFrame = self.currentFrame;
			if (self.currentFrame + 1 == self.animation.length) {
				self.currentFrame = 0;
			}
			else {
				self.currentFrame++;
			}
			
			if (self.currentFrame + 1 == self.animation.length) {
				timeout = 1000;
			}
			var megaman = self.elm.find('.megaman');
			if (megaman.hasClass('stopped')) return;
			megaman.removeClass(self.animation[previousFrame]).addClass(self.animation[self.currentFrame]);
			setTimeout(function() { self.nextFrame(); }, timeout);
		},
		startAnimation: function() {
			var self = this;
			var megaman = self.elm.find('.megaman');
			megaman.removeClass('stopped');
			setTimeout(function() { self.nextFrame(); }, 100);
		},
		stopAnimation: function() {
			var self = this;
			var megaman = self.elm.find('.megaman');
			megaman.removeClass(self.animation[self.currentFrame]);
			self.currentFrame = 0;
			megaman.addClass('stopped');
		},
		showOverlay: function() {
			this.elm.find('.overlay').fadeIn('fast');
		},
		hideOverlay: function() {
			this.elm.find('.overlay').fadeOut('fast');
		},
		fetchManifests: function() {
			var self = this,
			currentManifest = this.getCurrentManifest();
			this.elm.find('div.manifest').append('Manifest: <select name="modes.manifest"></select>');
			$.getJSON('/__crabapple_admin/manifest/ajax/list', function(response) {
				if (response.result) {
					for (var i in response.result) {
						if (response.result[i].id == currentManifest) {
							self.elm.find('div.manifest select').append('<option value="' + response.result[i].id + '" selected>' + response.result[i].name + '</option>');
						}
						else {
							self.elm.find('div.manifest select').append('<option value="' + response.result[i].id + '">' + response.result[i].name + '</option>');
						}
						
					}
				}
			});
		},
		getCurrentManifest: function() {
			var cookie = $.cookie('crabappleInformation');
			cookie = JSON.parse(cookie);
			if (cookie != null && cookie.modes && cookie.modes.manifest) return cookie.modes.manifest;
			return "production";
		},
		setCurrentManifest: function(manifest) {
			var cookie = $.cookie('crabappleInformation');
			cookie = JSON.parse(cookie);
            if (cookie == null) {
                cookie  = {
                    'modes':{
                        'manifest':'',
                    },
                    'configuration':{}
                };
            }
			if (cookie.modes && cookie.modes.manifest) {
				cookie.modes.manifest = manifest;
			}
			else if (cookie.modes) {
				cookie.modes.manifest = manifest;
			}
			else {
				cookie.modes = {
					"manifest":manifest
				};
			}

            if (localStorage && localStorage.clear) {
                localStorage.clear();
            }

			$.cookie('crabappleInformation', JSON.stringify(cookie), {path:'/'});
		},
		fetchArcStages: function() {
			var self = this,
				currentArcStage = this.getCurrentArcStage();
			this.elm.find('div.arcStageOverride').append('Arc Stage: <select name="modes.arcStage"></select>');
			var arcStagesAvailable = [
				{ id:'default',name:'Site Default'},
				{ id:'live',name:'Live'},
				{ id:'staging',name:'Staging'},
				{ id:'authoring',name:'Authoring'}
			];
			for (var stage in arcStagesAvailable)
			{
				var selected = '';
				if (arcStagesAvailable[stage].id == currentArcStage)
				{
					selected = ' selected="selected"';
				}
				
				self.elm.find('div.arcStageOverride select').append('<option value="' + arcStagesAvailable[stage].id + '"' + selected + '>' + arcStagesAvailable[stage].name + '</option>');
			}
		},
		getCurrentArcStage: function() {
			var cookie = $.cookie('crabappleInformation');
			cookie = JSON.parse(cookie);
			if (cookie != null && cookie.modes && cookie.modes.arcStage) return cookie.modes.arcStage;
			return "default";
		},
		setCurrentArcStage: function(arcStage) {
			var cookie = $.cookie('crabappleInformation');
			cookie = JSON.parse(cookie);
            if (cookie == null) {
                cookie  = {
                    'modes':{
                        'arcStage':'',
                    },
                    'configuration':{}
                };
            }
			if (cookie.modes && cookie.modes.arcStage) {
				cookie.modes.arcStage = arcStage;
			}
			else if (cookie.modes) {
				cookie.modes.arcStage = arcStage;
			}
			else {
				cookie.modes = {
					"arcStage":arcStage
				};
			}
            if (localStorage && localStorage.clear) {
                localStorage.clear();
            }

			$.cookie('crabappleInformation', JSON.stringify(cookie), {path:'/'});
		}
	});
}) (jQuery);



(function($,w) {
	$Crabapple.TriforceImageBroker = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforceImageBroker, {
		_deferredImages: null,
		devicePixelRatio: null,

		init: function() {
			this._deferredImages = [];
			this.devicePixelRatio = w.devicePixelRatio || 1;

			this.addEvents();
			this.processDeferredImages();
		},

		processDeferredImages: function () {
			var images = document.querySelectorAll('.image_holder.deferred');

			for (var i = 0, len = images.length; i < len; i++) {
				w.Triforce.getMediator().trigger('triforce:queueimage', {
					'holder': images[i],
					'info': JSON.parse(images[i].getAttribute('data-info'))
				});
			}
		},

		addEvents: function () {
			var self = this,
				mediator = w.Triforce.getMediator();

			mediator.on('triforce:pagestartload', function () {
				self._deferredImages = [];
			});
			mediator.on('triforce:queueimage', function (event) {
				self._deferredImages.push(event[1]);
			});
            mediator.on('triforce:loadqueuedimage', function (event) {
                self.checkDeferredImage(event[1]);
            });

			mediator.on('triforce:module:rendered triforce:pagerendercomplete triforce:pageintouch', function () {
				self.checkDeferredImages();
			});

			var scrollCounter = 1,
				scrollTimeoutId;

			$(w).on('ontouchmove' in w ? 'touchmove scroll' : 'scroll', function () {
				clearTimeout(scrollTimeoutId);
				if (scrollCounter % 10 === 0) {
					scrollCounter = 1;
					mediator.trigger('triforce:pageintouch');
				}
				scrollCounter++;
				scrollTimeoutId = setTimeout(function () {
					mediator.trigger('triforce:pageintouch');
				}, 50);
			});

			var resizeTimeoutId;

			$(w).on('resize', function () {
				clearTimeout(resizeTimeoutId);
				resizeTimeoutId = setTimeout(function () {
					self.checkDeferredImages();
				}, 200);
			});
		},

		checkDeferredImages: function () {
			for (var i = 0, len = this._deferredImages.length; i < len; i++) {
				if (this.isVisible(this._deferredImages[i].holder)) {
                    this.checkDeferredImage(this._deferredImages[i]);
				}
			}
		},
        checkDeferredImage: function (image) {
            if (image) {
                if (!image.processed) {
                    this.processLoadingImage(image);
                } else {
                    this.processReloadingImage(image);
                }
            }
        },

		processLoadingImage: function (deferredImage) {
			var image = deferredImage.image = new Image(),
				imageInformation = deferredImage.info,
				imageDimensions = {
					width: deferredImage.holder.clientWidth,
					height: deferredImage.holder.clientHeight
				},
				resizeParams = '?quality=' + imageInformation.quality;

			imageInformation.original && this.getImageDimensions(imageDimensions, imageInformation.original);

			resizeParams += '&width=' + imageDimensions.width;
			imageInformation.width = imageDimensions.width;
			if (imageDimensions.height) {
				resizeParams += '&height=' + imageDimensions.height + '&crop=true';
				imageInformation.aspectRatio = this.getAspectRatio(imageDimensions);
				imageInformation.height = imageDimensions.height;
			}

			image.className = 'image';
			image.onload = function () {
				if ('classList' in deferredImage.holder) {
					deferredImage.holder.classList.remove('deferred');
				} else {
					var classes = deferredImage.holder.className.split(' '),
						index = classes.indexOf('deferred');

					if (index !== -1) {
						classes.splice(index, 1);
						deferredImage.holder.className = classes.join(' ');
					}
				}

			};
			image.src = imageInformation.src + resizeParams;

			deferredImage.holder.appendChild(image);
			deferredImage.processed = true;
		},

		processReloadingImage: function (imageObject) {
			var imageInformation = imageObject.info,
				imageDimensions = {
					width: imageObject.holder.clientWidth,
					height: imageObject.holder.clientHeight
				},
				aspectRatio,
				image,
				resizeParams;

			imageInformation.original && this.getImageDimensions(imageDimensions, imageInformation.original);

			// Determine ASPECT RATIO
			if (imageInformation.aspectRatio) {
				aspectRatio = this.getAspectRatio(imageDimensions);
			}

			if (imageDimensions.width > imageInformation.width || (imageInformation.height && (imageDimensions.height > imageInformation.height || aspectRatio !== imageInformation.aspectRatio))) {
				resizeParams = '?quality=' + imageInformation.quality;

				resizeParams += '&width=' + imageDimensions.width;
				imageInformation.width = imageDimensions.width;

				if (imageInformation.height) {
					resizeParams += '&height=' + imageDimensions.height + '&crop=true';
					imageInformation.aspectRatio = aspectRatio;
					imageInformation.height = imageDimensions.height;
				}

				image = new Image();

				image.className = 'image';
				image.onload = function () {
					imageObject.holder.replaceChild(image, imageObject.image);
					imageObject.image = image;
				};
				image.src = imageObject.info.src + resizeParams;
			}
		},

		getImageDimensions: function (dimensions, originalDimensions) {
			var aspectRatioRounded = this.getAspectRatio(dimensions),
				aspectRatio = this.getAspectRatio(dimensions, true);

			if (this.devicePixelRatio > 1) {
				dimensions.width = Math.ceil(this.devicePixelRatio * dimensions.width);
				dimensions.height = Math.ceil(this.devicePixelRatio * dimensions.height);
			}

			if (!dimensions.width || dimensions.width > originalDimensions.width) {
				dimensions.width = originalDimensions.width;
			}

			if (dimensions.height && dimensions.height > originalDimensions.height) {
				dimensions.height = originalDimensions.height;
			}

			if (originalDimensions.aspectRatio) {
				if (originalDimensions.aspectRatio > aspectRatioRounded) {
					dimensions.width = Math.ceil(dimensions.height * aspectRatio);
				} else {
					dimensions.height = Math.ceil(dimensions.width / aspectRatio);
				}
			} 
		},

		getAspectRatio: function (dimension, notRound) {
			var aspectRatio = null;

			if (dimension.height ) {
				aspectRatio = dimension.width / dimension.height;
				aspectRatio = notRound ? aspectRatio : Math.round(aspectRatio * 10) / 10;
			}

			return aspectRatio;
		},

		isVisible: function (el) {
            if (!el.parentNode) {
                return false;
            }
			var elRect = el.getBoundingClientRect(),
				wWidth = w.innerWidth,
				wHeight = w.innerHeight,
				hasRect = elRect.bottom || elRect.height || elRect.left || elRect.right || elRect.top || elRect.width;

			return hasRect && (elRect.top >= 0 ? elRect.top <= wHeight : elRect.bottom >= 0)
			       && (elRect.left >= 0 ? elRect.left <= wWidth : elRect.right >= 0);
		}
	});
}) (jQuery, window);



(function($,w) {
	$Crabapple.TriforceLayoutManager = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforceLayoutManager, {
		contentHolder: $('#content_holder'),
		$body: $(document.body),
		globalZones: null,
		globalZoneList: [],
		priorityList: {},
		moduleTimeout: 30000,
		pageClass: null,
		languagePreferences: null,
		init: function() {
			if(window.Triforce && window.Triforce.config && window.Triforce.config.globalZones) {
				this.globalZones = window.Triforce.config.globalZones.join(',');
			}
		},
		startLayout:function() {
			var feed = triforceManifestFeed;
			if (this.pageClass != null) {
				$('body').removeClass(this.pageClass);
			}
			if (feed.pageClass && feed.pageClass != null) {
				$('body').addClass(feed.pageClass);
			}
			if (feed.pageClass) {
				this.pageClass = feed.pageClass;
			} else {
				this.pageClass = null;
			}
			if (!feed || !feed.zones) {
				w.Triforce.getMediator().trigger('triforce:pageerror', 'No zones in feed');
			}

			if (feed.languagePreferences) {
				this.languagePreferences = feed.languagePreferences;
			}

			this.clearBodyCSS();
			if (feed.css != null || feed.supplemental != null) {
				this.addBodyCSS(feed);
			}
            w.Triforce.getMediator().trigger('triforce:bodystart', 'Triggering bodystart');
			if (this.contentHolder.attr('data-initial') && this.contentHolder.attr('data-initial') === 'true') {
				this.contentHolder.removeAttr('data-initial');
			} else {
				this.clearContent(feed.zones);
			}

			this.globalZoneList = [];
			this.priorityList = {};

			this.createZones(feed.zones);

			if (window.Triforce.config.tierWrapper) {
                var tiersToWrap = $('.tier_2_col, .tier_3_col');

                if (tiersToWrap.length) {
                    tiersToWrap.wrapInner('<div class="tier_wrapper"></div>');
                }
			}
			return this.priorityList;
		},

		clearContent: function(zones) {
			var _this = this;

			$('body').removeAttr('style');
			if (window.Triforce.config.tierWrapper && $('.tier_wrapper').length) {
				$('.tier_wrapper').children().unwrap();
			}

			$('.module, .triforce-module').each(function(key, module) {
				var $module = $(module),
					moduleID = $module[0].id;

				if (moduleID && zones[moduleID]) {
					_this.removeGlobalModule($module);
					return true;
				}

				$module.remove();
			});

			var requiredZones = {};
			for(var zone in zones) {
				var zoneLocation = parseInt(zone.split('_')[0].substr(1));
				if(zoneLocation > 0) {
					requiredZones[zoneLocation] = true;
				}
			}

			var tiers = this.contentHolder[0].querySelectorAll('[id^="tier_"]');
			for (var i=0; i<tiers.length; i++) {
				var cols = tiers[i].querySelectorAll('[id$="_lc"],[id$="_rc"],[id$="_mc"]'),
					currentTier = tiers[i].id.split('_')[1],
					tierRequired = requiredZones[tiers[i].id.split('_')[1]];

				if(!tierRequired && tiers[i].parentNode) {
					tiers[i].parentNode.removeChild(tiers[i]);
				} else {
					if (cols.length) {
						for (var j=0; j<cols.length; j++) {
							tiers[i].removeChild(cols[j]);
						}
					}
					tiers[i].className = '';
				}
			}
		},

		removeGlobalModule: function ($module) {
			var moduleFeed = $module.data().tffeed,
				zone = $module.data().zone,
				feed;

			if (!zone) {
				return;
			}

			feed = triforceManifestFeed.zones[zone].feed;
			if (moduleFeed !== feed) {
				$module.empty();
				$module.removeData('tffeed tfrendered feedloaded scriptsloaded tfname tfscripthash tfdriver tflibs tfmethod tfstatic');
				$module.removeAttr('data-tffeed data-tfrendered data-tfstatic data-tfdriver data-tflibs data-feedloaded data-scriptsloaded class');
			}

		},

		createZones: function(zones) {
			for (var key in zones) {
				var zone = zones[key],
					zoneName = zone.zone,
					isGlobal = false;

				if (this.globalZones.indexOf(zoneName) >= 0) {
					isGlobal = true;
					this.addGlobalZone(zone);
					continue;
				}

				if (!isGlobal && zoneName.indexOf('_') < 0)  {
					w.Triforce.getMediator().message({'type':'warning','message':'Zone ' + zoneName + ' seems to be invalid.  It cannot be placed on the page'});
					continue;
				}
				var placement = this.getModulePlacement(zoneName);
				var module = this.placeModule(zoneName, placement);
				this.addModuleAttributes(module, zone);
				this.addPriority(zone.priority, zoneName, module);
				if (!module.attr('data-tfstatic') || module.attr('data-tfstatic') !== true) {
					if (zone.feedData != null) {
						w.Triforce.getMediator().trigger('triforce:feedloaded', zone.feed, zone.feedData, module);
					}
					else {
						if (!module.data('tffeed'))
							w.Triforce.getMediator().trigger('triforce:feedloaded', zone.feed, zone.feedData, module);
						else
							w.Triforce.getMediator().trigger('triforce:loadfeed', module.data('tffeed'), module);
					}
				}
				else {
					if (zone.feedData != null) {
						module.data('tffeed',zone.feed);
						w.Triforce.getMediator().trigger('triforce:feedloaded', zone.feed, zone.feedData, module);
					}
					module.trigger('triforce:module:feedLoaded');
				}
			}
			this.sortGlobalZones();
			this.createGlobalZones();
		},
		addGlobalZone: function(zone) {
			this.globalZoneList[this.globalZoneList.length] = zone;
		},

		addPriority: function(priority, zone, $module) {
			if (!this.priorityList[priority]) {
				this.priorityList[priority] = [];
			}
			this.priorityList[priority].push({
				'zone': zone,
				'module': $module,
				'uid': $module.data('uid')
			});
		},

		getModulePlacement: function(zone) {
			var tier = zone.split('_')[0].replace(/(t|tier)/ig, ''),
				column = zone.split('_');

			if (column.length === 2) {
				column = '1';
			} else {
				column = column[1].replace(/(c)/ig, '');
			}

			return {
				'tier': tier,
				'column': column
			};
		},
		placeModule: function(zone, placement) {
			var currentTierName = 'tier_' + placement.tier,
				currentColName = 't' + placement.tier + '_' + placement.column + 'c',
				tier = document.getElementById(currentTierName),
				col = document.getElementById(currentColName),
				zoneDiv = document.getElementById(zone);

			// Create the tier and column, if needed.
			if (!tier) {
				var tiers = this.contentHolder[0].querySelectorAll('[id^="tier_"]'),
					tierNumber;

				tier = document.createElement('div');
				tier.id = currentTierName;

				for (var i = 0, tiersCount = tiers.length; i < tiersCount; i++) {
					// Get tier number from tier name
					tierNumber = parseInt(tiers[i].id.replace('tier_', ''), 10);

					if (tierNumber > placement.tier) {
						tiers[i].parentNode.insertBefore(tier, tiers[i]);
						break;
					} else if (i == tiersCount - 1) {
						tiers[i].parentNode.insertBefore(tier, tiers[i].nextSibling);
					}
				}
				//There was no tiers on the page. Inserting into content Holder
				if (!document.getElementById(currentTierName)) {
					tier =  this.contentHolder[0].insertBefore(tier, this.contentHolder[0].lastElementChild);
				}
			} else {
				if (this.getColumnCount(tier) > 1) {
					tier.className = 'tier_' + this.getColumnCount(tier) + '_col';
				}
				else {
					tier.className = '';
				}
			}
			if (!col) {
				col = document.createElement('div');
				col.id = 't' + placement.tier + '_' + placement.column + 'c';
				tier.appendChild(col);
				if (this.getColumnCount(tier) > 1) {
					tier.className = 'tier_' + this.getColumnCount(tier) + '_col';
				}
				else {
					tier.className = '';
				}
			}

			// Check to see if we already have this zone.
			if (zoneDiv && zoneDiv.getAttribute('data-tfstatic') !== 'true') {
				var newZone = this.createZoneDiv(zone);

				zoneDiv.parentNode && zoneDiv.parentNode.replaceChild(newZone, zoneDiv);
				zoneDiv = newZone;
			}
			if (!zoneDiv) {
				zoneDiv = this.createZoneDiv(zone);
				col.appendChild(zoneDiv);
			}

			return $(zoneDiv);
		},

		createZoneDiv: function (zone) {
			var zoneDiv = document.createElement('div');

			zoneDiv.setAttribute('data-zone', zone);

			return zoneDiv;
		},

		getUniqId: function() {
			var id = 0;
			return function() {
				return id++;
			};
		},

		addModuleAttributes: function(module, zone) {

			module.data('uid', this.getUniqId());

			if (module.attr('data-tfstatic') && module.attr('data-tfstatic') === 'true') {
				if (zone.mobile && zone.mobile === true && window.Triforce.getMediator().isMobile()) {
					module.empty();
					module.removeAttr('data-tfstatic');
				} else {
					module.attr({
						'data-tfpriority': zone.priority,
						'data-tfmethod': 'triforce_v1',
						'data-tffeed': zone.feed
					});
					module.data('tfscripthash', zone.scriptHash);
					return;
				}

			}

			if (this.languagePreferences) {
				module.empty();
				module.removeAttr('data-tfstatic');
			}

			module.addClass('triforce-module');

			if (zone.version && zone.version == "V3") {
				module.data('tfversion', '3');
				module.data('tfname', zone.moduleName);
				module.data('tfscripthash', zone.scriptHash);
				module.attr('data-tfdriver', zone.driver);
				if (zone.mobile && zone.mobile === true && window.Triforce.getMediator().isMobile()) {
					if (zone.feed.indexOf('?') >= 0) {
						zone.feed += '&mobile=true';
					} else {
						zone.feed += '?mobile=true';
					}
				}
			}

			if (this.languagePreferences) {
				if (zone.feed.indexOf('?') >= 0) {
					zone.feed += '&lang=' + this.languagePreferences;
				} else {
					zone.feed += '?lang=' + this.languagePreferences;
				}
			}

			module.attr({
				'data-tffeed': zone.feed,
				'data-tfmethod': zone.method,
				'data-tfpriority': zone.priority,
				'data-tfloading': true,
				'data-tfreload': zone.reload
			});
			module.data('tffeed', zone.feed);
			if (zone.libraries !== null) {
				var libraries = zone.libraries,
					libsString = '',
					hashString = '';

				module.data('tfdriver', zone.moduleDriver);
				if (zone.template)  {
					module.data('tftemplate', zone.template);
				}
				for (var index = 0; index < libraries.length; index++) {
					libsString += libraries[index].script + ',';
					hashString += libraries[index].hash + ',';
				}
				module.data('tflibs', libsString);
				module.data('tflibshash', hashString);
			}
		},
		sortGlobalZones: function() {
			this.globalZoneList.sort(function(a, b) {
				if (a.zone.indexOf('menu') || b.zone.indexOf('footer')) {
					return -1;
				}
				if (a.zone.indexOf('footer') || b.zone.indexOf('menu')) {
					return 1;
				}
				return 0;
			});
		},
		createGlobalZones: function() {
			var $zone, zone, zoneName;

			for (var key in this.globalZoneList) {

				zone = this.globalZoneList[key];
				zoneName = zone.zone;
				$zone = $('#' + zoneName);

				if (this.languagePreferences || $zone.currentLanguage != this.languagePreferences) {
					$zone.empty();
					$zone.removeData('tffeed tfrendered feedloaded scriptsloaded');
					$zone.removeAttr('data-tffeed data-tfrendered data-tfstatic data-tfdriver data-tflibs data-feedloaded data-scriptsloaded class');

					if (zone.feed && zone.feed.indexOf('?') >= 0) {
						zone.feed += '&lang=' + this.languagePreferences;
					} else {
						zone.feed += '?lang=' + this.languagePreferences;
					}
				}

				// Checking whether or not this module is registered.
				if ($zone.length && !w.Triforce.getMediator().isModuleRegistered(zoneName, zone.feed, zone.moduleDriver, zone.libraries)) {
					if (!$zone.data('tfstatic')) {
						$zone.empty();
						$zone.removeData('tffeed tfrendered feedloaded scriptsloaded');
						$zone.removeAttr('data-tffeed data-tfrendered data-tfstatic data-tfdriver data-tflibs data-feedloaded data-scriptsloaded class');
					}
				}
				w.Triforce.getMediator().registerModule(zoneName, zone.feed, zone.moduleDriver, zone.libraries);

				if (!$zone.length) {
					if (zoneName.indexOf('menu') >= 0 || zoneName.indexOf('report') >= 0) {
						if (!this.contentHolder.parent().find('.header #' + zoneName).length) {
							if (this.contentHolder.parent().find('.header').length) {
								$zone = $('<div id="' + zoneName + '"/>').prependTo(this.contentHolder.parent().find('.header'));
							} else {
								$zone = $('<div id="' + zoneName + '"/>').prependTo(this.contentHolder);
							}
						}
					} else if (zoneName.indexOf('header') >= 0) {
						$zone = $('<div id="' + zoneName + '"/>').prependTo(this.contentHolder);
					} else if (zoneName.indexOf('footer') >= 0) {
						$zone = $('<div id="' + zoneName + '"/>').appendTo(this.contentHolder.parent());
					} else {
						$zone = $('<div id="' + zoneName + '"/>').appendTo(this.contentHolder);
					}
				}

				if ($zone.data('tfrendered') === true) {
					// We don't need to take action - this module is rendered.
					$zone.removeAttr('data-tfpriority');
				} else {
					$zone.attr('data-zone', zoneName);
					this.addModuleAttributes($zone, zone);
					this.addPriority(zone.priority, zoneName, $zone);
					if (!$zone.attr('data-tfstatic') || $zone.attr('data-tfstatic') !== true) {
						if (zone.feedData !== null) {
							w.Triforce.registerFeedLoaded(zone.feed, zone.feedData, $zone);
						} else {
							w.Triforce.queueFeedLoad($zone.data('tffeed'), $zone);
						}
					} else {
						w.Triforce.getMediator().trigger('triforce:module:feedloaded', $zone);
					}
				}

				$zone.currentLanguage = this.languagePreferences;
			}
		},
		getColumnCount: function(tier) {
			var nodes = tier.childNodes,
				count = 0;
			if (nodes.length) {
				for (var i=0; i<nodes.length; i++) {
					if (typeof (nodes[i].tagName) != 'undefined' && nodes[i].tagName.toLowerCase() == 'div') {
						count++;
					}
				}
			}

			return count;
		},
		clearBodyCSS: function() {
			var classes = this.$body.attr('class');

			if (classes) {
				classes = classes.split(' ');
				for (var i in classes) {
					if (classes[i].indexOf('from_page') >= 0){
						this.$body.removeClass(classes[i]);
						$('#' + classes[i].replace('from_page_', '')).remove();
					}
				}
			}

            if ($('#color_scheme').length) {
                if ($('#color_scheme').attr('data-setup')) {
                    $('#color_scheme').removeAttr('data-setup');
                } else {
                    $('#color_scheme').remove();
                }
            }
		},
		addBodyCSS: function (feed) {

            if (feed.css) {
                var css = feed.css, pageId = feed.id;
                if (window.Triforce.config.CSSHelperDriverName && window.Triforce.config.CSSHelperPackage) {
                    w.Triforce.scriptManager.loadStandaloneScript(window.Triforce.config.CSSHelperPackage, function() {
                        var driver = new window['$Crabapple']['TriforceHelper_' + window.Triforce.config.CSSHelperDriverName]();
                        driver.init(css, pageId);
                    });
                } else {
                    var prefix = '.from_page_' + pageId,
                        style = document.createElement('style');

                    this.$body.addClass('from_page_' + pageId);

                    style.type = 'text/css';
                    style.id = pageId;
                    style.innerHTML = (this.getCSSContents(css, prefix));
                    document.head.appendChild(style);
                }
            }

            if (feed.supplemental && feed.supplemental.colors && feed.supplemental.colors.colors) {
                var colorScheme = feed.supplemental.colors.colors, s = document.createElement('style'), content = '';

                s.type = 'text/css';
                s.id = 'color_scheme';
                for (var selector in colorScheme) {
                    content += ' .' + selector + ' { ' + 'color:' + colorScheme[selector] + ' } ';
                    content += ' .' + selector + '_background { ' + 'background-color:' + colorScheme[selector] + ' } ';
                }
            }


		},
		getCSSContents: function(css, prefix) {
			var contents = '@media screen and (min-width: 1200px) {',
				selectorsList = '#background_holder';

			if (triforceManifestFeed.CMSTitle.match(/player/i)) {
				selectorsList = '.player';
			}

			if (css.pageBackgroundImage) {
				if (!css.pageBackgroundColor) css.pageBackgroundColor = 'transparent';
				contents += prefix + ' ' + selectorsList + ' {';
				contents += 'background: ' + css.pageBackgroundColor + ' url(' + css.pageBackgroundImage + ') no-repeat top center !important;';
				contents += '}';
			}

			contents += '}';
			return contents;
		},
		fetchLegacyPriorities: function() {
			var self = this;
			this.priorityList = {};

			if ($('[data-tfpriority]').length) {
				$('[data-tfpriority]').each(function() {
					var t = $(this);
					self.addPriority(t.attr('data-tfpriority'), t.attr('data-zone'), t);
					if (!t.attr('data-tffeed')) t.data('feedloaded', 'true');
				});
				return this.priorityList;
			} else {
				return false;
			}
		}
	});
}) (jQuery, window);



(function($,w) {
	$Crabapple.TriforceMediator = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforceMediator, {
		listeners: {},
		registeredModules: {},
		waitTimes: {'priority':1000, 'helper':3000},
		triforceDebugEnabled: false,
		triforceDebug: {},
		triforcePageReady: false,
		triforcePageUrl: '',
        triforceInitialLoad: true,
		on: function(eventNames, callback) {
			eventNames = eventNames.split(' ');
			for (var i = 0, len = eventNames.length; i < len; i++) {
				eventNames[i] = eventNames[i].toLowerCase();
				this.listeners[eventNames[i]] = this.listeners[eventNames[i]] || [];
				this.listeners[eventNames[i]].push(callback);
			}
		},
		trigger:function(eventName) {
			if (!arguments || !arguments.length) return;

			eventName = eventName.toLowerCase();

			if (!this.listeners[eventName] || !this.listeners[eventName].length) {
				this.message({'type':'debug', 'message':'No listener is registered for ' + eventName});
				return;
			}

			for (var i = 0, len = this.listeners[eventName].length; i < len; i++) {
				this.listeners[eventName][i](arguments);
			}
		},
		init: function() {
			this.initializeDebug();
			this.initializeEvents();
		},
		initializeDebug: function() {
			if (document.cookie.indexOf('crabappleAuthorization') >= 0) {
				this.triforceDebugEnabled = true;
				this.triforceDebug = new window.$Crabapple.TriforceDebug_v1();
				this.triforceDebug.init();
			}
            else if (typeof(triforceDebugOverride) != 'undefined' && triforceDebugOverride == true) {
                this.triforceDebugEnabled = true;
                this.triforceDebug = new window.$Crabapple.TriforceDebug_v1();
                this.triforceDebug.init();
            }
		},
		initializeEvents: function() {
			this.initializePageEvents();
			this.initializeFeedEvents();
			this.initializeScriptEvents();
			this.initializeModuleEvents();
			this.initializeErrorEvents();
            this.initializeStorageEvents();
            this.initializeMonitorEvents();
		},
		debugEnabled: function() {
			if (window.Triforce.config.debug && window.Triforce.config.debug != 'false') return true;
			
			if (this.triforceDebugEnabled === true) {
				return this.triforceDebug.debugEnabled();
			}
			return false;
		},
		initializePageEvents: function() {
			var self = this;
            this.on('triforce:complete', function() {
                self.message({'type':'message', 'message':':: Triforce:complete - all modules rendered ::.'});
            });
			this.on('triforce:pagestartload', function() {
				self.message({'type':'message', 'message':'Triforce Page started loading.'});
			});
			this.on('triforce:pageredirect', function() {
				self.message({'type':'message', 'message':'Triforce Page got redirect.'});
			});
			this.on('triforce:pageloaded', function() {
				w.Triforce.getPageLoader().handleInitialLoad();
			});
			this.on('triforce:pageready', function() {
				w.Triforce.pageReady();
				self.trigger('triforce:message', {'type':'debug','message':'Triforce Page Ready'});
				self.triforcePageReady = true;
				self.triforcePageUrl = document.location.pathname;
			});
			this.on('triforce:rendercomplete', function() {
				self.message({
					'type': 'message',
					'message': 'Page render is complete.  All modules rendered'
				});
			});
			this.on('triforce:message', function(arg) {
				var data = null;
				if (arg && arg.length && arg.length === 2) {
					data = arg[1];
				}
				if (data !== null) {
					self.message(data);
				}
					
			});
			this.on('triforce:loadpage', function (arg) {
				var url = arg[1];
                self.triforceInitialLoad = false;
				self.triforcePageReady = false;
				w.Triforce.abortAllRequests();
				w.Triforce.priorityManager.clearState();
				self.triforcePageUrl = '';
				w.Triforce.loadPage(url);
			});
		},
		initializeFeedEvents: function() {
			this.on('triforce:loadfeed', function(arg) {
				if (arg.length && arg.length === 3) {
					w.Triforce.queueFeedLoad(arg[1], arg[2]);
				}
			});
			this.on('triforce:feedloaded', function(arg) {
				if (arg && arg.length && arg.length === 4) {
					w.Triforce.registerFeedLoaded(arg[1], arg[2], arg[3]);
				}
			});
		},
		initializeScriptEvents: function() {
			this.on('triforce:loadscript', function(arg) {
				if (arg.length && arg.length === 4 && !arg[2].scriptFetching) {
					w.Triforce.queueJavascript(arg[1], arg[2], arg[3]);
					arg[2].scriptFetching = true;
				}
			});
		},
		initializeModuleEvents: function() {
			var self = this;
			this.on('triforce:modulerender', function(arg) {
				var $module = arg[1];
				w.Triforce.getModuleRenderer().renderModule($module);
			});
            this.on('triforce:module:process', function (arg) {
                var wrapper = arg[1],
                    info = arg[2],
                    hashList;

                hashList = typeof(btoa) === 'function' ? btoa(hashList) : hashList;

                w.Triforce.layoutManager.addModuleAttributes(wrapper, info);

                if (!info.feedData) {
                    w.Triforce.getMediator().trigger('triforce:loadfeed', info.feed, wrapper);
                } else {
                    w.Triforce.getMediator().trigger('triforce:feedloaded', info.feed, {result: info.feedData}, wrapper);
                }
                w.Triforce.getMediator().trigger('triforce:loadscript', info.moduleName, wrapper, hashList);
            });

			this.on('triforce:module:render', function(arg) {
				var module = arg[1];
				
				w.Triforce.getPageLoader().hideActivityIndicator();
				w.Triforce.getModuleRenderer().moduleReady(module);
			});
			this.on('triforce:module:fail', function(arg) {
				var module = arg[1];
				$(module).remove();
			});
			this.on('triforce:module:scriptsloaded', function(arg) {
				var module = arg[1];
				module.data('scriptsloaded', 'true');
				if (module.data('feedloaded') === 'true') {
					self.trigger('triforce:module:render', module);
				}
			});
			this.on('triforce:module:feedloaded', function(arg) {
				var module = arg[1];
				module.data('feedloaded', 'true');
				if (module.data('scriptsloaded') === 'true') {
					self.trigger('triforce:module:render', module);
				}
			});
			this.on('triforce:priority:removemodule', function(arg){
				var module = arg[1];
				w.Triforce.getPriorityManager().removeModule(module);
			});
		},
		initializeErrorEvents: function() {
			var self = this;
			this.on('triforce:pageerror', function(arg) {
				var event, data;
				if (arg && arg.length && arg.length === 2) {
					event = arg[0];
					data = arg[1];
				} else {
					event = arg[0];
				}
				self.message({'type':'error', 'message': data});
			});
			this.on('triforce:legacyload', function(arg) {
				w.Triforce.loadLegacyPage();
			});
		},
        initializeStorageEvents: function() {
            // nada
        },
        initializeMonitorEvents: function() {
            var self = this;
            w.digitalData = {};
            if (w.Triforce.config && w.Triforce.config.monitorEnabled) {
                this.on('triforce:triggermonitor', function(arg) {
                    var event, data;
                    if (arg && arg.length && arg.length == 2) {
                        data = arg[1];
                        if (typeof(_satellite) != 'undefined') {
                            self.message({'type':'message', 'message':'Triggering ' + data + ' monitor event'});
                            _satellite.track(data);
                        }
                    }
                });

                this.on('triforce:monitorPageChange', function(arg) {
                    w.digitalData = {
                        page: {
                            pageURL: w.location.href
                        },
                        user: {
                            loginSocial: 'logged out',
                            loginTVE: 'logged out'
                        }
                    };
                    self.trigger('triforce:triggermonitor', 'pageChange');
                });

                this.on('triforce:monitorContentClick', function(arg) {
                    w.digitalData = {
                        page: {
                            pageURL: w.location.href
                        },
                        user: {
                            loginSocial: 'logged out',
                            loginTVE: 'logged out'
                        }
                    };
                    if (arg && arg.length && arg.length == 2) {
                        w.digitalData.content = {
                            module: arg[1]
                        };
                        self.trigger('triforce:triggermonitor', 'contentClick');
                    } else if (arg && arg.length && arg.length == 3) {
                        w.digitalData.content = {
                            module: arg[1],
                            franchise: arg[2]
                        };
                        self.trigger('triforce:triggermonitor', 'contentClick');
                    }


                });

                this.on('triforce:monitorContentShare', function(arg) {
                    if (arg && arg.length && arg.length == 3) {
                        w.digitalData = {
                            page: {
                                pageURL: w.location.href
                            },
                            user: {
                                loginSocial: 'logged out',
                                loginTVE: 'logged out'
                            },
                            content: {
                                shareContentName: arg[1],
                                shareContentProvider: arg[2]
                            }
                        };

                        self.trigger('triforce:triggermonitor', 'contentShare');
                    }

                });

                this.on('triforce:monitorVideoStart', function(arg) {
                    if (arg && arg.length && arg.length == 2) {
                        w.digitalData = {
                            page: {
                                pageURL: w.location.href
                            },
                            user: {
                                loginSocial: 'logged out',
                                loginTVE: 'logged out'
                            },
                            content: {
                                videoName: arg[1]
                            }
                        };
                        self.trigger('triforce:triggermonitor', 'videoStart');
                    }

                });

                this.on('triforce:monitorVideoComplete', function(arg) {
                    if (arg && arg.length && arg.length == 2) {
                        w.digitalData = {
                            page: {
                                pageURL: w.location.href
                            },
                            user: {
                                loginSocial: 'logged out',
                                loginTVE: 'logged out'
                            },
                            content: {
                                videoName: arg[1]
                            }
                        };
                        self.trigger('triforce:triggermonitor', 'videoComplete');
                    }
                });
            }
        },
		storeValue: function(key, value) {
			w.Triforce.getStorageManager().storeValue(key, value);
		},
		getValue: function(key) {
			return w.Triforce.getStorageManager().getValue(key);
		},
		storeObject: function(key, obj) {
			w.Triforce.getStorageManager().storeObject(key, obj);
		},
		getObject: function(key) {
			return w.Triforce.getStorageManager().getObject(key);
		},
		storeSharedObject: function(key, obj, expiry) {
			w.Triforce.getStorageManager().setSharedObject(key, obj, expiry);
		},
		getSharedObject: function(key) {
			return w.Triforce.getStorageManager().getSharedObject(key);
		},
		initialLoad: function() {
            return this.triforceInitialLoad;
        },
		message: function(message) {
			if (this.debugEnabled()) {
				if (console && console.log && message.type && message.message) {
					message.message = new Date().toLocaleString() + ' - ' + message.message;
					switch (message.type) {
						case 'message':
							console.debug(message.message);
							break;
						case 'warning':
							console.warn(message.message);
							break;
						case 'debug':
							console.debug(message.message);
							break;
						case 'error':
							console.error(message.message);
							if (message.exception) {
								console.error(message.exception);
							}
							break;
						default:
							console.log(message.message);
					}
				}
			}
		},
		getFeedData: function(feedUrl) {
			return w.Triforce.getFeedData(feedUrl);
		},
        isMobileStored: null,
		isMobile: function() {
			if (this.isMobileStored === null) {
                var c = $.cookie('btg_device');
                if (c != null && c.length) {
                    if (c.indexOf('1') > 0) this.isMobileStored = true;
                }
                if (this.isMobileStored === null) {
                    this.isMobileStored = navigator.userAgent.match(/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone/i) != null;
                }
            }
            return this.isMobileStored;
		},
		isIOS: function() {
			return navigator.userAgent.match(/(iPod|iPhone|iPad)/);
		},
		isIPad: function() {
			return navigator.userAgent.match(/(iPad)/);
		},
		isAndroid: function() {
			return navigator.userAgent.match(/(andriod|Andriod)/);
		},
		registerModule: function(zone, feed, driver, libraries) {
			var moduleObj = {
				'zone': zone,
				'feed': feed,
				'driver': driver,
				'libraries': libraries
			};
			this.registeredModules[zone] = moduleObj;
		},
		isModuleRegistered: function(zone, feed, driver, libraries) {
			if (!this.registeredModules[zone]) return false;

			var moduleObj = this.registeredModules[zone];

			if (moduleObj.feed == feed && moduleObj.driver == driver) {

				if (this.libraryMatch(libraries, moduleObj.libraries)) {
					return true;
				}

			} else {
				return false;
			}
			return false;
		},
		libraryMatch: function(source, target) {
			if (source.length == target.length) {
				for (var i in source) {
					if (source[i] != target[i]) return false;
				}
				return true;
			}
			return false;
		}
	});
})(jQuery, window);



(function($, w) {
	$Crabapple.TriforceModuleRenderer = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforceModuleRenderer, {

		init: function() {},

		moduleReady: function(module) {
			var feedData = (module.data('tffeed')) ? w.Triforce.getMediator().getFeedData(module.data('tffeed')) : null,
				driver = module.data('tfdriver');


			if (module.data('tfrendered') === true) {
				// This module is already rendered
				w.Triforce.getMediator().trigger('triforce:priority:removemodule', module);
				w.Triforce.getMediator().message({
					'type': 'message',
					'message': 'Module ' + driver + ' is already rendered'
				});
				return;
			}

			if (!module.data('scriptsloaded')) {
				return;
			}
			try {
				if (driver) {
					if (!window.$Crabapple['TriforceModule_' + driver]) {
						// not loaded yet - let's try again soon.
						return;
					}

					if (window.$Crabapple['TriforceModule_' + driver].parentController) {
						this.inheritController('$Crabapple.TriforceModule_' + driver);
					}

					var moduleDriver = new window.$Crabapple['TriforceModule_' + driver]();
					moduleDriver.init(module, feedData);
					w.Triforce.getMediator().trigger('triforce:module:rendered', module);
                    w.Triforce.getMediator().trigger('triforce:priority:removemodule', module);
				} else {
					w.Triforce.getMediator().message({
						'type': 'error',
						'message':'Module has no driver - ' + module.attr('data-zone')
					});
				}
			} catch (e) {
				console.log(e.stack);
				w.Triforce.getMediator().message({
					'type': 'error',
					'message': 'Module driver is invalid - ' + module.attr('data-zone') + ' driver was ' + driver,
					'exception': e
				});
				w.Triforce.getMediator().trigger('triforce:module:fail', module);
			}
		},

		renderModule: function($module) {
			var data = $module.data(),
				mediator = w.Triforce.getMediator();
			
			if (!$module.length || data.zone === undefined) {
				mediator.trigger('triforce:priority:removemodule', $module);
				return;
			}

			if (!$('[data-zone="' + data.zone + '"]').length) {
				mediator.trigger('triforce:priority:removemodule', $module);
				return;
			}

			mediator.message({
				'type': 'message',
				'message': 'Rendering module in ' + data.zone + ' with priority ' + data.tfpriority
			});
			
			if (data.scriptsloaded === 'true') {
				if (data.feedloaded === 'true') {
					mediator.trigger('triforce:module:render', $module);
				}
				return;
			}
			if (data.tfversion && data.tfversion == '3') {
				var scriptList = data.tfname,
					hashList = data.tfscripthash + data.tfdriver;
				if (typeof(btoa) == 'function') hashList = btoa(hashList);
				mediator.trigger('triforce:loadscript', scriptList, $module, hashList);
			} else if (data.tflibs && data.tflibs.length) {
				var scriptList = data.tflibs,
					hashList = data.tflibshash + data.tfdriver;
					if (data.tfscripthash) hashList = data.tfscripthash + data.tfdriver;

				if (typeof(btoa) == 'function') {
					hashList = btoa(hashList);
				}

				mediator.trigger('triforce:loadscript', scriptList, $module, hashList);
			} else {
				mediator.trigger('triforce:module:scriptsloaded', $module);
			}
		},

		inheritController: function(controllerName) {
			var Controller,
				parentController,
				extension;

			controllerName = controllerName.split('.');
			Controller = window[controllerName[0]][controllerName[1]];

			if (typeof Controller !== 'function') {
				parentController = this.inheritController(Controller.parentController);
				extension = Controller.extension;
				Controller = window[controllerName[0]][controllerName[1]] = function () {};
				$Crabapple.extend(parentController, Controller, extension);
			}

			return Controller;
		}
	});
}) (jQuery, window);



(function($,w) {
	$Crabapple.TriforcePageLoader = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforcePageLoader, {
		activityIndicator: null,
		previousPage: '',
		currentPage: '',
		init: function() {
			var self = this;
			this.activityIndicator = $('#activityIndicator');
			this.previousPage = w.location.href;
			this.currentPage = w.location.href;
			this.addWindowEvents();
		},
		handleInitialLoad: function() {
			var self = this;
			this.activityIndicator.fadeIn(100);
			if (typeof(triforceManifestFeed) == 'undefined' || triforceManifestFeed == '') {
				var feedURL = window.Triforce.config.manifestFeed + '?url=' + encodeURIComponent(w.location.href);
				$.getJSON(feedURL, function(response) {
					triforceManifestFeed = response.manifest;
					if (triforceManifestFeed === false) {
						
						w.Triforce.getPageLoader().hideActivityIndicator();
						w.Triforce.getMediator().trigger('triforce:legacyload');
					}
					else {
						w.Triforce.getMediator().trigger('triforce:pageready');
					}
                });
				return;
			}
			if (triforceManifestFeed) {
				triforceManifestFeed = triforceManifestFeed.manifest;
				w.Triforce.getMediator().trigger('triforce:pageready');
			}
			else {
				w.Triforce.getMediator().trigger('triforce:errornomanifest');
			}
		},
		hideActivityIndicator: function() {
			this.activityIndicator.fadeOut(100);
		},
		loadPage: function(url, pageStatus) {
			var self = this,
				additionalParams = '';
			if (url.substr(0, 15) == 'javascript:void') return;
			if (url.match(/#/)) return;
			if (url.match(/^\//)) {
				url = 'http://' + w.location.host + url;
			}
			url = url.replace('#', '');

			if (triforceManifestFeed == false) {
				window.location.href = url;
				return;
			}

			if (typeof($.cookie) == 'function') {
				if ($.cookie('crabappleInformation')) {
					var ci = JSON.parse($.cookie('crabappleInformation'));
					if (ci.modes && ci.modes.manifest) {
						additionalParams = '&currentManifest=' + ci.modes.manifest;
					}
				}
			}

			w.Triforce.getMediator().trigger('triforce:pagestartload');
			if (this.handlePushState(url) || this.checkPageStatus(pageStatus)) {
				if (this.manifestAjax) {
					this.manifestAjax.abort();
				}
				this.activityIndicator.fadeIn(100);
				this.previousPage = w.location.href;
				var feedURL = window.Triforce.config.manifestFeed + "?url=" + encodeURIComponent(url);
				this.manifestAjax = $.getJSON(feedURL + additionalParams, function(response) {
					var newLocationURL;

					self.manifestAjax = null;
					triforceManifestFeed = response.manifest;
					if (triforceManifestFeed == false) {
						window.location.reload();
						return;
					}
					if (triforceManifestFeed.type == 'redirect' && triforceManifestFeed.newLocation) {
						if (triforceManifestFeed.newLocation.url) {
							newLocationURL = triforceManifestFeed.newLocation.url;
						} else {
							newLocationURL = triforceManifestFeed.newLocation;
						}

						self.updateHistoryState(newLocationURL);
						w.Triforce.loadPage(newLocationURL, {
							eventFired: 'redirect'
						});

						w.Triforce.getMediator().trigger('triforce:pageredirect');
						return;
					} else {
						if (triforceManifestFeed.title) {
							document.title = triforceManifestFeed.title;
						}
						if (triforceManifestFeed.CMSTitle) {
							document.body.id = triforceManifestFeed.CMSTitle.replace(/\s/g, '_').replace(/[@\.\[\]\(\)]/g, '')
								.replace(/__/g, '_').toLowerCase();
						}
						if (document.body.className.indexOf('triforce_rendered') === -1) {
							document.body.className = document.body.className + ' triforce_rendered';
						}
						w.Triforce.getMediator().trigger('triforce:pageready');
					}
				});
			} else {				
				if (document.location.href !== url) {
					document.location.href = url;
				}
			}
		},
		handlePushState: function(url) {
			if (w.history && w.history.pushState) {
				if (url != w.location.href) {
					var state = {
						'state':encodeURIComponent(url)
					};
					try {
						history.pushState(state, '', url);
					} catch (e) {
						return false;
					}

					return true;
				}
				else { // refresh url
                    //Added this to allow for the triforce module integration tests to work as they were causing this clause to be hit making their tests impossible to run
                    // but you need to check if that exists.  It might not.
                    if(typeof (TriforceConfiguration) != 'undefined' && !TriforceConfiguration.disabledSamePageReload) {
                        window.location.reload();
                    }
				}
			}
			return false;
		},
		updateHistoryState: function (url) {
			if (w.history && w.history.replaceState) {
				history.replaceState({
					'state': encodeURIComponent(url)
				}, '', url);
			}
		},
		checkPageStatus: function (pageStatus) {
			if (pageStatus) {
				if (pageStatus.eventFired && pageStatus.eventFired.match(/redirect|popstate/)) {
					return true;
				}
			}
			return false;
		},
		addWindowEvents: function() {
			var self = this,
				isTriforcePage = (typeof(triforceManifestFeed) == 'undefined' || !triforceManifestFeed) ? (false) : (true);
			$(window).on('popstate', function(event) {
				if (self.currentPage == location.href && self.currentPage == self.previousPage) return;
				self.currentPage = '';
				if (isTriforcePage) {
					w.Triforce.loadPage(location.href, {
						eventFired: 'popstate'
					});
				} else {
					window.location.href = location.href;
				}

			});
		}
	});
}) (jQuery,window);



(function($,w) {
	$Crabapple.TriforcePriorityManager = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforcePriorityManager, {
		PRIORITY_TIMEOUT: 0,
		ATTEMPT_TIMEOUT: 0,
		waitTime: 0,
		priorities: [],
		modulesLeft: 0,
		processingModules: [],
		numberAttempts: 0,
        modulesToBeRendered: 0,

		init: function () {
			this.PRIORITY_TIMEOUT = window.Triforce.config.priorityTimeout;
			this.ATTEMPT_TIMEOUT = window.Triforce.config.stragglersTimeout;
            this.checkIsPageLoaded();
		},

		startRenderPriorities: function (priorities) {
			this.priorities = priorities;
			this.waitTime = this.PRIORITY_TIMEOUT;
			this.sortPriorities();

			//give more time for rendering only module
			if (this.priorities.length === 1 && this.priorities[0].modules.length === 1) {
				this.waitTime = this.ATTEMPT_TIMEOUT;
			}

			this.renderModulesByPriority(this.priorities.shift());
		},

		sortPriorities: function() {
			var sorted = [],
				priority;

			for (var i in this.priorities) {
				sorted.push(i);
			}

			sorted.sort(function(a,b) {
				return a - b;
			});

			for (i = 0; i < sorted.length; i += 1) {
				priority = {
					'priority': sorted[i],
					'modules': this.priorities[sorted[i]],
					'iteration': 0
				};
				sorted[i] = priority;
			}

			this.priorities = sorted;
		},

		renderModulesByPriority: function(priority) {
			this.processingModules = this.processingModules.concat(priority.modules);
			this.modulesLeft += priority.modules.length;
            if(this.modulesLeft > this.modulesToBeRendered){
                this.modulesToBeRendered = this.modulesLeft;
            }
			this.triggerLoadModules(priority.modules);
		},

		triggerLoadModules: function (moduleList) {
			var _this = this,
				len = moduleList.length;

			for (var i = 0; i < len; i += 1) {
				w.Triforce.getMediator().trigger('triforce:modulerender', moduleList[i].module);
			}

			this.timeout = w.setTimeout(function() {
				_this.nextPriority();
			}, this.waitTime);

		},

		removeModule: function ($module) {
			var len = this.processingModules.length,
				uid = $module.data('uid');

			for (var i = 0; i < len; i += 1) {
				if (this.processingModules[i] && this.processingModules[i].uid === uid) {
					this.processingModules[i] = null;
					this.modulesLeft -= 1;
				}
			}

			if (this.modulesLeft === 0) {
				this.processingModules = [];
				this.nextPriority();
			}
		},

		nextPriority: function() {
			w.clearTimeout(this.timeout);

			if (this.priorities.length) {
				this.renderModulesByPriority(this.priorities.shift());
			} else {
				this.waitTime = (this.numberAttempts + 1) * this.ATTEMPT_TIMEOUT;
				if (this.processingModules.length) {
					this.tryLoadAgain();
				} else {
					this.clearState();
                    w.Triforce.getMediator().trigger('triforce:rendercomplete');
				}
			}
		},

        checkIsPageLoaded: function(){
            var self = this;

            w.Triforce.getMediator().on('triforce:module:rendered',function(){
                self.modulesToBeRendered--;
                if(self.modulesToBeRendered < 1){
                    w.Triforce.getMediator().trigger('triforce:complete');
                    self.modulesToBeRendered = 0;
                }
            });
        },

		clearProcessingModules: function () {
			var len = this.processingModules.length,
				cleared = [];

			for(var i = 0; i < len; i +=1) {
				if (this.processingModules[i]) {
					cleared.push(this.processingModules[i]);
				}
			}

			this.processingModules = cleared;

		},

		tryLoadAgain: function() {
			if (this.numberAttempts < 3) {
				this.clearProcessingModules();
				this.triggerLoadModules(this.processingModules);
				this.numberAttempts += 1;
			} else {
				window.Triforce.getMediator().trigger('triforce:message', {
					'type':'message',
					'message':'Module rendering failed 3 times. Increasing timeout.'
				});
				this.waitTime += 500;
				this.numberAttempts = 0;
				this.clearProcessingModules();
				this.triggerLoadModules(this.processingModules);
			}
		},

		modulePriorityFailed: function() {
			var len = this.processingModules.length,
				zoneList = '';

			for (var i = 0; i < len; i += 1) {
				if (this.processingModules[i]) {
					zoneList += this.processingModules[i].zone + ', ';
					this.processingModules[i].module.remove();
				}
			}
			this.clearState();
			w.Triforce.getMediator().message({
				'type': 'warning',
				'message': 'Some modules failed to render - the zones were ' + zoneList
			});
			w.Triforce.getMediator().trigger('triforce:rendercomplete');
		},

		clearState: function () {
			w.clearTimeout(this.timeout);
			this.waitTime = this.PRIORITY_TIMEOUT;
			this.priorities = [];
			this.modulesLeft = 0;
			this.processingModules = [];
			this.numberAttempts = 0;
		}

	});
}) (jQuery, window);



(function($,w) {
	$Crabapple.TriforceScriptManager = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforceScriptManager, {
		feeds: {},
		scripts: {},
		queuedScripts: {},
		feedRequests: {},
		init: function() {
		},
		queueFeedLoad: function(feedURL, module) {
			var self = this;

			if (this.getFeedData(feedURL) != null) {
				w.Triforce.getMediator().trigger('triforce:module:feedloaded', module);
				return;
			}
			else if (feedURL == '' || feedURL == null) {
				w.Triforce.getMediator().trigger('triforce:module:feedloaded', module);
				return;
			}
			
			this.feedRequests[feedURL] = $.getJSON(feedURL, function(response) {
				self.feedRequests[feedURL] = null;
				w.Triforce.getMediator().trigger('triforce:feedloaded', feedURL, response, module);
			});
		},
		registerFeedLoaded: function(feedURL, feedData, module) {
			this.feeds[feedURL] = feedData;
			w.Triforce.getMediator().trigger('triforce:module:feedloaded', module);
		},
		getFeedData:function(feedURL) {
			if (this.feeds[feedURL]) return this.feeds[feedURL];
			return null;
		},
		queueJavascript: function(scriptList, module, hashList) {
			if (typeof(scriptList) == "string") {
				scriptList = scriptList.split(",");
				if (typeof(hashList) != "undefined") {
					hashList = hashList.split(",");
				}
			}
			var scripts = '',
				hash = '';
			var self = this;
			for(var index=0; index<scriptList.length; index++) {
				if (!this.scriptRegistered(scriptList[index]) && !this.scriptQueued(scriptList[index])) {
					// prepend scripts string
					scripts += (scripts == '') ? ('') : (',');
					scripts += scriptList[index];

					// prepend hashes string
					if (hashList && hashList[index]) {
						hash += hashList[index] + ",";
					}
					this.queuedScripts[scriptList[index]] = 1;
				}
			}
			if (scripts === '') {
				this.checkAllScriptLoaded(scriptList, module);
				return;
			}
			var scriptURL = window.Triforce.config.scriptConcatenator + scripts;
			var script = document.createElement('script');
			script.async = 'async';
			script.type = 'text/javascript';
			script.src = scriptURL + '?' + hash;
			script.onload = function(_,isAbort) {
				if (!script.readyState || /loaded|complete/.test(script.readyState)) {
					if (isAbort) {
						return;
					} else {
						self.registerJavascript(scripts);
						self.checkAllScriptLoaded(scriptList, module);
					}
				}
			};
			script.onerror = function(e) {
				w.Triforce.getMediator().trigger('triforce:message', {'type':'error','message':'Script failed to load at ' + scriptURL});
			}
			$('head')[0].appendChild(script);
		},
		registerJavascript: function(script) {
			this.unqueueScripts(script);
			var scriptArray = script.split(',');
			for (var i=0; i<scriptArray.length; i++) {
				this.scripts[scriptArray[i]] = 1;
			}
		},
		checkAllScriptLoaded: function (scriptList, module) {
			var i = 0,
				len = scriptList.length,
				_this = this;

			for (i; i < len; i += 1) {
				if (!this.scriptRegistered(scriptList[i])) {
					setTimeout(function() {
						_this.checkAllScriptLoaded(scriptList, module);
					}, 100);
					return;
				}
			}

			w.Triforce.getMediator().trigger('triforce:module:scriptsloaded', module);
		},
		scriptRegistered:function(script) {
			if (this.scripts[script]) return true;
			return false;
		},
		scriptQueued: function(script) {
			if (this.queuedScripts[script]) return true;
			return false;
		},
		unqueueScripts: function(scripts) {
			var scriptList = scripts.split(",");
			for (var i=0; i<scriptList.length; i++) {
				if (this.queuedScripts[scriptList[i]] == 1) this.queuedScripts[scriptList[i]] = 0;
			}
		},

		unqueueAllScripts: function () {
			this.queuedScripts = {};
		},

		abortAllFeedRequests: function () {
			for (var i in this.feedRequests) {
				if (this.feedRequests[i]) {
					this.feedRequests[i].abort();
				}
			}
			this.feedRequests = {};
		},
		loadStandaloneScript: function(script, callback) {
			var self = this;
			if (this.scriptRegistered(script)) {
				callback();
			} else {
				var scriptURL = window.Triforce.config.scriptConcatenator + script,
					scriptElement = document.createElement('script');
				scriptElement.async = 'async';
				scriptElement.type = 'text/javascript';
				scriptElement.src = scriptURL;
				scriptElement.onload = function(_,isAbort) {
					if (!scriptElement.readyState || /loaded|complete/.test(scriptElement.readyState)) {
						if (isAbort) {
							return;
						} else {
							self.registerJavascript(script);
							callback();
						}
					}
				};
				script.onerror = function(e) {
					w.Triforce.getMediator().trigger('triforce:message', {'type':'error','message':'Script failed to load at ' + scriptURL});
				}
				$('head')[0].appendChild(scriptElement);
			}
		}
	});
}) (jQuery,window);



(function($,w) {
	$Crabapple.TriforceStorageManager = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforceStorageManager, {
		storageEnabled: false,
		storage: null,
		indexedDB: null,
		indexedDBEnabled: false,
		dbName: 'TriforceDB',
		objectStores: [{
			'name': 'feeds',
			'keyPath': 'hash'
		}],

		init: function() {

			if (this.storageEnabled) return;

			try {
				if (w.localStorage && this.isLocalStorageEnabled()) {
					this.storage = w.localStorage;
					this.storageEnabled = true;
				} else {
					this.addCookiesFallback();
				}
			} catch (e) {
				w.Triforce.getMediator().trigger('triforce:message', {
					type: 'error',
					message: 'Error occurred trying access to localStorage',
					exception: e
				});

				this.addCookiesFallback();
			}
		},

		isLocalStorageEnabled: function() {
			var testKey = 'test', s = window.localStorage;
			try {
				s.setItem(testKey, '1');
				s.removeItem(testKey);
				return true;
			} catch (e) {
				return false;
			}
			return false;
		},

		addCookiesFallback: function () {
			this.storage = {
				setItem: function (key, data) {
					$.cookie(key, data);
				},

				getItem: function (key) {
					return $.cookie(key);
				}
			};
			this.storageEnabled = true;
		},

		storeValue: function(key, value) {
			if (!this.storageEnabled) return false;
			key = this.sanitizeKey(key);
			try {
				this.storage.setItem(key, value);
			} catch (e) {
				w.Triforce.getMediator().trigger('triforce:message', {'type':'error', 'message':'Storing ' + key + ' in local storage failed', 'exception':e});
			}
		},
		storeObject: function(key, obj) {
			if (!this.storageEnabled) return false;
			key = this.sanitizeKey(key);
			try {
				this.storage.setItem(key, JSON.stringify(obj));
			} catch (e) {
				w.Triforce.getMediator().trigger('triforce:message', {'type':'error', 'message':'Storing ' + key + ' in local storage failed', 'exception':e});
			}
		},
		getValue: function(key) {
			if (!this.storageEnabled) return false;
			key = this.sanitizeKey(key);
			return this.storage.getItem(key);
		},
		getObject: function(key) {
			if (!this.storageEnabled) return false;
			key = this.sanitizeKey(key);
			try {
				var obj = JSON.parse(this.storage.getItem(key));
				return obj;
			} catch (e) {
				w.Triforce.getMediator().trigger('triforce:message', {'type':'error', 'message':'Retrieving ' + key + ' from local storage failed', 'exception':e});
				return false;
			}
			return false;
		},
		sanitizeKey: function(key) {
			return 'triforce_' + key + '|' + window.location.hostname;
		},

		setSharedObject: function(key, value, expiry) {
			var now = new Date().getTime(),
				domain = this.getDomain(),
				expiryDays,
				storageObject;
			now = parseInt(now / 1000); // seconds
			key = domain + '|' + key;
			if (!expiry) {
				expiry = 0;
			}
			if (expiry != 0) {
				expiryDays = expiry / 60 / 24;
				expiry = now + (60 * expiry);
			}
			storageObject = {
				'value':value,
				'expiry':expiry
			}
			if (expiry != 0) {
				$.cookie(key, JSON.stringify(storageObject), {
					path:'/',
					domain:domain,
					expires:expiryDays
				});
			} else {
				$.cookie(key, JSON.stringify(storageObject), {
					path:'/',
					domain:domain,
					expires:1000
				});
			}

		},
		getSharedObject: function(key) {
			var domain = this.getDomain(),
				value;
			key = domain + '|' + key;

			value = $.cookie(key);
			if (!value) {
				return null;
			} else {
				value = JSON.parse(value);
				return value.value;
			}
		},
		getDomain: function() {
			var hostname = window.location.hostname,
				hostnameParts = hostname.split('.');

			if (hostnameParts.length >= 2) {
				var tld = hostnameParts.pop(),
					domain = hostnameParts.pop();

				return domain + '.' + tld;

			}
			else {
				if (hostname.indexOf('local') >= 0) {
					return 'local';
				}
			}
			return 'unknown';
		},

		initIndexedDB: function () {
			if ('indexedDB' in w) {
				this.indexedDB = {};
				this.indexedDBEnabled = true;
				this.openIndexedDB();
			}
		},

		openIndexedDB: function () {
			if (!this.indexedDBEnabled) {
				return false;
			}

			var _this = this,
				version  = 1,
				request;

			_this.indexedDB[this.dbName] = null;

			request = w.indexedDB.open(this.dbName, version);

			request.onupgradeneeded = function (e) {
				_this.handleUpgradeNeeded(e);
			};

			request.onsuccess = function (e) {
				_this.handleOpenDBSuccess(e);
			};

			request.onerror = this.handleIndexedDBError;

		},

		addObject: function (object, objectStoreName) {
			var db = this.indexedDB[this.dbName],
				transaction = db.transaction([objectStoreName], 'readwrite'),
				store = transaction.objectStore(objectStoreName),
				request = store.put(object),
				_this = this;

			request.onsuccess = function (e) {
				_this.handleAddObjectSuccess();
			};

			request.onerror = this.handleIndexedDBError;

		},

		handleAddObjectSuccess: function () {
			// TODO
		},

		handleOpenDBSuccess: function (e) {
			this.indexedDB[this.dbName] = e.target.result;
		},

		handleUpgradeNeeded: function (e) {
			var db = e.target.result;

			e.target.transaction.onerror = this.handleIndexedDBError;

			for (var i = 0; i < this.objectStores.length; i ++) {
				if (db.objectStoreNames.contains(this.objectStores[i].name)) {
					db.deleteObjectStore(this.objectStores[i].name);
				}

				db.createObjectStore(this.objectStores[i].name, {
					keyPath: this.objectStores[i].keyPath
				});
			}
		},

		handleIndexedDBError: function (e) {
			var errorMessage = 'Error occured working with endexedDB';

			w.Triforce.getMediator().trigger('triforce:message', {
				'type': 'error',
				'message': errorMessage,
				'exception': e
			});
		}

	});
}) (jQuery, window);



(function($) {
	$Crabapple.TriforceModule = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforceModule, {
		moduleElement: null,
		view: null,
		views: null,
		viewsListOrdered: null,
		helpers: null,
		feedResponse: null,
		name:'default',
		enhance: false,
		forceHide: false,
		init: function(element, feedData) {
			this.moduleElement = element;
			this.feedResponse = feedData;
			if (this.moduleElement.data('tfdriver')) {
				this.name = this.moduleElement.data('tfdriver');
			}

			this.initializeHelpers();

			this.initViewComponents();
			this.initView();

			this.moduleElement.data('tfrendered', true);
		},
		initView: function () {
			this.runViewInheritance();
			if (this.moduleElement.attr('data-tfstatic')) {
				this.enhanceModule();
			} else {
				this.drawModule();
			}
		},
		initViewComponents: function () {
			this.views = {};

			for (var viewName in this.viewNames) {
				this.views[viewName] = this.inheritView(this.viewNames[viewName]);
				this.views[viewName].init();
			}

			if (this.viewsListOrdered && this.viewsListOrdered.length) {
				var viewsList = this.viewsListOrdered,
					viewInfo,
					i, len;

				for (i = 0, len = viewsList.length; i < len; i++) {
					viewInfo = viewsList[i];
					this.views[viewInfo.name] = this.inheritView(viewInfo.viewName);
					this.views[viewInfo.name].init();
				}
			}
		},
		processOrderedViews: function (methodName) {
			var viewsList = this.viewsListOrdered,
				views = this.views,
				data = this.data,
				viewInfo,
				coreElement,
				i, len;

			if (viewsList) {
				for (i = 0, len = viewsList.length; i < len; i++) {
					viewInfo = viewsList[i];
					coreElement = viewInfo.parentView ? views[viewInfo.parentView].coreElement : this.view.coreElement;

					views[viewInfo.name][methodName](coreElement, data);
				}
			}
		},
		runViewInheritance: function () {
			//IE8 doesn't support getPrototypeOf
			var moduleController = Object.getPrototypeOf(this);

			if (!moduleController.viewName) {
				return;
			}

			this.view = this.inheritView(moduleController.viewName);
			this.view.init(this.moduleElement);
		},
		inheritView: function(fullViewName, recursiveDeep) {
			var view, parentView, viewName, extention;

			recursiveDeep = recursiveDeep || 0;
			viewName = fullViewName.split('.');
			view = window[viewName[0]][viewName[1]];

			if (typeof view === 'function') {
				return recursiveDeep ? view : new view();
			}
			if(view == null){
				window.Triforce.getMediator().trigger('triforce:message', {'type':'error','message':'Failed to load parent class for view: '+fullViewName});
			}
			parentView = this.inheritView(view.parentView, recursiveDeep + 1);
			extention = view.extention;
			view = function () {};
			$Crabapple.extend(parentView, view, extention);
			window[viewName[0]][viewName[1]] = view;
			return recursiveDeep ? view : new view();
		},
		prepareModuleElement: function() {
			this.moduleElement.removeClass('triforce-module');
			this.moduleElement.removeAttr('data-tfpriority');
			this.addClasses();
		},
		drawModule: function() {
			this.prepareModuleElement();
			this.initializeView();
			if (this.forceHide == true) {
				this.moduleElement.remove();
				return;
			}
			this.addEvents();
			this.addAds();
			this.addLinkHandler();
		},
		enhanceModule: function() {
			this.enhance = true;
			this.moduleElement.removeAttr('data-tfpriority');
			this.addEvents();
			this.addLinkHandler();
		},
		initializeView: function() {

		},
		initializeHelpers: function() {
			this.helpers = {};

			if (!this.helperNames) return;
			for (var i in this.helperNames) {
				this.helpers[i] = this.createHelper(this.helperNames[i]);
			}
		},
		createHelper: function(helper) {
			var helperName = helper.split('.'),
				tmpHelper = false;
			try {
				tmpHelper = new window[helperName[0]][helperName[1]]();
			} catch (e) {
				window.Triforce.getMediator().trigger('triforce:message', {'type':'error','message':'Error creating helper', 'exception':e});
			}
			return tmpHelper;

		},
		addEvents: function() {

		},
		addClasses: function() {
			var promo = null;
			if (this.feedResponse && this.feedResponse.result) {
				if (this.feedResponse.result.promo) {
					promo = this.feedResponse.result.promo;
				}
				if (this.feedResponse.result.promotion) {
					promo = this.feedResponse.result.promotion;
				}
			}
			this.moduleElement.addClass('module').addClass(this.name);

            if(promo && promo.promoType) {
                this.moduleElement.addClass(promo.promoType.toLowerCase());
            }
        },
		addAds: function() {
			if (this.moduleElement.find('[data-adsize]').length) {
				this.moduleElement.find('[data-adsize]').each(function() {
					if (typeof($Crabapple.TriforceModule_reporting_v1) == 'function' && typeof('mtvn') != 'undefined') {
						$Crabapple.TriforceModule_reporting_v1.prototype.placeAd($(this));
					}
				});
			}
		},
		addLinkHandler: function() {
			var self = this;

			if (!triforceManifestFeed || triforceManifestFeed === false) {
				return;
			}
			$(this.moduleElement).find('a').each(function() {
				// ignore notriforce links
				if ($(this).hasClass('notriforce')) return;
				// if validTriforceLinkMask is defined AND the link doesn't match the pattern, don't capture it
				if (window.TriforceExtraConfig && window.TriforceExtraConfig.validTriforceLinkMask && window.TriforceExtraConfig.validTriforceLinkMask instanceof RegExp) {
					if (this.href.match(window.TriforceExtraConfig.validTriforceLinkMask) === null) return;
				}
				$(this).on('click', self.linkHandler);
			});
		},
		linkHandler: function(event) {
			event.preventDefault();
			var href = $(this).attr('href');

			if (href.indexOf('#') === 0) {
				// on-page hash
				var anchor = $('a[name="' + href.substring(1) + '"]'),
					anchorPos = anchor.offset(),
					anchorName = anchor.attr('name');
				if (anchorPos && anchorPos.top) {
					// set the hash without jumping to the anchor
					anchor.attr('name','');
					document.location.hash = href;
					anchor.attr('name',anchorName);
					// smooth scroll to the anchor, adjusted for header
					$('html,body').animate({
						scrollTop: anchorPos.top - 50
					}, 300);
				} else {
					// the old-fashioned way; just in case
					document.location.hash = href;
				}
				return;
			}

			if( (href.indexOf('http') === 0 && href.indexOf(window.location.host) === -1) || href.indexOf('mailto:') === 0 ) {
				// another domain url
				document.location.href = href;
				return;
			} else {
				window.Triforce.getMediator().trigger('triforce:loadpage', href);
			}
		},

        renderSubModule: function (wrapper, info) {
            window.Triforce.getMediator().trigger('triforce:module:process', wrapper, info);
        }
	});
})(jQuery);



(function($) {
	$Crabapple.TriforceHelper = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforceHelper, {
		moduleElement: null,
		init: function (moduleElement) {
			this.moduleElement = $(moduleElement);
		}
	});
})(jQuery);



//TODO: Unfortunately all projects just include /triforce dir, not file by file
//      so usually MustacheView gets loaded before TriforceView, and we're getting
//      error. This way the MustacheView is inhereted only upon Module Controller initialization
//      Will be better to let projects add Triforce deps file by file, not the whole folder
$Crabapple.TriforceMustacheView = {
    'parentView': '$Crabapple.TriforceView',
    'extention': {
        /**
         * Module element that triforce has created for you.
         *
         * @type jQuery DOM object
         */
        moduleElement: null,

        /**
         * Core element, the root element for your module.
         *
         * @type jQuery DOM object
         */
        coreElement: null,

        /**
         * Reference to Mustache templates.
         * If string specified, View recognizes it as a namespace
         * and looks up for templates by that namespace
         *
         * @type {array} | {string}
         */
        templates: null,

        /**
         * Mustache template name that's one of the registered templates.
         *
         * @type {string}
         */
        templateName: null,

        /**
         * Initialization of the view.
         * Creates reference to Mustache templates through this.templates
         *
         * @param moduleElement
         */
        init: function(moduleElement) {
            if (!this.moduleElement) {
                this.moduleElement = moduleElement;
            }

            this.templates = $Crabapple.TriforceTemplates;
        },

        /**
         * Renders template, that's specified through templateName.
         * The template is taken from global templates pool
         *
         * @param templateName
         * @param data
         * @returns {string}
         */
        renderTemplate: function (templateName, data) {
            if (this.templates && this.templates[templateName]) {
                return this.templates[templateName].render(data, this.templates);
            }

            //TODO: log some message about referenced template not being registered
            return '';
        },

        /**
         * Renders the view.
         * This method is in charge of getting content outputted on the page.
         * TODO: maybe passing data and settings separated will make more sense
         *       but mustache takes 1 object as the root, so we reference to data
         *       as data.{#} in the template, but other settings/defaultValues will
         *       go without any wrapping object. Think about wrapping it up too(ex. settings.{#})
         *
         * @param data
         */
        render: function (data) {
            if (!this.templateName || !this.moduleElement) {
                //TODO: there should be some error log system, so we'd say in loud about an exception
                return false;
            }

            this.moduleElement.html(this.renderTemplate(this.templateName, data));

            return true;
        }
    }
};



(function($) {
	$Crabapple.TriforceView = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.TriforceView, {
		missingImage: (function () {
			if (config && typeof config.getMediaMissingImage === 'function') {
				return config.getMediaMissingImage();
			} else {
				return 'http://comedycentral.mtvnimages.com/images/cc_missing_v6.jpg';
			}
		})(),
		defaultQuality: 0.85,
		moduleElement: {},
        timezonesList: {
            'EST': -5
        },
		init: function(moduleElement) {
			if($.isEmptyObject(this.moduleElement)) {
				this.moduleElement = moduleElement;
			}
		},
		
		/**
		 * Appending dom
		 */
		appendDom: function(parent, element, attributes) {
			var $element = this.createDom(element, attributes);
			try {
				parent.append($element);
			} catch (e) {
				if (console && console.log) {
					console.log(e);
				}
			}
			return $element;
		},

		/**
		 * Replaces $oldChild with $newChild
		 * @returns $newChild
		 */
		replaceModuleElement: function ($oldChild, $newChild) {
			$oldChild[0].parentNode && $oldChild[0].parentNode.replaceChild($newChild[0], $oldChild[0]);

			return $newChild;
		},

		/**
		 * Creates module wrapper
		 * @returns jQuery object of moduleWrapper
		 */
		getModuleWrapper: function ($moduleElement, additionalClasses) {
		   var moduleWrapper = document.createElement($moduleElement[0].nodeName);

		   moduleWrapper.className = $moduleElement[0].className + ( additionalClasses ? ' ' + additionalClasses : '');

		   return $(moduleWrapper);
		},
		
		/**
		 * Creates DOM element
		 */
		createDom: function(elementType, attributes) {
			var newElement = document.createElement(elementType);
			if(attributes) {
				for(var key in attributes) {
					newElement.setAttribute(key, attributes[key]);
				}
			}
			
			return $(newElement);
		},
		
		
		/**
		 * TODO
		 */
		prependDom: function(parent, element, attributes) {
			var $element = this.createDom(element, attributes);
			try {
				parent.prepend($element);
			} catch (e) {
				if (console && console.log) {
					console.log(e);
				}
			}
			return $element;
		},
		
		appendImage: function (parent, image, autoload) {
			var imageHolder,
				imageInformation,
                queuedImage,
                triforceMediator;

			image = image || {};

			if (!autoload) {
				imageInformation = {
					original: {
						width: image.width,
						height: image.height,
						aspectRatio: image.height ? Math.round(image.width / image.height * 10) / 10 : null
					},
					src: image.url || this.missingImage,
					quality: this.defaultQuality
				};
                triforceMediator = window.Triforce.getMediator();

				imageHolder = this.appendDom(parent, 'div', {
					'data-info': JSON.stringify(imageInformation),
					'class': 'image_holder deferred'
				});

                queuedImage = {
                    'holder': imageHolder[0],
                    'info': imageInformation
                };

                imageHolder.on('loadImage', function () {
                    triforceMediator.trigger('triforce:loadqueuedimage', queuedImage);
                });
                triforceMediator.trigger('triforce:queueimage', queuedImage);

				return imageHolder;
			}

			return this.appendDom(parent, 'img', {
				src: image.url + '?quality=' + this.defaultQuality
			});
		},
		
		getDuration: function(duration) {
			var d = parseInt(duration),
				min = Math.floor(d / 60),
				sec = d - (60 * min);
			return min + ":" + ((sec < 10 ? '0' : '') + sec);
		},
		
		dateToString: function(timeStamp, format, timezone) {
			var time = parseInt(timeStamp,10);
			if(isNaN(time)){
				return timeStamp;
			}
			if((new Date(time)).getFullYear() == 1970){
				time = time * 1000;
			}
            if (timezone && this.timezonesList[timezone]) {
                time = this.getTimeInTimezone(time, timezone);
            }
			format = format || "m/d/Y";
			$Crabapple.utils.DateTime.currentDate = new Date( time );
			var result = $Crabapple.utils.DateTime.format(format);
			$Crabapple.utils.DateTime.currentDate = false;

			return result;
		},

        /**
         *
         * @param dateString - should follow RFC2822 format
         * @param format
         * @returns {String}
         */
        formatDateString: function (dateString, format) {
            if (dateString && format) {
                dateString = dateString.substr(0, dateString.length - 5); // Cut the timezone

                $Crabapple.utils.DateTime.currentDate = new Date(dateString);
                var result = $Crabapple.utils.DateTime.format(format);
                $Crabapple.utils.DateTime.currentDate = false;

                return result;
            }

            return dateString;
        },

        getTimeInTimezone: function (time, timezone) {
            var offsetDiff = this.timezonesList[timezone] - this.getFixedTimezoneOffset();

            return new Date(time + offsetDiff * 3600000/* 1hr = 60min = 3600s = 360000ms */);
        },

        getFixedTimezoneOffset: function () {
            var fullYear = new Date().getFullYear();

            // Fix offset with a possible DST change
            // Takes offset in January & July, takes max - this means that we just ignore DST
            return Math.max(new Date(fullYear, 0, 1).getTimezoneOffset(), new Date(fullYear, 6, 1).getTimezoneOffset()) / -60; // Offset is in minutes and inverted, need to get hrs
        },

		/**
		 * Skip module in selenium by specific condition
		 */
		forceHideByConditions : function() {
			var $module = $(this.moduleElement),
				rem_list = '';
			if($('body').data('removedModules')){
				rem_list = $('body').data('removedModules') + '::';
			}
			rem_list += $module[0].className;
			$('body').data('removedModules', rem_list);
		},

		/**
		 * Basic triforce link behaviour
		 */
		addLinkHandlers: function(wrap) {
			
		},
		addCssOverride: function(moduleName, cssOverrideObj){
			var styleTag = document.getElementById(moduleName + '_colorsPallete') || document.createElement('style'),
				css = '';

			styleTag.id = moduleName + '_colorsPallete';

			if(cssOverrideObj && !jQuery.isEmptyObject(cssOverrideObj)){

				for(var cssClass in cssOverrideObj){
					css += cssClass + '{';
					for(var cssRule in cssOverrideObj[cssClass]){
						css += cssRule + ':'+ cssOverrideObj[cssClass][cssRule] + ';'
					}
					css += '}'
				}

				styleTag.innerHTML = css;
				document.head.appendChild(styleTag);
			}
		}
	});
})(jQuery);


/* triforce.js */
(function($,w) {
	$Crabapple.Triforce = function() {};
	$Crabapple.extend($Crabapple.Class, $Crabapple.Triforce, {
		pageLoaderName: '$Crabapple.TriforcePageLoader',
		pageLoader: null,
		layoutManagerName: '$Crabapple.TriforceLayoutManager',
		layoutManager: null,
		scriptManagerName: '$Crabapple.TriforceScriptManager',
		scriptManager: null,
		feedManager: null,
		moduleRendererName: '$Crabapple.TriforceModuleRenderer',
		moduleRenderer:null,
		mediatorName: '$Crabapple.TriforceMediator',
		mediator: null,
		priorityManagerName: '$Crabapple.TriforcePriorityManager',
		priorityManager: null,
		storageManagerName: '$Crabapple.TriforceStorageManager',
		storageManager: null,
		imageBrokerName: '$Crabapple.TriforceImageBroker',
		imageBroker: null,
		firstLoad: true,
		config: null,
		defaultLanguage: 'eng',
		init: function() {
			this.initializeConfig();
			this.initializeMediator();
			this.initializeComponents();
			this.getMediator().trigger('triforce:pageloaded');
		},
		initializeConfig: function() {
			if (window.TriforceConfiguration) {
				this.config = window.TriforceConfiguration;
			} else {
				// Default configuration object
				this.config = {
					'debug':false,
					'priorityTimeout':300,
					'stragglersTimeout':3000,
					'manifestFeed':'/feeds/triforce/manifest/v2',
					'tierWrapper':false
				};
				if (typeof (config.getTriforceScriptLoader) == 'function') this.config.scriptConcatenator = config.getTriforceScriptLoader();
				if (typeof (config.getTriforceDebugEnabled) == 'function') this.config.debug = config.getTriforceDebugEnabled();
				if (typeof (config.getTriforceGlobalZones) == 'function') this.config.globalZones = config.getTriforceGlobalZones().split(',');
				if (typeof (config.getTriforceManifestFeed) == 'function') this.config.manifestFeed = config.getTriforceManifestFeed();
				if (typeof (config.getTriforcePriorityTimeout) == 'function') this.config.priorityTimeout = parseInt(config.getTriforcePriorityTimeout());
				if (typeof (config.getTriforceStragglersTimeout) == 'function') this.config.stragglersTimeout = parseInt(config.getTriforceStragglersTimeout());
				if (typeof (config.getTriforceHelpersCssPackage) == 'function') this.config.CSSHelperPackage = config.getTriforceHelpersCssPackage();
				if (typeof (config.getTriforceHelpersCssDriverName) == 'function') this.config.CSSHelperDriverName = config.getTriforceHelpersCssDriverName();
				if (typeof (config.getTriforceTierWrapper) == 'function') this.config.tierWrapper = config.getTriforceTierWrapper();
			}

			this.initializeLanguage();

		},
		initializeLanguage: function() {
			if (this.config.language) return;
			if (typeof($.cookie) == 'function') {
				var lp = $.cookie('languagePreferences');
				if (lp) {
					this.config.languagePreference = lp;
					if (lp.indexOf(',') >= 0) {
						lp = lp.split(',');
						this.config.language = lp[0];
					} else {
						this.config.language = lp;
					}
				}
			}
			if (!this.config.language) {
				this.config.language = this.defaultLanguage;
			}

		},
		initializeComponents: function() {
			this.initializePageLoader();
			this.initializeModuleRenderer();
			this.initializeScriptManager();
			this.initializeLayoutManager();
			this.initializePriorityManager();
			this.initializeStorageManager();
			this.initializeImageBroker();
		},
		initializePageLoader: function() {
			var pls = this.pageLoaderName.split('.');
			var namespace = pls[0];
			var moduleName = pls[1];
			this.pageLoader = new w[namespace][moduleName]();
			this.pageLoader.init();
		},
		initializeLayoutManager: function() {
			var lms = this.layoutManagerName.split('.');
			var namespace = lms[0];
			var moduleName = lms[1];
			this.layoutManager = new w[namespace][moduleName]();
			this.layoutManager.init();
		},
		initializeScriptManager: function() {
			var sms = this.scriptManagerName.split('.');
			var namespace = sms[0];
			var moduleName = sms[1];
			this.scriptManager = new w[namespace][moduleName]();
			this.scriptManager.init();
			this.feedManager = this.scriptManager;
		},
		initializeModuleRenderer: function() {
			var mrs = this.moduleRendererName.split('.');
			var namespace = mrs[0];
			var moduleName = mrs[1];
			this.moduleRenderer = new w[namespace][moduleName]();
			this.moduleRenderer.init();
		},
		initializeMediator: function() {
			var mms = this.mediatorName.split('.');
			var namespace = mms[0];
			var moduleName = mms[1];
			this.mediator = new w[namespace][moduleName]();
			this.mediator.init();
		},
		initializePriorityManager: function() {
			var pmn = this.priorityManagerName.split('.'),
				namespace = pmn[0],
				moduleName = pmn[1];
			this.priorityManager = new w[namespace][moduleName]();
			this.priorityManager.init();
		},
        initializeStorageManager: function() {
            var smn = this.storageManagerName.split('.'),
                namespace = smn[0],
                moduleName = smn[1];
            this.storageManager = new w[namespace][moduleName]();
            this.storageManager.init();
        },
		initializeImageBroker: function () {
			var smn = this.imageBrokerName.split('.'),
				namespace = smn[0],
				moduleName = smn[1];

			this.imageBroker = new w[namespace][moduleName]();
			this.imageBroker.init();
		},
		getMediator: function() {
			return this.mediator;
		},
		getPageLoader: function() {
			return this.pageLoader;
		},
		getModuleRenderer: function() {
			return this.moduleRenderer;
		},
		getPriorityManager: function() {
			return this.priorityManager;
		},
		getStorageManager: function() {
			return this.storageManager;
		},
		loadPage: function(url, pageStatus) {
			this.pageLoader.loadPage(url, pageStatus);
		},
		pageReady: function() {
			if (this.firstLoad) {
				this.firstLoad = false;
			} else {
				this.scrollToTop();
			}
            if (w.Triforce.config && w.Triforce.config.monitorEnabled) {
                w.Triforce.getMediator().trigger('triforce:monitorPageChange');
            }
			var priorities = this.layoutManager.startLayout();
			this.priorityManager.startRenderPriorities(priorities);
		},
		loadLegacyPage: function() {
			var priorities = this.layoutManager.fetchLegacyPriorities();
			if (priorities) {
				this.priorityManager.startRenderPriorities(priorities);
			}
		},
		queueFeedLoad: function(feedURL, module) {
			this.feedManager.queueFeedLoad(feedURL, module);
		},
		registerFeedLoaded: function(feedURL, feedData, module) {
			this.feedManager.registerFeedLoaded(feedURL, feedData, module);
		},
		getFeedData: function(feedURL) {
			return this.feedManager.getFeedData(feedURL);
		},
		queueJavascript: function (scripts, module, hashes) {
			this.scriptManager.queueJavascript(scripts, module, hashes);
		},
		moduleTimeout: function(module) {
			var message = 'Module ' + module.data('tfdriver') + ' failed rendering in zone ' + module.data('zone');
			this.getMediator().trigger('triforce:message', {'type':'warning', 'message':message});
		},
		scrollToTop: function() {
			$(window).scrollTop(0);
		},

		abortAllRequests: function () {
			this.scriptManager.abortAllFeedRequests();
			this.scriptManager.unqueueAllScripts();
		}
	});
}) (jQuery, window);

$(document).ready(function() {
	window.Triforce = new $Crabapple.Triforce();
	window.Triforce.init();
});
/* Script.js */
$(function() {
    var $body = $('body'),
        $backgroundHolder = $('#background_holder'),
        isTransitionSupported = 'webkitTransition' in $body[0].style || 'transition' in $body[0].style;

    function checkTVEAuth () {
        var tveAuthObject = window.Triforce.getStorageManager().getObject('tveStorage'),
            tveClass = 'tve_auth';

        if (tveAuthObject && tveAuthObject.authorized) {
            $body.addClass(tveClass);
        } else {
            $body.removeClass(tveClass);
        }
    }
    checkTVEAuth();
    window.Triforce.getMediator().on('triforce:rendercomplete', checkTVEAuth);

    // EXPANSION CODE
    $body
        .on('click', '.toggleable_module_trigger', function () {
            var contentDiv = $(this).closest('.toggleable_module');

            if (contentDiv.hasClass('open')) {
                collapseModule(contentDiv);
            } else {
                // If currently closed, hide all others, show self
                expandModule(contentDiv);
            }
        })
        .on('webkitTransitionEnd transitionend', '.toggleable_module_content', function (e) {
            if (e.originalEvent.propertyName === 'max-height' && e.target === this) {
                $(this).css('max-height', '');
            }
        });

    function collapseModule ($moduleElement) {
        var $content = $moduleElement.find('.toggleable_module_content');

        if (isTransitionSupported) {
            // Unfortunately we've to read property after we set it,
            // so browser will recalculate it and we'll be able to use transition
            $content.css('max-height', $content.height() || 'none')
                .css('max-height');
            $content.css('max-height', 0);
        }

        $moduleElement.removeClass('open').trigger('triforce:module_collapsed');
    }
    function expandModule ($moduleElement) {
        var $content = $moduleElement.find('.toggleable_module_content');

        if (isTransitionSupported) {
            $content.css('max-height', $content[0].scrollHeight || 'none');
        }

        $moduleElement.addClass('open').trigger('triforce:module_expanded');
    }

    //color picker to help translate the passed in colors for page and module series overrides
    window.$MTV = window.$MTV || {};
    window.$MTV.triforce = window.$MTV.triforce || {};
    window.$MTV.triforce.colorPicker = function() {

        var result = {
            'primary': false,
            'secondary': false,
            'tertiary': false,
            'darktheme': false
        };

        if(triforceManifestFeed
            && triforceManifestFeed.supplemental
            && triforceManifestFeed.supplemental.colors
            && triforceManifestFeed.supplemental.colors.colors) {

            if(triforceManifestFeed.supplemental.colors.colors.primary) {
                result.primary = triforceManifestFeed.supplemental.colors.colors.primary;
            }
            if(triforceManifestFeed.supplemental.colors.colors.secondary) {
                result.secondary = triforceManifestFeed.supplemental.colors.colors.secondary;
            }
            if(triforceManifestFeed.supplemental.colors.colors.tertiary) {
                result.tertiary = triforceManifestFeed.supplemental.colors.colors.tertiary;
            }

            if(triforceManifestFeed.supplemental.colors.colors.darkTheme) {
                result.darkTheme = true;
            }

        }

        return result;
    };

    // Set tier styles w/ the custom color. This only needs to happen once
    var primaryColor = window.$MTV.triforce.colorPicker().primary,
        darkTheme = window.$MTV.triforce.colorPicker().darkTheme,
        htmlString = "";

    // removing this in lieu of using .primary_background on the leaderboard.
    // if (primaryColor) htmlString += "#leaderboard { background-color: " + primaryColor + "}";
    if (darkTheme) htmlString += ".ent_p016_mtv #background_holder { background-color: #232323; }";

    if (htmlString != "") {
        var styleElement = document.createElement('style');
        styleElement.id = 'custom_page_style_colorsPallete';
        styleElement.innerHTML = htmlString;
        document.head.appendChild(styleElement);
    }


});

/* Script.js */
var MTVN = MTVN || {};
MTVN.conf = MTVN.conf || {};
MTVN.conf.sm4 = MTVN.conf.sm4 || {};
MTVN.conf.sm4.currentUserUcid = '';
MTVN.conf.sm4.staging = config.getFluxStaging() == true;
MTVN.conf.sm4.ucid = config.getFluxCommunityId();
MTVN.conf.sm4.fluxBaseHref = (MTVN.conf.sm4.staging) ? 'http://daapiak.flux-staging.com/' : 'http://daapiak.flux.com/';
/**
 * Get comments json feed by mgid
 */
MTVN.conf.sm4.requestContentFeed = function (mgid, func) {
    if (typeof mgid === 'undefined') return;

    $.ajax({
        url: config.getFluxBaseHref() + '/2.0/00001/JSON/' + config.getFluxCommunityId() + '/feeds/content/?q=' + mgid,
        dataType: 'jsonp',
        success: func,
        cache: true,
        jsonpCallback: mgid.replace(/[^A-Za-z0-9]/gi, '')
    });
};

MTVN.conf.sm4.widgets = {
    'smallUserBar': {
        'name': 'UserBar#4210',
        'opts': {
            displayMode: 'bottom right',
            responsive: {
                breakpoint: 0
            },
            elements: [{
                id: 'MyStuff',
                showThumbnail: true
            }]
        }
    },
    //@TODO: Remove this, once we switch header(m070) to 4.1.0
    'showFollow': {
        'name': 'Follow#4200',
        'opts': {
            mode: 'SiteFollow',
            title: '',
            displayTotalCounts: false,
            elements: [{
                id: 'flux',
                count: false,
                title: ''
            }]
        },
        'onLoad': function (widget) {
            // Preventing errors, but this is a crap...
            if (window.$Crabapple && typeof window.$Crabapple.onFollowWidgetLoad === 'function') {
                window.$Crabapple.onFollowWidgetLoad(widget);
            }
        }
    },
    // END TODO
    'headerShowFollow': {
        'name': 'Follow#4200',
        'opts': {
            markupPlaceholder: 'headerShowFollowMarkup',
            mode: 'SiteFollow',
            title: '',
            displayTotalCounts: false,
            elements: [{
                id: 'flux',
                count: false,
                title: '',
                placeholder: 'externalService1'
            }]
        }
    },
    'showFollowWithCustomMarkup': {
        'name': 'Follow#4200',
        'opts': {
            markupPlaceholder: 'showFollowMarkup',
            mode: 'SiteFollow',
            title: '',
            displayTotalCounts: false,
            elements: [{
                id: 'flux',
                count: false,
                title: '',
                placeholder: 'externalService1'
            }]
        }
    },
    'episodeShare': {
        'name': 'Share#4210',
        'opts': {
            markupPlaceholder: 'shareMarkup',
            elements: [
                {
                    id: 'Facebook',
                    type: 'fbshare',
                    count: true,
                    originalButton: false,
                    placeholder: 'externalService1'
                },
                {
                    id: 'Twitter',
                    placeholder: 'externalService2',
                    urlSettings: {
                        text: '',
                        related: 'MTV',
                        via: 'MTV',
                        count: true
                    }
                },
                {
                    id: 'MyEmail',
                    placeholder: 'externalService3'
                },
                {
                    id: 'Embed',
                    placeholder: 'externalService4'
                },
                {   id: 'Tumblr',
                    visible: true,
                    originalButton: false,
                    count: true,
                    placeholder: 'externalService6'
                }
            ]
        }
    },
    'videoShare': {
        'name': 'Share#4210',
        'opts': {
            markupPlaceholder: 'shareMarkup',
            elements: [
                {
                    id: 'Facebook',
                    type: 'fbshare',
                    count: true,
                    originalButton: false,
                    placeholder: 'externalService1'
                },
                {
                    id: 'Twitter',
                    placeholder: 'externalService2',
                    urlSettings: {
                        text: '',
                        related: 'MTV',
                        via: 'MTV',
                        count: true
                    }
                },
                {
                    id: 'MyEmail',
                    placeholder: 'externalService3'
                },
                {
                    id: 'Embed',
                    placeholder: 'externalService4'
                },
                {   id: 'Tumblr',
                    visible: true,
                    originalButton: false,
                    count: true,
                    placeholder: 'externalService6'
                }
            ]
        }
    },

    'listingShare': {
        'name': 'Share#4210',
        'opts': {
            markupPlaceholder: 'listingShareMarkup',
            elements: [
                {
                    id: 'Facebook',
                    type: 'fbshare',
                    count: false,
                    originalButton: false,
                    placeholder: 'externalService1'
                },
                {
                    id: 'Twitter',
                    placeholder: 'externalService2',
                    urlSettings: {
                        text: '',
                        related: 'Spike',
                        via: 'Spike',
                        count: 'none'
                    }
                },
                {
                    id: 'More',
                    placeholder: 'externalService3'
                }
            ]
        }
    },

    'comments': {
        'name': 'Comments',
        'opts': {
            contentId: '',
            title: '',
            updateRequestInterval: 30,
            includeGuestActivities: true,
            enableComments: true,
            // showPopularActivities: false
            sortingVisible: false
        },
        'onLoad': function(widget) {
            var commentsCounterClass = $('.comments.flux4Widget.flux4').data('commentscounterclass');

            if (commentsCounterClass != '') {
                function getCommentsNumber(mgid) {
                    MTVN.conf.sm4.requestContentFeed(mgid, function(data) {
                        if (data.NumberOfComments) {
                            $(commentsCounterClass).each(function() {
                                $(this).html(' (' + data.NumberOfComments + ')');
                            });
                        }
                        else {
                            $(commentsCounterClass).each(function() {
                                $(this).html(' (0)');
                            });
                        }
                    });
                }
                getCommentsNumber($('.comments.flux4Widget.flux4').data('mgid') + '&cacheDuration=100');
                widget.onCommented = function() {
                    getCommentsNumber($('.comments.flux4Widget.flux4').data('mgid') + '&cacheDuration=100');
                };
                widget.onDeleted = function() {
                    getCommentsNumber($('.comments.flux4Widget.flux4').data('mgid') + '&cacheDuration=100');
                };
            }

            // Focus on the comments widget once it is loaded
            var aim = $('body .ent_m002').offset().top;
            $('.toggleable_module_content').each(function() {
                if ($(this).offset().top < $('body .ent_m002').offset().top) {
                    aim -= $(this).height();
                }
            });
            aim -= 100;
            window.scrollTo(0, aim);
        }
    }
};
/* Controller.js */
// General Link Tracking Omniture Call
function autoLinkTrackEvent(promoName, destinationUrl, extraReportingObjs){
	var destinationUrl = (typeof destinationUrl != 'undefined' || destinationUrl=='') ? destinationUrl : 'no_destination_url';

	if (destinationUrl.substr(0,1) == '/') {
		destinationUrl = window.location.protocol + "//" + window.location.host + destinationUrl;
	}

	var _pageName = null;
	var _repCallObject = null;

	//because typeof seemed to always fail when used against the global variables...
	try{
		var _pageName = pageName;
		var _repCallObject = repCallObject;
	}catch(e){}
	if(_pageName === null){
		_pageName = 'pageName not found';
	}

	var promoName = promoName.toLowerCase();
	destinationUrl = destinationUrl.toLowerCase();
	if(_repCallObject === null) {
		_repCallObject = {
			prop8: 'undefined',
			eVar6: 'undefined'
		};
	}

	var show = _pageName.split('/')[1];

	baseReportingObj = {
		linkName:promoName,
		linkType:'o',
		prop8:show,
		prop25:promoName,
		prop26:promoName + '|' + _pageName,
		prop27:destinationUrl,
		eVar5:destinationUrl,
		eVar6:show,
		eVar7:promoName,
		eVar8:promoName + '|' + _pageName,
		eVar9:_pageName
	};

	if (typeof extraReportingObjs == 'object') {
		jQuery.extend(baseReportingObj, extraReportingObjs);
	}

	if (typeof(mtvn) != 'undefined') {
		mtvn.btg.Controller.sendLinkEvent(baseReportingObj);
	}
}

function shareWidgetTracking (shareService, linkValue, uniqueID) {
	if(typeof(pageName) == 'undefined'){
		var pageName = 'pageName not found';
	}

	var linkEventObj = {
		linkName:linkValue,
		linkType:'o',
		eVar60:pageName,
		eVar51:shareService,
		events:'event84'
	};

	if (typeof(uniqueID) != "undefined") {
		$.extend(linkEventObj, {eVar65:uniqueID});
	}

	if (typeof(mtvn) != 'undefined') {
		mtvn.btg.Controller.sendLinkEvent(linkEventObj);
	}
}

function shareBarLinkTracking (shareService, uniqueID) {
	var shareService = 'share_'+shareService,
		eVar65 = (typeof(eVar65) != "undefined")?eVar65.substr(4):document.title;

	/*if(typeof(pageName) == 'undefined'){
		var pageName = 'pageName not found';
	}*/

	var baseReportingObj = {
		linkName:'Community - Share',
		linkType:'o',
		eVar60:pageName,
		eVar65:eVar65,
		eVar51:shareService,
		events:'event84'
	};

	if (typeof uniqueID != 'undefined' &&  uniqueID != '') {
		eVar65Add = {"eVar65":uniqueID};
		jQuery.extend(baseReportingObj, eVar65Add);
	}

	if (typeof extraReportingObjs == 'object') {
		jQuery.extend(baseReportingObj, extraReportingObjs);
	}

	if (typeof(mtvn) != 'undefined') {
		mtvn.btg.Controller.sendLinkEvent(baseReportingObj);
	}
}


// Looks like this is how we do M002
function commentTracking(shareService) {
	var shareService = 'Community-Comment';
	var eVar65 =  $('.ent_m002 .comments').attr('data-mgid');
	if (typeof(mtvn) != 'undefined'){
		mtvn.btg.Controller.sendLinkEvent({
			linkName:'commenting',
			linkType:'o',
			events:'event88',
			evar60:pageName,
			evar65:eVar65,
			pev2:shareService
		});
	}
}

$(document).ready(function(){
	// autoLinkTrackEvent(promoName, destinationUrl, extraReportingObjs)

	var destinationUrl = "";
	var shareService = "embed";
	var $contentHolder = $('#content_holder');

    //M002
	$contentHolder.on('click', '.ent_m002 .toggleable_module_trigger', function(){
		destinationUrl = ($(this).closest('.toggleable_module').hasClass('open')) ? 'spike_flux_activity_header_collapse' : 'spike_flux_activity_header_expand';
		autoLinkTrackEvent('mtv_flux_activity', destinationUrl);
	});

    //M006 - Lives outside content holder
    $('body').on('click', '.ent_m006 a', function () {
        autoLinkTrackEvent('mtv_footer', this.href);
    });

    //M017 tracking
	$contentHolder.on('click', '.ent_m017 .share_wrapper .share li', function(){
        var link = $(this);
        var uniqueId = link.parents(".flux4.share_widget").attr("data-contenturi");

        if (link.hasClass("twitter")) shareService = "twitter";
        if (link.hasClass("facebook")) shareService = "facebook";
        shareBarLinkTracking(shareService, uniqueId);
	});

    //M018 tracking
	$contentHolder.on('click', '.ent_m018 .share_wrapper .share li', function(){
        var link = $(this);
        var uniqueId = link.parents(".flux4.share_widget").attr("data-contenturi");

        if (link.hasClass("twitter")) shareService = "twitter";
        if (link.hasClass("facebook")) shareService = "facebook";
        if (link.hasClass("tumblr")) shareService = "tumblr";
        shareBarLinkTracking(shareService, uniqueId);
	});
	//M028 Reporting done in module controller js

	//M045
	$contentHolder.on('click', '.ent_m045 a', function(){
		destinationUrl = $(this).attr('href');
		autoLinkTrackEvent('mtv_massive', destinationUrl);
	});

	//M046
	$contentHolder.on('click','.ent_m046 a', function(){
		destinationUrl = $(this).attr('href');
		autoLinkTrackEvent('mtv_announcement', destinationUrl);
	});

	//M051
	$contentHolder.on('click', '.ent_m051 a', function(){
		destinationUrl = $(this).attr('href');
		autoLinkTrackEvent('mtv_basicpromo', destinationUrl);
	});

    //M058 - Primetime TV Schedule
	$contentHolder.on('click', '.ent_m058 a', function(){
        destinationUrl = $(this).attr('href');
        autoLinkTrackEvent('mtv_tv_listings_watch', destinationUrl);
    });

	//M067 - Series Episode Horizontal
	$contentHolder.on('click', '.ent_m067 a', function(){
		destinationUrl = $(this).attr('href');
		autoLinkTrackEvent('mtv_series_episodes_horizontal', destinationUrl);
	});

	//M082 - Franchise Series Grid
	$contentHolder.on('click', '.ent_m082 a', function(){
		destinationUrl = $(this).attr('href');
		autoLinkTrackEvent('mtv_franchise_series_grid', destinationUrl);
	});

    //M100 - Featured Shows Grid
	$contentHolder.on('click', '.ent_m100 a', function(){
        destinationUrl = $(this).attr('href');
        autoLinkTrackEvent('mtv_featured_shows', destinationUrl);
    });

    //M101 - Series Clips Horizontal
	$contentHolder.on('click', '.ent_m101 a', function(){
        destinationUrl = $(this).attr('href');
        autoLinkTrackEvent('mtv_series_clips_horizontal', destinationUrl);
    });

	//M122
	$contentHolder.on('click', '.ent_m122 > .module_content a, .ent_m122 .s_buttons_buttonWrapper a', function(){
		destinationUrl = $(this).attr('href');
		autoLinkTrackEvent('mtv_text_container', destinationUrl);
	});

    //M150 - Shows AZ
	$contentHolder.on('click', '.ent_m150 a', function(){
        destinationUrl = $(this).attr('href');
        autoLinkTrackEvent('mtv_showsaz', destinationUrl);
    });

    //M151 - Featured Series Full Episodes Grid
	$contentHolder.on('click', '.ent_m151 a, .ent_m151 .L001_line_list_load-more', function(){
        destinationUrl = $(this).attr('href');
        if(destinationUrl === undefined) {
            destinationUrl = $(this).attr('data-feed');
        }
        autoLinkTrackEvent('mtv_all_fullepisode_grid', destinationUrl);
    });

	//M155 - ARC Trending Videos Grid
	$contentHolder.on('click', '.ent_m155 a', function(){
		destinationUrl = $(this).attr('href');
		autoLinkTrackEvent('mtv_trending_promo', destinationUrl);
	});

    //M156 - ARC Trending Videos Grid
    $contentHolder.on('click', '.ent_m156 a', function(){
        destinationUrl = $(this).attr('href');
        autoLinkTrackEvent('mtv_related_episodes_promo', destinationUrl);
    });

    //M163 - Related Shows Grid
	$contentHolder.on('click', '.ent_m163 a', function(){
        destinationUrl = $(this).attr('href');
        autoLinkTrackEvent('mtv_related_shows', destinationUrl);
    });

    //M164 - ARC Episodes Related Video Right Rail
	$contentHolder.on('click', '.ent_m164 a', function(){
        destinationUrl = $(this).attr('href');
        autoLinkTrackEvent('mtv_right_rail_promo', destinationUrl);
    });

    //M165 - All Cast Promo
    $contentHolder.on('click', '.ent_m165 a', function(){
        destinationUrl = $(this).attr('href');
        autoLinkTrackEvent('mtv_all_cast', destinationUrl); // link tracking
    });

    $contentHolder.on('click', '.ent_m165 .item_wrapper', function(){
        destinationUrl = 'mtv_all_cast_item_opened';
        autoLinkTrackEvent('mtv_all_cast', destinationUrl); // item opened
    });

    $contentHolder.on('click', '.ent_m165 .close', function(){
        destinationUrl = 'mtv_all_cast_item_closed';
        autoLinkTrackEvent('mtv_all_cast', destinationUrl); // item closed
    });

    //M169 - ARC Videos Related Video Right Rail
	$contentHolder.on('click', '.ent_m169 a', function(){
        destinationUrl = $(this).attr('href');
        autoLinkTrackEvent('mtv_right_rail_video_promo', destinationUrl);
    });

});
