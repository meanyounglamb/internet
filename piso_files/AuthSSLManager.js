/**
 * Auth SSL Manager
 * @author 박난하
 * @date 2010-01-05
 */
var AuthSSLManager = {
	/**
	 * processing...
	 */
	'Block': false
	/**
	 * SSL Processor URL
	 */
	, 'SSL_URL': 'https://login2.cafe24ssl.com/crypt/AuthSSLManager.php'
	/**
	 * MSIE: Request-URI Too Large 문제
	 */
	, 'LENGTH_LIMIT': 1970
	/**
	 * weave
	 * @param Object param
	 * @return void
	 */
	, 'weave': function(param) {
		var p = this.setParam(param)
			, qs = p.join('&')
			, source = __Base64__.encode(encodeURIComponent(qs)).replace(/\+/g, '%2b')
			, aURL = [], URL
			, id = 'c' + this.ranx();

		var ret = this.chunk(source);
		for( var i in ret ) {
			if( ret.hasOwnProperty(i) == false ) continue;
			var p2 = [];
			p2.push('token=' + ret[i]['token']);
			p2.push('com=' + ret[i]['com']);
			p2.push('id=' + id);

			URL = this.SSL_URL + '?' + p2.join('&');
			aURL.push(URL);
		}

		if( aURL.length == 1 ) { // normal
			var URL = this.SSL_URL + '?' + p.join('&');
			this.request(URL);
		} else { // chunk
			this.request2(aURL);
		}
	}
	/**
	 * chunk string
	 * @param String source
	 * @return Array
	 */
	, 'chunk': function(source) {
		var p = [], com, input, maxlength = this.LENGTH_LIMIT, output = '';
		while(source) {
			input = source.substring(0, maxlength);
			source = source.substring(maxlength);

			if( !source ) com = 1;
			else com = 0;

			p.push({
				'token': input
				, 'com': com
			});
		}

		return p;
	}
	/**
	 * random
	 * @param Number num
	 * @return Number
	 */
	, 'ranx': function(num) {
		return ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18);
	}
	/**
	 * 파라메터 세팅
	 * @param Object param
	 * @return Array
	 */
	, 'setParam': function(param) {
		var p = [];
			p.push('auth_mode=' + param['auth_mode']);
			p.push('auth_callbackName=' + param['auth_callbackName']);
		switch(param['auth_mode']) {
			case 'encrypt':
				var aEle = param['aEleId'], o, p2 = {}, v;
				for( var i in aEle ) {
					v = this.getValue(aEle[i]);
					if( v == -1 ) continue;
					p2[aEle[i]] = this.getValue(aEle[i]);
				}
				p.push('auth_string=' + encodeURIComponent(__JSON.stringify(p2)));
				break;
			case 'decrypt':
				p.push('auth_string=' + encodeURIComponent(param['auth_string']));
				break;
		}

		return p;
	}
	/**
	 * 엘리먼트 종류별 값 가져오기
	 * @param String id
	 * @return
	 */
	, 'getValue': function(id) {
		var o, type;
		o = document.getElementById(id);
		if( o != null ) {
			type = o.getAttribute('type');
		} else {
			o = document.getElementsByName(id);
			if( o.length == 0 ) return -1;
			type = o[0].getAttribute('type');
		}

		var val;
		switch(type) {
			default:
			case 'text':
				o = document.getElementById(id);
				if( o == null ) {
					o = document.getElementsByName(id);
					val = o[0].value;
				} else {
					val = o.value;
				}
				break;
			case 'radio':
			case 'checkbox':
				val = this.checkbox({'name': id, 'mode': 'val'});
				break;
		}
		return val;
	}
	/**
	 * jsonp
	 * @param String URL
	 * @return void
	 */
	, 'request': function(URL) {
		URL = URL + '&dummy=' + (+new Date());
		var o = document.createElement('script');
			o.setAttribute('type', 'text/javascript');
			o.setAttribute('id', 'AuthSSLContainer');
			o.setAttribute('charset', 'utf-8');
			o.setAttribute('src', URL);
		document.getElementsByTagName('head').item(0).appendChild(o);
	}
	/**
	 * chunk request
	 * @param Array aURL
	 * @return void
	 */
	, 'request2': function(aURL, notShift, URL, callbackURL) {
		notShift = notShift || false;
		var remove = function() {
			var o = document.getElementById('AuthSSLContainer');
			if( o ) o.parentNode.removeChild(o);
		};
		var isComplete = function() {
			var o = document.getElementById('AuthSSLContainer');
			if( o && o.getAttribute('rel') ) {
				return true;
			} else {
				return false;
			}
		};

		if( notShift == false ) {
			var URL = aURL.shift(), callbackURL = aURL[0];
		}
		var script     = document.createElement('script');
		script.type    = 'text/javascript';
		script.id      = 'AuthSSLContainer';
		script.charset = 'utf-8';

		if( callbackURL ) {
			if (script.readyState){  //IE
				script.onreadystatechange = function(aURL){
					if (script.readyState == "loaded" || script.readyState == "complete"){
						script.onreadystatechange = null;

						if( isComplete() == false ) {
							remove();
							this.request2(aURL, true, URL, callbackURL);
							return;
						}

						remove();
						this.request2(aURL);
					}
				}.__bind__(this, aURL);
			} else {  //Others
				script.onload = function(aURL){
					if( isComplete() == false ) {
						remove();
						this.request2(aURL, true, URL, callbackURL);
						return;
					}

					remove();
					this.request2(aURL);
				}.__bind__(this, aURL);
			}
		}
		script.src = URL;
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	/**
	 * error
	 * @param String
	 * @return void
	 */
	, 'isError': function(str) {
		if( typeof str == 'object' ) return false;
		if( str.indexOf('ERROR') != -1 ) {
			return true;
		} else {
			return false;
		}
	}
	, 'checkbox': function(options) {
		var o = document.getElementsByName(options.name);
		if( o == null ) return;

		switch(o.length) {
			case 0:
				var chk = false;
				var o = document.getElementById(options.name);
				if( o == null ) return '';
				if( o.checked == true ) var chk = true;
				return chk == true ? o.value : '';
				break;
			default:
				for( var i = 0, stack = []; i < o.length; i++ ) {
					switch(options.mode) {
						case 'val':
							if( o[i].checked == true ) var val = i;
							break;
					}
				}

				if( options.mode == 'val' ) {
					if(typeof val == 'undefined') return '';
					return o[val].value;
				}
				break;
		}
	}
};
/**
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 */
var __Base64__ = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = __Base64__._utf8_decode(output);
 
		return output;
 
	}
};
Function.prototype.__bind__ = function() {
	for ( var i = 0, method = this , args = [] , len = arguments.length ; i < len ; i++ ) {
		args.push( arguments[ i ] );
	}
	return function() {
		return method.apply( args[0] , args.slice(1) );
	}
};

/**
 * Implements JSON stringify and parse functions
 * v1.0
 *
 * By Craig Buckler, Optimalworks.net
 *
 * As featured on SitePoint.com
 * Please use as you wish at your own risk.
*
 * Usage:
 *
 * // serialize a JavaScript object to a JSON string
 * var str = __JSON.stringify(object);
 *
 * // de-serialize a JSON string to a JavaScript object
 * var obj = JSON.parse(str);
 */

var __JSON = __JSON || {};

// implement JSON.stringify serialization
__JSON.stringify = __JSON.stringify || function (obj) {
	var t = typeof (obj);
	if (t != "object" || obj === null) {

		// simple data type
		if (t == "string") obj = '"'+encodeURIComponent(obj)+'"';
		return String(obj);

	}
	else {

		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);

		for (n in obj) {
			v = obj[n]; t = typeof(v);

			if (t == "string") v = '"'+encodeURIComponent(v)+'"';
			else if (t == "object" && v !== null) v = __JSON.stringify(v);

			json.push((arr ? "" : '"' + n + '":') + String(v));
		}

		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};


// implement JSON.parse de-serialization
__JSON.parse = __JSON.parse || function (str) {
	if (str === "") str = '""';
	eval("var p=" + str + ";");
	return p;
};
