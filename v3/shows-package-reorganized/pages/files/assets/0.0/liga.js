/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
	'use strict';
	function supportsProperty(p) {
		var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
			i,
			div = document.createElement('div'),
			ret = p in div.style;
		if (!ret) {
			p = p.charAt(0).toUpperCase() + p.substr(1);
			for (i = 0; i < prefixes.length; i += 1) {
				ret = prefixes[i] + p in div.style;
				if (ret) {
					break;
				}
			}
		}
		return ret;
	}
	var icons;
	if (!supportsProperty('fontFeatureSettings')) {
		icons = {
			'zoom-in': '&#xe600;',
			'zoom-out': '&#xe601;',
			'add': '&#xe602;',
			'close': '&#xe603;',
			'pause': '&#xe604;',
			'play': '&#xe605;',
			'remove': '&#xe606;',
			'open': '&#xe612;',
			'next': '&#xe616;',
			'prev': '&#xe617;',
			'thumbnail': '&#xe61c;',
			'menu': '&#xe643;',
			'foursquare': '&#xe622;',
			'info': '&#xe624;',
			'question': '&#xe625;',
			'locked': '&#xe626;',
			'mtv': '&#xe627;',
			'mtv2': '&#xe61f;',
			'vh1': '&#xe629;',
			'viacom': '&#xe62a;',
			'email': '&#xe62b;',
			'refresh': '&#xe63a;',
			'search': '&#xe63b;',
			'settings': '&#xe63c;',
			'embed': '&#xe63d;',
			'facebook': '&#xe63e;',
			'google-plus': '&#xe63f;',
			'instagram': '&#xe640;',
			'pinterest': '&#xe641;',
			'rss': '&#xe642;',
			'share': '&#xe63;',
			'tumblr': '&#xe644;',
			'twitter': '&#xe645;',
			'vine': '&#xe646;',
			'alert': '&#xe651;',
			'expand': '&#xe60b;',
			'success': '&#xe65e;',
			'0': 0
		};
		delete icons['0'];
		window.icomoonLiga = function (els) {
			var classes,
				el,
				i,
				innerHTML,
				key;
			els = els || document.getElementsByTagName('*');
			if (!els.length) {
				els = [els];
			}
			for (i = 0; ; i += 1) {
				el = els[i];
				if (!el) {
					break;
				}
				classes = el.className;
				if (/icon-/.test(classes)) {
					innerHTML = el.innerHTML;
					if (innerHTML && innerHTML.length > 1) {
						for (key in icons) {
							if (icons.hasOwnProperty(key)) {
								innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
							}
						}
						el.innerHTML = innerHTML;
					}
				}
			}
		};
		window.icomoonLiga();
	}
}());