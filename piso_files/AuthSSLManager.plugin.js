/**
 * server side to client side plugin
 *
 * 기존 모듈을 수정하지 않고 확장하여 관리한다.
 * @author 박난하
 * @date 2010-10-21
 */
/**
 * SSL_URL 변경
 *
 * AuthSSLManagerV2 으로 이전
 */
AuthSSLManager.SSL_URL = 'https://login2.cafe24ssl.com/crypt/AuthSSLManagerV2.php'
/**
 * 파라메터 세팅
 * @param Object param
 * @return Array
 */
AuthSSLManager.setParam = function(param) {
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
		case 'decryptClient':
			p.push('auth_string=' + encodeURIComponent(param['auth_string']));
			break;
	}

	return p;
};
/**
 * client-side decrypt
 * @param String data
 * @return String
 * @adddate 2010-10-21
 */
AuthSSLManager.unserialize = function(data) {
    var that = this;
    var utf8Overhead = function(chr) {
        // http://phpjs.org/functions/unserialize:571#comment_95906
        var code = chr.charCodeAt(0);
        if (code < 0x0080) {
            return 0;
        }
        if (code < 0x0800) {
             return 1;
        }
        return 2;
    };
 
 
    var error = function (type, msg, filename, line){throw new that.window[type](msg, filename, line);};
    var read_until = function (data, offset, stopchr){
        var buf = [];
        var chr = data.slice(offset, offset + 1);
        var i = 2;
        while (chr != stopchr) {
            if ((i+offset) > data.length) {
                error('Error', 'Invalid');
            }
            buf.push(chr);
            chr = data.slice(offset + (i - 1),offset + i);
            i += 1;
        }
        return [buf.length, buf.join('')];
    };
    var read_chrs = function (data, offset, length){
        var buf;
 
        buf = [];
        for (var i = 0;i < length;i++){
            var chr = data.slice(offset + (i - 1),offset + i);
            buf.push(chr);
            length -= utf8Overhead(chr); 
        }
        return [buf.length, buf.join('')];
    };
    var _unserialize = function (data, offset){
        var readdata;
        var readData;
        var chrs = 0;
        var ccount;
        var stringlength;
        var keyandchrs;
        var keys;
 
        if (!offset) {offset = 0;}
        var dtype = (data.slice(offset, offset + 1)).toLowerCase();
 
        var dataoffset = offset + 2;
        var typeconvert = function(x) {return x;};
 
        switch (dtype){
            case 'i':
                typeconvert = function (x) {return parseInt(x, 10);};
                readData = read_until(data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
            break;
            case 'b':
                typeconvert = function (x) {return parseInt(x, 10) !== 0;};
                readData = read_until(data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
            break;
            case 'd':
                typeconvert = function (x) {return parseFloat(x);};
                readData = read_until(data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
            break;
            case 'n':
                readdata = null;
            break;
            case 's':
                ccount = read_until(data, dataoffset, ':');
                chrs = ccount[0];
                stringlength = ccount[1];
                dataoffset += chrs + 2;
 
                readData = read_chrs(data, dataoffset+1, parseInt(stringlength, 10));
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 2;
                if (chrs != parseInt(stringlength, 10) && chrs != readdata.length){
                    error('SyntaxError', 'String length mismatch');
                }
            break;
            case 'a':
                readdata = {};
 
                keyandchrs = read_until(data, dataoffset, ':');
                chrs = keyandchrs[0];
                keys = keyandchrs[1];
                dataoffset += chrs + 2;
 
                for (var i = 0; i < parseInt(keys, 10); i++){
                    var kprops = _unserialize(data, dataoffset);
                    var kchrs = kprops[1];
                    var key = kprops[2];
                    dataoffset += kchrs;
 
                    var vprops = _unserialize(data, dataoffset);
                    var vchrs = vprops[1];
                    var value = vprops[2];
                    dataoffset += vchrs;
 
                    readdata[key] = value;
                }
 
                dataoffset += 1;
            break;
            default:
                error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
            break;
        }
        return [dtype, dataoffset - offset, typeconvert(readdata)];
    };
    
    return _unserialize((data+''), 0)[2];
};
