function closeLayerCoupon()
{
    opener ? window.close() : parent.document.getElementById('coupon_layer').style.display = 'none';
}

function chkAjaBrowser()
{
    var a,ua = navigator.userAgent;
    this.bw= {
        safari    : ((a=ua.split('AppleWebKit/')[1])?a.split('(')[0]:0)>=124 ,
        konqueror : ((a=ua.split('Konqueror/')[1])?a.split(';')[0]:0)>=3.3 ,
        mozes     : ((a=ua.split('Gecko/')[1])?a.split(" ")[0]:0) >= 20011128 ,
        opera     : (!!window.opera) && ((typeof XMLHttpRequest)=='function') ,
        msie      : (!!window.ActiveXObject)?(!!createHttpRequest()):false
    }
    return (this.bw.safari||this.bw.konqueror||this.bw.mozes||this.bw.opera||this.bw.msie)
}
function createHttpRequest()
{
    if (window.ActiveXObject){
        //Win e4,e5,e6용
        try {
            return new ActiveXObject("Msxml2.XMLHTTP") ;
        } catch (e) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP") ;
        } catch (e2) {
            return null ;
        }
    }
    } else if (window.XMLHttpRequest){
        //Win Mac Linux m1,f1,o8 Mac s1 Linux k3용
        return new XMLHttpRequest() ;
    } else {
        return null ;
    }
}
function sendRequest(callback,data,method,url,async,sload,user,password)
{
    var oj = createHttpRequest();
    if ( oj == null ) return null;

    var sload = (!!sendRequest.arguments[5])?sload:false;
    if (sload || method.toUpperCase() == 'GET')url += "?";
    if (sload)url=url+"t="+(new Date()).getTime();

    var bwoj = new chkAjaBrowser();
    var opera     = bwoj.bw.opera;
    var safari    = bwoj.bw.safari;
    var konqueror = bwoj.bw.konqueror;
    var mozes     = bwoj.bw.mozes ;

    if (opera || safari || mozes){
        oj.onload = function () { callback(oj); }
    } else {
        oj.onreadystatechange =function () {
            if ( oj.readyState == 4 ){
                callback(oj);
            }
        }
    }
    data = uriEncode(data)
    if (method.toUpperCase() == 'GET') {
        url += data
    }
    oj.open(method,url,async,user,password);
    setEncHeader(oj)
    oj.send(data);

    function setEncHeader(oj){

        var contentTypeUrlenc = 'application/x-www-form-urlencoded; charset=utf-8';
        if (!window.opera){
            oj.setRequestHeader('Content-Type',contentTypeUrlenc);
        } else {
            if ((typeof oj.setRequestHeader) == 'function')
                oj.setRequestHeader('Content-Type',contentTypeUrlenc);
        }
        return oj
    }
    function uriEncode(data){
        if (data!=""){
            var encdata = '';
            var datas = data.split('&');
            for (i=1;i<datas.length;i++)
            {
                var dataq = datas[i].split('=');
                encdata += '&'+encodeURIComponent(dataq[0])+'='+encodeURIComponent(dataq[1]);
            }
        } else {
            encdata = "";
        }
        return encdata;
    }
    return oj
}


function EcClientLogInfo()
{
    this.construct = function (aArg)
    {
        var iIndex = 0;
        this.sLogType = aArg[iIndex]; iIndex++;
        this.sContent = aArg[iIndex]; iIndex++;
        this.sTargetUrl = aArg[iIndex]; iIndex++;
        this.sPosition = aArg[iIndex]; iIndex++;
        this.bIsTrans = aArg[iIndex]; iIndex++;
    }

    this.setLogType = function (p) { this.sLogType = p; }
    this.setContent = function (p) { this.sContent = p; }
    this.setPosition = function (p) { this.sPosition = p; }
    this.setTargetUrl = function (p) { this.sTargetUrl = p; }
    this.setLogTime = function (p) { this.sLogTime = p; }
    this.setIsTrans = function (p) { this.bIsTrans = p; }

    this.getLogType = function () { return this.sLogType; }
    this.getContent = function () { return this.sContent; }
    this.getPosition = function () { return this.sPosition; }
    this.getTargetUrl = function () { return this.sTargetUrl; }
    this.getLogTime = function () { return this.sLogTime; }
    this.getIsTrans = function () { return this.bIsTrans; }

    this.getReqQueryString = function ()
    {
        var sReqQueryString = '';
        sReqQueryString += '&sLogType[]=' + this.sLogType;
        sReqQueryString += '&sContent[]=' + encodeURIComponent(this.sContent);
        sReqQueryString += '&sTargetUrl[]=' + encodeURIComponent(this.sTargetUrl);
        sReqQueryString += '&sPosition[]=' + this.sPosition;
        sReqQueryString += '&sLogTime[]=' + this.sLogTime;
        sReqQueryString += '&bIsTrans[]=' + this.bIsTrans;
        return sReqQueryString;
    }
    this.equalTo = function (oEcClientLogInfo)
    {
        if (oEcClientLogInfo.getLogType() != this.sLogType) return false;
        if (oEcClientLogInfo.getContent() != this.sContent) return false;
        if (oEcClientLogInfo.getTargetUrl() != this.sTargetUrl) return false;
        if (oEcClientLogInfo.getPosition() != this.sPosition) return false;
        return true;
    }
    this.construct(arguments);
}

var EcClientLogCtl = {
    init : function (bGlobal)
    {
        this.aLogQueue = new Array();
        this.aLogCmInfo = new Array();
        this.initCmInfo();

        this.bIsGlobalErr = false; //전역처리기 사용여부
        if (bGlobal == 'T') {
            this.bIsGlobalErr = true;
        }
        this.iTcInitEventJsGlobalError = 0;
        this.initEventJsGlobalError();
        this.iReqMaxCnt = 100; //큐 max cnt
        this.fErrorHandlerOthers = null;
        this.iReqInterval = 100;
        this.iReqTime = 0;
        this.iResTime = 0;
        this.bIsInit = true;
    },
    initCmInfo : function ()
    {
        return false;

        var iResW = screen.width ? screen.width : '';
        var iResH = screen.height ? screen.height : '';
        if (typeof(screen.deviceXDPI) == 'number') {
            iResW *= screen.deviceXDPI / screen.logicalXDPI;
            iResH *= screen.deviceYDPI / screen.logicalYDPI;
        }
        this.aLogCmInfo['iResW'] = iResW;
        this.aLogCmInfo['iResH'] = iResH;
        this.setCookie('ec_client_log_test', 'T', 1);
        if (this.getCookie('ec_client_log_test')) {
            this.aLogCmInfo['bCanUseCookie'] = 'T';
        }
    },
    initEventJsGlobalError : function ()
    {
        if (EcClientLogCtl.bIsGlobalErr === false) return false;

        var fHandlerOld = window.onerror;
        if (!fHandlerOld) {
            window.onerror = EcClientLogCtl.pushLogQJsGlobalError;
        } else if (fHandlerOld != EcClientLogCtl.pushLogQJsGlobalError) {
            EcClientLogCtl.fErrorHandlerOthers = fHandlerOld;
            window.onerror = EcClientLogCtl.pushLogQJsGlobalError;
        }
        if (EcClientLogCtl.iTcInitEventJsGlobalError < 100) {
            EcClientLogCtl.iTcInitEventJsGlobalError++;
            setTimeout('EcClientLogCtl.initEventJsGlobalError()', 200);
        }
    },
    pushLogQJsGlobalError : function (sErrorMsg, sUrl, iLineNumber)
    {
        var bReturnErrorHandlerOthers = false;
        if (EcClientLogCtl.fErrorHandlerOthers
            && EcClientLogCtl.fErrorHandlerOthers != EcClientLogCtl.pushLogQJsGlobalError) {
            bReturnErrorHandlerOthers = EcClientLogCtl.fErrorHandlerOthers(sErrorMsg, sUrl, iLineNumber);
        }
        var oEcClientLogInfo = new EcClientLogInfo('JsGlobalError', sErrorMsg, sUrl, iLineNumber, 'F');
        oEcClientLogInfo.setLogTime(EcClientLogCtl.getDateYmdhim(new Date()));
        EcClientLogCtl.pushLogQ(oEcClientLogInfo);
        return bReturnErrorHandlerOthers;
    },
    pushLogQJsSpecifed : function (sLogType, sErrorMsg, sUrl, iLineNumber)
    {
        var oEcClientLogInfo = new EcClientLogInfo(sLogType, sErrorMsg, sUrl, iLineNumber, 'F');
        oEcClientLogInfo.setLogTime(EcClientLogCtl.getDateYmdhim(new Date()));
        EcClientLogCtl.pushLogQ(oEcClientLogInfo);
    },
    getDateYmdhim : function (oDate)
    {
        var sTemp = '', sTemp2 = ''
        sTemp += oDate.getFullYear();
        sTemp += '-';
        sTemp2 = (oDate.getMonth() < 10) ? '0' : '';
        sTemp += sTemp2 + (oDate.getMonth() + 1);
        sTemp += '-';
        sTemp2 = (oDate.getDate() < 10) ? '0' : '';
        sTemp += sTemp2 + oDate.getDate();
        sTemp += ' ';
        sTemp2 = (oDate.getHours() < 10) ? '0' : '';
        sTemp += sTemp2 + oDate.getHours();
        sTemp += ':';
        sTemp2 = (oDate.getMinutes() < 10) ? '0' : '';
        sTemp += sTemp2 + oDate.getMinutes();
        sTemp += ':';
        sTemp2 = (oDate.getSeconds() < 10) ? '0' : '';
        sTemp += sTemp2 + oDate.getSeconds();
        return sTemp;
    },
    pushLogQ : function (oEcClientLogInfo)
    {
        for (var iCnt = 0, iLen = this.aLogQueue.length; iCnt < iLen; iCnt++) {
            if (this.aLogQueue[iCnt].equalTo(oEcClientLogInfo)) {
                return;
            }
        }
        this.aLogQueue[this.aLogQueue.length] = oEcClientLogInfo;
    },
    popLogQ : function ()
    {
        var sParam = '';
        var aLogQueueNew = new Array();
        var iLogQueCnt = this.aLogQueue.length - this.iReqMaxCnt;
        var bCurTrans;

        for (var iCnt = 0, iLen = this.aLogQueue.length; iCnt < iLen; iCnt++) {
            bCurTrans = this.aLogQueue[iCnt].getIsTrans();

            //전송되지 않은 큐만 전송시킴
            if (bCurTrans != 'T') {
                sParam += this.aLogQueue[iCnt].getReqQueryString();
                this.aLogQueue[iCnt].setIsTrans('T');
            }

            /**
             * 1) 큐의 개수가 최대개수를 초과하지 않음
             * 2) 전송되지 않은 큐
             * 위의 경우에만 신규 큐로 할당시킴
             */
            if ( iLogQueCnt <= iCnt || bCurTrans != 'T' ) {
                aLogQueueNew[aLogQueueNew.length] = this.aLogQueue[iCnt];
            }
        }
        this.aLogQueue = aLogQueueNew;
        return sParam;
    },
    doMonitoring : function ()
    {
        EcClientLogCtl.reqLog2Ms();
        setTimeout('EcClientLogCtl.doMonitoring()', this.getNextTime());
    },
    reqLog2Ms : function ()
    {
        var sParam = this.popLogQ();
        if (!sParam) return;
        var sKey = '';
        if (EcClientLogCtl.aLogCmInfo) {
            for (sKey in EcClientLogCtl.aLogCmInfo) {
                sParam += '&'+ sKey  +'=' + EcClientLogCtl.aLogCmInfo[sKey];
            }
        }
        EcClientLogCtl.iReqTime = new Date().getTime();
        sendRequest(EcClientLogCtl.resLog2Ms, sParam, 'POST', '/common/ec_client_log_a.php', true, true);
    },
    resLog2Ms : function (oAjRes)
    {
        EcClientLogCtl.iResTime = new Date().getTime();
        if (!oAjRes || !oAjRes.responseText) return;
    },
    getNextTime : function ()
    {
        var iTimeInterval = ( this.iResTime - this.iReqTime ) * 0.7 ;
        iTimeInterval = iTimeInterval * this.getRandArbitary( 0.7, 1.5 );
        iTimeInterval = ( iTimeInterval < 1000 ) ? 1000 : Math.floor( iTimeInterval ) ;
        return ( iTimeInterval <= 5000 ) ? iTimeInterval : 5000 ;
    },
    getRandArbitary : function (iMin, iMax)
    {
        return (Math.random() * (iMax - iMin )) + iMin ;
    },
    getCookie : function ( name )
    {
        var nameOfCookie = name + "=" ;
        var endOfCookie = "" ;
        var x = 0 ;
        while ( x <= document.cookie.length )
        {
            var y = (x+nameOfCookie.length) ;
            if ( document.cookie.substring( x, y ) == nameOfCookie )
            {
                if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
                endOfCookie = document.cookie.length;
                return unescape( document.cookie.substring( y, endOfCookie ) ) ;
            }
            x = document.cookie.indexOf( " ", x ) + 1 ;
            if ( x == 0 )
            break;
        }
    },
    setCookie : function ( name, value, expiredays )
    {
        var todayDate = new Date();
        todayDate.setDate( todayDate.getDate() + expiredays );
        document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
    },
    _test : function ( target )
    {
        var str_rtn = "";
        for ( i in target )
        {
            str_rtn += i + '=' + target[i] + "<br>\n";
        }
        alert(str_rtn);
        return str_rtn;
    }
}
EcClientLogCtl.init('F');
EcClientLogCtl.doMonitoring();

var scroll_time = 300;
var obj;

function set_top_line( mode )
{
    if ( !mode )
    {
        document.all["top_line1"].height = 1
        document.all["top_line2"].height = 1
        document.all["top_line3"].height = 1
    }
}

function move_banner()
{

        /*
        scroll_banner_top_y = document.all.scroll_banner.style.marginTop.split( "px", 1 )

        height = top_y + 1000

        for ( i = 0; i < 200; i++ )
        {
                height--;
                document.all.scroll_banner.style.marginTop = height
                window.setTimeout( "", 3 );
        }

        if ( document.all.scroll_banner.style.marginTop != ( top_y + "px" ) )
        {
                //alert( height )
                //alert( document.all.scroll_banner.style.marginTop + " " + top_y )
        }
        */

    /*
    height = top_y + 1000

    for ( i = 0; i < 1000; i++ )
    {
        document.all.scroll_banner.style.marginTop = height - 1
                //window.setTimeout( "", 1 );
    }
    */
}

// 최근본상품 스크립트 시작 jsyoon 05/11/21
var timerID = null;
var np_active;
var np_speed;
var dspcnt;

function ScrollUp(){
    if (parseInt(obj[np_active].style.top) == 0){
        alert('최근 본 첫상품입니다.');
        return;
    }
    if (document.getElementById){
        if (parseInt(obj[np_active].style.top) < 0){
            obj[np_active].style.top = parseInt(obj[np_active].style.top) + np_speed + "px";
        }
        //timerID = setTimeout("ScrollUp("+np_speed+")",30);
    }
}

function ScrollDown(){
    if (document.getElementById){
        var remain_height = parseInt(obj[np_active].style.height) + (parseInt(obj[np_active].style.top));
        if (remain_height <= (dspcnt * np_speed)){
            alert('최근 본 마지막상품입니다.');
            return;
        }
        if (parseInt(obj[np_active].style.top) > document.getElementById('cont').offsetHeight - obj[np_active].offsetHeight){
            obj[np_active].style.top = parseInt(obj[np_active].style.top) - np_speed + "px";
        }
        //timerID = setTimeout("ScrollDown("+np_speed+")",30);
    }
}

function ScrollStop(){
    if (document.getElementById){
        clearTimeout(timerID);
    }
}

function ScrollPageInit(rowcnt, rowlimit) {
    var tbl_row =  document.getElementById("tbl_row0");
    var inner_width = 0;
    var inner_height = 0;
    var cont_obj;
    var tmp_obj;
    dspcnt = rowlimit;
    np_active = 0;
    if (tbl_row == undefined || rowcnt <= 0)
        return;
    else {
        //inner_width = parseInt(tbl_row.width);
        // 타이틀이미지의 크기를 불러와서 리스트 테이블 넓이로설정
        var rview_timg = new Image();
        rview_timg.src = document.getElementById("rviewpdt_img").src;
        inner_width = rview_timg.width;
        if (!inner_width){
            inner_width = 130;
        }
        for (var i=0; i < rowcnt; i++){
            tmp_obj = document.getElementById("tbl_row" + i);
            tmp_obj.width = inner_width;
        }
        //리스트 테이블 높이설정
        inner_height = parseInt(tbl_row.height);
        if (inner_width <= 0 || inner_height <= 0)
            return;
        np_speed = inner_height;
        cont_obj = document.getElementById("cont");
        cont_obj.style.width = inner_width;
        cont_obj.style.height = (rowcnt > rowlimit ? (inner_height * rowlimit + 1) : (inner_height * rowcnt + 1)) + 'px';
    }
    if (document.getElementById){
        try{
            var obj = document.getElementById("cont").getElementsByTagName("DIV");
                obj['inner_row'].style.visibility = "visible";
                obj['inner_line'].style.visibility = "visible";
                obj['inner_row'].style.height = (inner_height * rowcnt) + 'px';
                obj['inner_row'].style.width = inner_width + 'px';
                obj['inner_row'].style.top = 0;
        } catch(e){}
    }
    if (document.addEventListener){
        for (i=0;i<document.getElementsByTagName('a').length;i++){
            document.getElementsByTagName('a')[i].style.position = "relative";
        }
    }
    return obj;
}
// 최근본상품 끝

function check_gonggu()
{
    alert('공동구매 기간이 아닙니다');
}

function poll_form_submit( form )
{

        select_no_length = form.select_no.length
    is_checked = false;

        for ( i = 0; i < select_no_length; i++ )
        {
        if ( form.select_no[i].checked )
        {
            is_checked = true;
            break;
        }
        }

    if ( !is_checked )
    {
        alert( '설문항목을 선택해주세요.' )
        return false;
    }

    return true;
}

function sMmove( link )
{
    document.location.href = 'http://' + link
    oWin.close();
}

function getCookie(name) {
    var nameOfCookie = name + "=";
    var x = 0;

    while (x <= document.cookie.length) {
        var y = x + nameOfCookie.length;
        if (document.cookie.substring(x, y) == nameOfCookie) {
            if ((endOfCookie=document.cookie.indexOf(";", y)) == -1) {
                endOfCookie = document.cookie.length;
            }
            return unescape(document.cookie.substring(y, endOfCookie));
        }
        x = document.cookie.indexOf(" ", x) + 1;
        if (x == 0) {
            break;
        }
    }
    return "";
}

function notice_popup(is_popup_check, mp_width, mp_height, mp_left_p, mp_top_p, mp_scrollbars)
{
    if (getCookie("mp_is_popup") == "") {
        mp_option = 'status:false;';
        mp_option += 'dialogWidth: ' + mp_width + 'px;';
        mp_option += 'dialogHeight: ' + mp_height + 'px;';
        mp_option += 'help:no; dialogLeft:' + mp_left_p + 'px;';
        mp_option += 'dialogTop:' + mp_top_p + ';';
        mp_option += 'status:no;scroll:' + mp_scrollbars + ';';

        url = '/admin/php/d/popup_r.php';
        url_name = 'echosting_shop_pop';

        var oWin = showModelessDialog( url, window, mp_option );
    }
}

function echosting_js_init()
{
    // 좌,우측 움직이는 배너
    set_move_banner();
    //window.setInterval( "set_move_banner()", scroll_time );
    //window.setTimeout( "set_move_banner()", scroll_time );
}

// 한글 크기를 체크하는 함수 by jsyoon
function str_size_check(str){
        var strlen = str.length;
        var bsize = 0;
        for (i=0; i<strlen; i++){
                chr =   str.charAt(i);
                // 한글이면 2를 더한다.
                if (escape(chr).length > 4)
                {
                        bsize += 2;
                }
                // 그밖의 경우는 1을 더한다.
                else
                {
                        bsize++;
                }
        }
        return bsize;
}

function check_byte(frm, maxsize, msg){
        var txtval  = frm.value;
        var bsize = 0;
        bsize = str_size_check(txtval);
        if (bsize > maxsize){
                alert(msg);
                return false;
        } else {
        return true;
    }
}

// 입력폼의 문자가 숫자인지를 체크 by jsyoon
function checkDigit(inputval)
{
        inputstr = inputval.toString();
        for ( var i=0; i < inputstr.length; i++)
        {
                var onechar = inputstr.charAt(i);
                if ((onechar < "0" || onechar > "9"))
                {
                        return false
                }
        }
        return true
}
// 자바스크립트 number_format jsyoon
function number_format(str)
{
    str+='';

    var objRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');

    while (objRegExp.test(str))
    {
        str = str.replace(objRegExp, '$1,$2');
    }

    return str;
}

var oldActionUrl = '';
// add 장정인
// date 2005.10.19
// login.simplexi.com을(ssl) 통하여 로그인 하기
function set_ssl_login( frm )
{
    if (frm.is_ssl.checked) {
        oldActionUrl = frm.action;
    } else {
        frm.action = '/front/php/login/login_a.php';
    }
} // end of set_ssl_login()

if ( window.attachEvent )  // IE의 경우
    window.attachEvent( "onload", echosting_js_init);
else  // IE가 아닌 경우.
    window.addEventListener( "load", echosting_js_init, false );


// sujin
// object관련 script 파일

function set_Embed()
{
  var obj = new String;
  var parameter = new String;
  var embed = new String;
  var html = new String;
  var allParameter = new String;
  var clsid = new String;
  var codebase = new String;
  var pluginspace = new String;
  var embedType = new String;
  var src = new String;

  var width = new String;
  var height = new String;

  var ServerIp = new String;
  var UserId = new String;
  var PassiveMode = new String;
  var Port = new String;
  var Status = new String;
  var Banner = new String;
  var ECHosting = new String;
  var FilelinkService = new String;
  var FilelinkServer = new String;

  this.init = function( s ,w , h, getType ) {
      getType = (getType != undefined)? getType :'flash';
      if ( getType == "flash")
      {
        clsid = "D27CDB6E-AE6D-11cf-96B8-444553540000";
        codebase = "http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0";
        pluginspage = "http://www.macromedia.com/go/getflashplayer";
        embedType = "application/x-shockwave-flash";

        parameter += "<param name='movie' value='"+ s + "'>\n";
        parameter += "<param name='quality' value='high'>\n";
        parameter += "<Param name='bgcolor' value=#FFFFFF>\n";

      }
      else if ( getType == 'webftp')
      {
        clsid = "EF256D78-3982-4F12-900B-AD8B254A43BD";
        codebase = "http://echosting.cafe24.com/ftpclient/Cafe24FtpCtl21.cab#version=1,0,2,7";
      }
      else if ( getType == 'filelinkftp')
      {
        clsid = "EF256D78-3982-4F12-900B-AD8B254A43BD";
        codebase = "http://echosting.cafe24.com/ftpclient/Cafe24FtpCtl14.cab#version=1,0,2,4";
      }



      src = s;
      width = w;
      height = h;
  }

  this.parameter = function( parm , value ) {
      parameter += "<param name='"+parm +"' value='"+ value + "'>\n";
      allParameter += " "+parm + "='"+ value+"'";
  }

  this.show = function(getType) {
      if ( clsid)
      {
        obj = "<object classid=\"clsid:"+ clsid +"\" codebase=\""+ codebase +"\"";

        if (width) {
            obj += " width ='" + width + "' ";
        }

        if (height) {
            obj += " height ='" + height + "' ";
        }

        obj += ">\n";
      }

      if ( getType == "flash" || typeof(getType) == "undefined") {
        embed = "<embed src='" + src + "' pluginspage='"+ pluginspage + "' type='"+ embedType + "'";

        if (width) {
            embed += " width ='" + width + "' ";
        }

        if (height) {
            embed += " height ='" + height + "' ";
        }

        embed += allParameter + " ></embed>\n";
      }

      if (getType == 'streaming') {
        embed = "<embed src='" + src + "' type='"+ embedType + "'";

        if (width) {
            embed += " width ='" + width + "' ";
        }

        if (height) {
            embed += " height ='" + height + "' ";
        }

        embed += allParameter + " ></embed>\n";
      }

      if ( obj )
      {
        end_embed = "</object>\n";
      }

      if (getType == 'streaming')
          html = embed;
      else
          html = obj + parameter + embed + end_embed;

      document.write( html );
  }


}

//전자보증보험 증권 내용 연결 팝업스크립트
function usafe_print(asMallId, asOrderId)
{
    var iXpos;
    var iYpos;

    iXPos = (screen.width  - 700) / 2;
    iYpos = (screen.height - 600) / 2;

        url = "https://gateway.usafe.co.kr/esafe/InsuranceView.asp?mall_id="+asMallId+"&order_id="+asOrderId;
        winname = "uclick_win" ;
        //option = "toolbar=no location=no scrollbars=yes width=650 height=537 left="+iXpos+",top="+iYpos ;
        option = "toolbar=no location=no scrollbars=yes width=650 height=537" ;
        opener = window.open( url, winname, option ) ;
}
// 마우스 오른쪽클릭 사용금지
function disableMouseRightButton()
{
    if ((event.button==2) ||  (event.button==3))
    {
        alert("무단도용방지를 위하여 마우스 오른쪽\n\n 버튼은 사용하실 수 없습니다.");
        return false;
    }
}
//컨트롤키 및 펑션키 금지
function disableKeys()
{
    if ((event.ctrlKey == true && (event.keyCode == 78 || event.keyCode == 82)) ||
        (event.keyCode >= 112 && event.keyCode <= 123))
    {
        event.keyCode = 0;
        event.cancelBubble = true;
        event.returnValue = false;
    }
}

/**
    * 사용자 정의 함수
    *
    * @author 이경란<krlee2@simplexi.com>
    * @date 2008-05-28
    * sample
    * getLog('/front/php/b/board_list.php','myshop','c_1','')
**/
function getLog(sURL,path1,path2,path3)
{

    if (path1 == null) {
        path1 = '';
    }
    if (path2 == null) {
        path2 = '';
    }
    if (path3 == null) {
        path3 = '';
    }

    if (sURL == '' && path1 == '' && path2 == '' && path3 == '' ){
        alert('sURL또는 path1또는 path2또는 path3를 입력하셔야합니다');
    }else if (sURL == ''){
        alert('sURL을 입력하셔야합니다');
    }else   if (path1 == ''&& path2 == '' && path3 == ''){
        alert('path1또는 path2를 입력하셔야합니다');
    }else if (sURL != '' && ( path1 != '' || path2 != '' || path3 != '' ) ){
        var path1_size = str_size_check(path1);
        var path2_size = str_size_check(path2);
        var path3_size = str_size_check(path3);
        var sURL_size = str_size_check(sURL);
        if (path1_size > 255) {
            alert("첫번째 인자가 너무 깁니다.");
            return;
        }
        if (path2_size > 255) {
            alert("두번째 인자가 너무 깁니다.");
            return;
        }
        if (path3_size > 255) {
            alert("세번째 인자가 너무 깁니다.");
            return;
        }
        if (sURL_size > 255) {
            alert("전달 URL의 길이가 너무 깁니다.");
            return;
        }
        
        //location.href = "/front/php/get_log.php?sCliMode=Evnt&sURL="+escape(sURL)+"&path1="+path1+"&path2="+path2+"&path3="+path3;
        location.href = "/exec/front/mall/clicklog?sCliMode=Evnt&sURL="+escape(sURL)+"&path1="+path1+"&path2="+path2+"&path3="+path3;
    }

}

// 2009-07-13 게시판 상세 글 보기 설정 추가 - 권혁천 (상품후기 게시판만 설정 가능:오정희)
var preViewTarget = null;
var preViewCloseImg = '';
function viewTarget(bbs_number,is_secret,address,prev_open_img,prev_close_img) {
    if (is_secret=='F') {
        if (preViewTarget==bbs_number) {
            viewTargetDivControl(prev_open_img,'','none');
            preViewTarget = null
        } else {
            try
            {
                if (preViewTarget != null) {
                    viewTargetDivControl(prev_open_img,'','none');
                }

                preViewTarget = bbs_number;
                preViewCloseImg = prev_close_img;
                parma_str = '&mode=read_preview&'+address.substring(address.indexOf('?')+1);
                sendRequest(viewTargetContents, parma_str,'POST', address.substring(0,address.indexOf('?')), true, true);
            } catch (e) {}
       }
        return;
    } else if (is_secret=='M') {
        alert('회원에게만 읽기 권한이 있습니다');
    } else {
        alert('비밀글은 미리보기가 불가 합니다.');
    }
}

// 2009-07-13 게시판 상세 글 보기 설정 추가 - 권혁천 (상품후기 게시판만 설정 가능:오정희)
function viewTargetDivControl(img,contents,type) {
    try {
        document.getElementById('prevImg'+preViewTarget).src = img;
        document.getElementById('view'+preViewTarget).innerHTML = contents;
        document.getElementById('view'+preViewTarget).style.display = type;
    }
    catch (e) {}

}
// 2009-07-13 게시판 상세 글 보기 설정 추가 - 권혁천 (상품후기 게시판만 설정 가능:오정희)
function viewTargetContents(oj) {
    viewTargetDivControl(preViewCloseImg,oj.responseText,'block');
}

// 2009-07-18 팝업창 생성 함수 - 권혁천
function OpenWindow(StrPage, StrName, w, h,scrolls)
{
    var win = null;
    var winl = (screen.width-w)/2;
    var wint = (screen.height-h)/3;
    settings = 'height='+h+',';
    settings += 'width='+w+',';
    settings += 'top='+wint+',';
    settings += 'left='+winl+',';
    settings += 'scrollbars='+scrolls+',';
    settings += 'resizable=no,';
    settings += 'status=no';
    win = window.open(StrPage, StrName, settings);
    if (parseInt(navigator.appVersion)>=4) {
        win.window.focus();
    }
}

// 상품요약정보 (툴팀제공) : 이경란(2009-11-30)
var config12 = {'className':'jsTooltip'};
var config3  = {'className':'jsTooltip2'};

var jsTooltip =  function(evt,target,str,configSetting){

       //==체크
       if (str==null || str==''){return false;}
       var config = {'gapLeft':5 ,'gapTop':5 , 'className':'jsTooltip','style':{} };
       if (configSetting){
               for (x in configSetting){
                       if (config[x] != undefined){
                               config[x] = configSetting[x];
                       }
               }
       }
       //== 변수값 설정
       this.target = target
       this.str = str
       this.gapLeft = config['gapLeft'];
       this.gapTop = config['gapTop'];
       divTooltip = document.createElement('div');
       divTooltip.className = config['className'];
       divTooltip.innerHTML = this.str;
       //divTooltip.appendChild(document.createTextNode(this.str));
       this.target.divTooltip = divTooltip;
       //== 스타일 설정
       if (config['style'] != null){
               for (x in config['style']){
                       divTooltip.style[x] = config['style'][x];
               }
       }
       divTooltip.style.display = 'none';
       divTooltip.style.left = 0;
       divTooltip.style.right = 0;
       divTooltip.style.position = 'absolute';

       if (divTooltip.className == 'jsTooltip') {
           divTooltipImg = document.getElementById('tooltip_basic').cloneNode();
           divTooltipImg.style.display = 'none';
           divTooltipImg.style.left = 0;
           divTooltipImg.style.right = 0;
           divTooltipImg.style.position = 'absolute';
           document.body.appendChild(divTooltipImg);
           this.target.divTooltipImg = divTooltipImg;
          }

       document.body.appendChild(divTooltip);
       var thisC = this;
       this.target.onmouseover = function(evt){ thisC.show(evt,thisC.target); }
       this.target.onmousemove = function(evt){ thisC.show(evt,thisC.target); }
       this.target.onmouseout = function(evt){ thisC.hide(evt,thisC.target); }
       if (evt && evt.type == 'mouseover'){
               thisC.show(evt,thisC.target);
       }
}

jsTooltip.prototype.show = function(evt,target){
       if (window.event){ evt = window.event ;}
       if (target.divTooltip){
               var scrollLeft = Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);
               var scrollTop = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
               var scrollWdith = Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);
               var scrollHeight = Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);

               target.divTooltip.style.display = 'block';
               var divRight = evt.clientX + target.divTooltip.offsetWidth;
               var divBottom = target.divTooltip.offsetTop+target.divTooltip.offsetHeight;
               var x = evt.clientX+this.gapLeft+scrollLeft;
               if (divTooltip.className == 'jsTooltip') {
                       var y = evt.clientY+this.gapTop+scrollTop-203;
               }else {
                       var y = evt.clientY+this.gapTop+scrollTop;
               }
               //var y = evt.clientY+this.gapTop+scrollTop-203;

               if (divRight + scrollLeft + this.gapLeft + 20 >= scrollWdith){
                       x = (scrollWdith - target.divTooltip.offsetWidth - 10 );

               }

               target.divTooltip.style.left = x+'px';
               target.divTooltip.style.top = y+'px';

               if (divTooltip.className == 'jsTooltip') {
                   target.divTooltipImg.style.left = x+'px';
                   target.divTooltipImg.style.top = y+'px';
                   target.divTooltipImg.style.display = 'block';
                  }
       }
}
jsTooltip.prototype.hide = function(evt,target){
       if (target.divTooltip){
               target.divTooltip.style.display = 'none';
               if (divTooltip.className == 'jsTooltip') {
                    target.divTooltipImg.style.display = 'none';
                }
       }
}

function getPosition(e)
{
    try
    {
        var mouseX = e.pageX ? e.pageX : document.documentElement.scrollLeft + event.clientX;
        var mouseY = e.pageX ? e.pageX : document.documentElement.scrollLeft + event.clientY;
    }
    catch (e)
    {
        var mouseX = document.body.offsetWidth - 350;
        var mouseY = document.body.offsetHeight - 400;
    }

    return {x: mouseX, y: mouseY};
}


/**
 * 장바구니 담기 처리중인지 체크 - (ECHOSTING-79705, 2013.05.22 by wcchoi)
 */
var bIsRunningAddBasket = false;

function setRunningAddBasket(val) {
    bIsRunningAddBasket = val;
}

function alertRunningAddBasket() {
    alert('처리중입니다. 잠시만 기다려주세요.');
}

function isRunningAddBasket() {
    if (bIsRunningAddBasket) return true;

    setRunningAddBasket(true);
    return false;
}



//상품목록내에서 direct 장바구니 담기창
function category_add_basket(productNO, cateNO, disGroup, dMode)
{
    // 장바구니 담기 처리중인지 체크 - (ECHOSTING-79705, 2013.05.22 by wcchoi)
    if (isRunningAddBasket()) {
        alertRunningAddBasket(); return;
    }

    try {
        var dMode;
        var Obj = document.getElementById('category_basketLayer');
        var ObjOptPreview = document.getElementById('cate_opt_previewLayer');
        var ObjBasketConfirm = document.getElementById('cate_basket_confirmLayer');
        var XY = getPosition(event);

        if (ObjOptPreview) {
            ObjOptPreview.style.display = 'none';
        }
        if (ObjBasketConfirm) {
            ObjBasketConfirm.style.display = 'none';
        }

        if (Obj)
        {
            var basket_layer = Obj;
            var basket_iframe = document.getElementById('category_basket');
        }else{
            var create_iframe = true;

            //레이어 생성
            var basket_layer = document.createElement('div');
            basket_layer.setAttribute('id', 'category_basketLayer');
            basket_layer.style.position = 'absolute';
            basket_layer.style.zindex = '1000';
            basket_layer.style.width = '1px';
            if (dMode == 1)
            {
                basket_layer.style.display = 'none';
            }

            //iframe 생성
            var basket_iframe = document.createElement('iframe');
            basket_iframe.setAttribute('id', 'category_basket');
            basket_iframe.setAttribute('frameBorder', '0');
            basket_iframe.setAttribute('border', '0');
            basket_iframe.setAttribute('scrolling', 'no');
            basket_iframe.style.width = '1px';
        }

        basket_layer.style.height = '0px';
        basket_iframe.style.height = '0px';
        basket_iframe.src = '/front/php/category_add_basket_f.php?product_no='+productNO+'&main_cate_no='+cateNO+'&display_group='+disGroup;
        if (dMode != 1)
        {
            basket_layer.style.display = 'block';
            basket_layer.style.left = document.body.scrollLeft + XY.x - 250;
            basket_layer.style.top = document.body.scrollTop + XY.y;
        }

        if (create_iframe == true)
        {
            document.getElementsByTagName("body")[0].appendChild(basket_layer);
            basket_layer.appendChild(basket_iframe);
        }
    } catch(e) {
    }
}


//상품목록내에서 옵션미리보기
function cate_opt_preview(productNO,e,iMRTwidth,sOptBtn)
{
    try {
        var dMode;
        var ObjBasket = document.getElementById('category_basketLayer');
        var Obj = document.getElementById('cate_opt_previewLayer');
        var XY = getAbsPosition(e);
        if (ObjBasket) {
            ObjBasket.style.display = 'none';
        }

        if (Obj)
        {
            var opt_preview_layer = Obj;
            var basket_iframe = document.getElementById('cate_opt_preview');
            if (basket_iframe.src != '/front/php/cate_opt_preview.php?product_no='+productNO) {
                basket_iframe.id = 'cate_opt_preview_old';
                opt_preview_layer.removeChild(basket_iframe);

                //iframe 생성
                var basket_iframe = document.createElement('iframe');
                basket_iframe.setAttribute('id', 'cate_opt_preview');
                basket_iframe.setAttribute('frameBorder', '0');
                basket_iframe.setAttribute('border', '0');
                basket_iframe.setAttribute('scrolling', 'no');
                basket_iframe.style.width = (iMRTwidth!="") ? iMRTwidth : '100px';
                opt_preview_layer.appendChild(basket_iframe);
            }
        }else{
            var create_iframe = true;

            //레이어 생성
            var opt_preview_layer = document.createElement('div');
            opt_preview_layer.setAttribute('id', 'cate_opt_previewLayer');
            opt_preview_layer.style.position = 'absolute';
            opt_preview_layer.style.zindex = '1000';
            opt_preview_layer.style.border = '1px solid #ccc';


            //iframe 생성
            var basket_iframe = document.createElement('iframe');
            basket_iframe.setAttribute('id', 'cate_opt_preview');
            basket_iframe.setAttribute('frameBorder', '0');
            basket_iframe.setAttribute('border', '0');
            basket_iframe.setAttribute('scrolling', 'no');
            basket_iframe.style.width = (iMRTwidth!="") ? iMRTwidth : '100px';
        }
        if (basket_iframe.src != '/front/php/cate_opt_preview.php?product_no='+productNO) {
            basket_iframe.src = '/front/php/cate_opt_preview.php?product_no='+productNO;
        }

        opt_preview_layer.style.left = document.body.scrollLeft + XY.x;
        opt_preview_layer.style.top = document.body.scrollTop + XY.y + 17;
        opt_preview_layer.style.display = 'block';


        if (create_iframe == true)
        {
            document.getElementsByTagName("body")[0].appendChild(opt_preview_layer);
            opt_preview_layer.appendChild(basket_iframe);
        }

    } catch(e) {
    }
}

var isClose = 'T';
function closeDivMain() {
    isClose = 'T';
    setTimeout("closeDivTic()", 150);
}
function closeDivTic() {
    try {
        if (isClose=="T") document.getElementById('cate_opt_previewLayer').style.display = 'none';
    } catch (e) {}
}

function closeDivOP(id) {
    try {
        document.getElementById(id).style.display = 'none';
    } catch (e) {}
}

function openDivOP(id) {
    try {
        isClose = "F";
        var targetDiv = document.getElementById(id);
        targetDiv.style.display = '';
        targetDiv.height = targetDiv.style.height;
    } catch (e) {}
}

function openDivWheel(id) {
    parent.openDivOP(id);
    document.body.scrollTop = parent.document.getElementById(id).style.height;
}

//상품목록내에서 장바구니 담기 확인창
function cate_basket_confirm()
{
    //try {
        var Obj = document.getElementById('cate_basket_confirmLayer');

        if (Obj)
        {
            var opt_preview_layer = Obj;
            var basket_iframe = document.getElementById('cate_basket_confirm');
        }else{
            var create_iframe = true;

            //레이어 생성
            var opt_preview_layer = document.createElement('div');
            opt_preview_layer.setAttribute('id', 'cate_basket_confirmLayer');
            opt_preview_layer.style.position = 'absolute';
            opt_preview_layer.style.zindex = '1000';
            //opt_preview_layer.style.width = '250px';

            //iframe 생성
            var basket_iframe = document.createElement('iframe');
            basket_iframe.setAttribute('id', 'cate_basket_confirm');
            basket_iframe.setAttribute('frameBorder', '0');
            basket_iframe.setAttribute('border', '0');
            basket_iframe.setAttribute('scrolling', 'no');
            basket_iframe.style.width = '300px';
            basket_iframe.style.height = '104px';
        }
        basket_iframe.src = '/front/php/basket_confirm.php';

        opt_preview_layer.style.display = 'block';
        opt_preview_layer.style.left = document.body.scrollLeft+300;
        opt_preview_layer.style.top = document.body.scrollTop+300;

        // 장바구니 담기 처리 완료 - (ECHOSTING-79705, 2013.05.22 by wcchoi)
        setRunningAddBasket(false);


        if (create_iframe == true)
        {
            document.getElementsByTagName("body")[0].appendChild(opt_preview_layer);
            opt_preview_layer.appendChild(basket_iframe);
        }
    //} catch(e) {
    //}
}



function resizeFrame() {
    try
    {
     if (document.body.scrollWidth > 0 && document.body.scrollHeight > 0)
                window.resizeTo(document.body.scrollWidth, document.body.scrollHeight);
    }
    catch (e)
    {
        errCnt++;
        if (errCnt > 10) return;
        setTimeout("resizeFrame();", 500);}
}

/**
 *  절대위치값 리턴
 */
function getAbsPosition(e)
{
    var top = 0, left = 0;
   if (!e) { e = window.event; }
   var myTarget = e.currentTarget;
   if (!myTarget) {
    myTarget = e.srcElement;
   }
   else if (myTarget == "undefined") {
       myTarget = e.srcElement;
   }
   while (myTarget.offsetParent) {
       top += myTarget.offsetTop;
       left += myTarget.offsetLeft;
       myTarget = myTarget.offsetParent;
   }
   return {x: left-document.body.scrollLeft, y: top-document.body.scrollTop};
}

//PG사 전표 출력: hckim 2010-02-26
function pgReceiptPrint(sReqData)
{
    if (!sReqData)
    {
        alert('요청정보가 비었습니다');
        return false;
    }

    OpenWindow('/common/PgReceiptPrint.php?req=' + sReqData , 'pgReceipt', 400, 300, 'no');
}

/**
 * 필드 자동 포커스이동
 * obj 체크할 필드, toID 이동할 필드의 ID, maxLen 이동될 문자열길이
 */
function fieldLengthFocus(obj, toID, maxLen)
{
    if (toID == null || maxLen == null)
    {
        return false;
    }

    if (obj.value.length >= maxLen)
    {
        document.getElementById(toID).focus();
    }
}

// syjung201005
var IMGSIZE_CTL = {
    init : function ( id_hobj, max_width, max_height )
    {
        IMGSIZE_CTL.id_hobj = id_hobj ;
        IMGSIZE_CTL.max_width = max_width ;
        IMGSIZE_CTL.max_height = max_height ;
        IMGSIZE_CTL.is_ie = ( document.all ) ? true : false ;
        if ( IMGSIZE_CTL.is_ie )
            window.attachEvent( 'onload', IMGSIZE_CTL.resize_start ) ;
        else
            window.addEventListener( 'load', IMGSIZE_CTL.resize_start, true ) ;
    },
    resize_start : function ()
    {
        var hobj_top = document.getElementById( IMGSIZE_CTL.id_hobj ) ;
        if ( !hobj_top || !IMGSIZE_CTL.max_width ) return ;
        IMGSIZE_CTL.max_width = parseInt( IMGSIZE_CTL.max_width ) ;
        IMGSIZE_CTL.max_height = parseInt( IMGSIZE_CTL.max_height ) ;
        IMGSIZE_CTL.hobj_list_img = hobj_top.getElementsByTagName( 'img' ) ;
        IMGSIZE_CTL.hobj_list_swf = hobj_top.getElementsByTagName( IMGSIZE_CTL.is_ie ? 'object' : 'embed' ) ;
        IMGSIZE_CTL.resize_img() ;
        IMGSIZE_CTL.resize_swf() ;
    },
    resize_swf : function ()
    {
        var new_target = new Array() ;
        var obj_target = null ;
        var obj_width = 0 ;
        for ( var cnt = 0, len = IMGSIZE_CTL.hobj_list_swf.length ; cnt < len ; cnt++ )
        {
            obj_target = IMGSIZE_CTL.hobj_list_swf[cnt] ;
            try
            {
                if ( obj_target.getVariable( '_root' ) )
                {
                    obj_width = obj_target.getVariable( '_root._width' ) ;
                    if ( !IMGSIZE_CTL.resize_obj( obj_target, obj_width ) ) new_target[new_target.length] = obj_target ;
                }
                else
                {
                    new_target[new_target.length] = obj_target ;
                }
            }
            catch (e)
            {
                new_target[new_target.length] = obj_target ;
            }
        }
        if ( new_target.length )
        {
            IMGSIZE_CTL.hobj_list_swf = new_target ;
            setTimeout( 'IMGSIZE_CTL.resize_swf()', 500 ) ;
        }
    },
    resize_img : function ()
    {
        var new_target = new Array() ;
        var obj_target = null ;
        var obj_width = 0 ;
        for ( var cnt = 0, len = IMGSIZE_CTL.hobj_list_img.length ; cnt < len ; cnt++ )
        {
            obj_target = IMGSIZE_CTL.hobj_list_img[cnt] ;
            if ( parseInt(obj_target.clientWidth) && obj_target.clientWidth )
            {
                obj_width = obj_target.clientWidth ;
                if ( !IMGSIZE_CTL.resize_obj( obj_target, obj_width ) ) new_target[new_target.length] = obj_target ;
            }
            else
            {
                new_target[new_target.length] = obj_target ;
            }
        }
        if ( new_target.length )
        {
            IMGSIZE_CTL.hobj_list_img = new_target ;
            setTimeout( 'IMGSIZE_CTL.resize_swf()', 500 ) ;
        }
    },
    resize_obj : function ( obj_target, obj_width )
    {
        if ( !parseInt(obj_width) || !obj_width )
        {
            obj_target.style.display = '' ;
            obj_target.style.position = 'absolute' ;
            obj_target.style.visibility = 'hidden' ;
            return false ;
        }
        else
        {
            obj_target.width = ( obj_width > IMGSIZE_CTL.max_width ) ? IMGSIZE_CTL.max_width : obj_width ;
            obj_target.style.display = '' ;
            obj_target.style.position = 'static' ;
            obj_target.style.visibility = '' ;
            return true ;
        }
    }
}

//좌측배너, 우측배너 롤링(v2.0 스크립트) 2010-05-24. 서나리
var aMoveNodes      = [];
var pageHeight      = 0;
var movePosY        = 0;

function set_move_banner()
{
    var isNode  = false;
    var aMoveNodeIds = [];
    aMoveNodeIds[aMoveNodeIds.length] = document.getElementById('r_scroll_area') ? 'r_scroll_area' : 'scroll_banner_r';
    aMoveNodeIds[aMoveNodeIds.length] = document.getElementById('l_scroll_area') ? 'l_scroll_area' : 'scroll_banner_l';

    for (var i=0; i<aMoveNodeIds.length; i++) {
        var node = document.getElementById(aMoveNodeIds[i]);

        if (node) {
            aMoveNodes.push(node);
            isNode = true;
        }
    }

    if (!isNode) return false;

    pageHeight = document.body.scrollHeight;
    _setScroll();

    window.onscroll = _setScroll;

    function _setScroll()
    {
        var top_y = document.body.scrollTop;
        var isMove = false;

        try{
            if (document.getElementById('socialMain')) {
                  pageHeight = document.body.scrollHeight;
            }
        } catch(e) {
        }

        for (var i=0; i<aMoveNodes.length; i++) {

            if (document.body.scrollHeight <= pageHeight) {
                aMoveNodes[i].style.marginTop = top_y+'px';
                movePosY = top_y; isMove = true;
            }

            if (isMove == false && movePosY > top_y) {
                aMoveNodes[i].style.marginTop = top_y+'px';
            }
        }
    }
}

/**
 *  아이디/비밀번호찾기 submit 폼체크
 *  2010-06-21 jykim
 */
function getTargetForm(sAction)
{
    var oAllForm = document.getElementsByTagName('form');
    var iLen = oAllForm.length;
    for (var i = 0; i < iLen; i++) {
        if (oAllForm[i].action == sAction) {
            return oAllForm[i];
        }
    }
}

/**
 *  form 체크
 */
function getSubmitForm(sName)
{
    if (sName == "") {
        return;
    }
    var oAllForm = document.getElementsByTagName('form');
    var iLen = oAllForm.length;
    for (var i = 0; i < iLen; i++) {
        if (oAllForm[i].name == sName) {
            return oAllForm[i];
        }
    }
}

/*Left menu 반투명 레이어 구현*/
function Layer_overload_pop(LayerName,Status)
{
    try
    {
        var LayerN;

        if (navigator.appName == "Netscape")
        {
            LayerN = document.getElementById(LayerName).style;
            if (Status == 'show') LayerN.visibility = 'visible';
            if (Status == 'hide') LayerN.visibility = 'hidden';
        }
        else
        {
            LayerN = document.all[LayerName].style;
            if (Status == 'show') LayerN.visibility = 'visible';
            if (Status == 'hide') LayerN.visibility = 'hidden';
        }
    }
    catch (e)
    {
    }
}

// 양쪽 공백 없애기
function trim(sVal)
{
    var pattern = /(^\s*)|(\s*$)/g; // \s 문자열 시작부분과 문자열 끝나는 부분의 공백, 탭을 모두 찾는다.
    sReturnVal = sVal.replace(pattern, "");
    return sReturnVal;
}

var DtCtl = {
    getCookie : function ( name )
    {
        var nameOfCookie = name + "=" ;
        var endOfCookie = "" ;
        var x = 0 ;
        while ( x <= document.cookie.length )
        {
            var y = (x+nameOfCookie.length) ;
            if ( document.cookie.substring( x, y ) == nameOfCookie )
            {
                if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
                endOfCookie = document.cookie.length;
                return unescape( document.cookie.substring( y, endOfCookie ) ) ;
            }
            x = document.cookie.indexOf( " ", x ) + 1 ;
            if ( x == 0 )
            break;
        }
    },
    setCookie : function ( name, value, expiredays )
    {
        var todayDate = new Date();
        todayDate.setDate( todayDate.getDate() + expiredays );
        document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
    },
    init : function ( sMode, sTargetHtmlId, sAddParam, bIsAlwaysRefresh, iWaitTime )
    {
        DtCtl.sMode = ( sMode ) ? sMode : "" ;
        DtCtl.sTargetHtmlId = ( sTargetHtmlId ) ? sTargetHtmlId : "" ;
        DtCtl.sAddParam = ( sAddParam ) ? sAddParam : "" ;
        if ( parseInt( iWaitTime ) ) {
            DtCtl.iWaitTime = iWaitTime ;
            DtCtl.bIsBlock = true ;
        } else {
            DtCtl.iWaitTime = 0 ;
            DtCtl.bIsBlock = false ;
        }
        DtCtl.bIsAlwaysRefresh = ( bIsAlwaysRefresh ) ? bIsAlwaysRefresh : false ;
    },
    applyDt : function ( sMode, sTargetHtmlId, sAddParam, bIsAlwaysRefresh, iWaitTime )
    {
        if ( !sMode ) return ;
        DtCtl.init( sMode, sTargetHtmlId, sAddParam, bIsAlwaysRefresh, iWaitTime ) ;
        if ( DtCtl.iWaitTime > 0 ) {
            try {
                window.attachEvent( "onload", DtCtl.reqDtInterval ) ;
            } catch (e) {
                try {
                    window.addEventListener( "load", DtCtl.reqDtInterval, true ) ;
                } catch (e) {}
            }
        } else {
            DtCtl.reqDt() ;
        }
    },
    reqDtInterval : function ()
    {
        if ( !DtCtl.iWaitTime ) DtCtl.iWaitTime = 0 ;
        if ( DtCtl.iWaitTime ) {
            setTimeout( "DtCtl.reqDt()", DtCtl.iWaitTime );
        } else {
            DtCtl.reqDt() ;
        }
    },
    reqDt : function ()
    {
        if ( DtCtl.bIsAlwaysRefresh ) { // for vanish
            DtCtl.sProxyFlag = DtCtl.getCookie( "iscache" ) ;
            DtCtl.setCookie( "iscache", "F", 1 );
        }
        var sParam = "" ;
        sParam += "&sResType=ajax&sMode=" + DtCtl.sMode ;
        if ( DtCtl.sAddParam ) {
            sParam += '&' + DtCtl.sAddParam ;
        }
        sendRequest( DtCtl.resDt, sParam, "POST", "/common/get_design.php", DtCtl.bIsBlock, true ) ;
    },
    resDt : function ( oAjRes )
    {
        if ( DtCtl.sProxyFlag ) {
            DtCtl.setCookie( "iscache", DtCtl.sProxyFlag, 1 );
        } else {
            DtCtl.setCookie( "iscache", "", 1 );
        }
        if ( !oAjRes || !oAjRes.responseText ) return;
        var hDivModule = document.getElementById( DtCtl.sTargetHtmlId ) ;
        var oXml = oAjRes.responseXML.documentElement;
        try {
            if ( hDivModule ) {
                hDivModule.innerHTML = oAjRes.responseXML.getElementsByTagName( "sHtml" )[0].firstChild.nodeValue ;
            }
            var sJs = oAjRes.responseXML.getElementsByTagName( "sJs" )[0].firstChild.nodeValue ;
            if ( sJs ) {
                eval( sJs ) ;
            }
        } catch ( e ) {}
    }
}


var FrontComm = {
    setLoding:function ()
    {
        if (document.getElementById('dLoading')) {
            document.getElementById('dLoading').style.display = 'block';
        } else {
        	if (document.getElementById('dLoading_div')) {
        		var sLoding = '<div id="dLoading"><div style="top:0px;left:0px;width:1500px;height:2000px;position:absolute;opacity: .1;filter:alpha(opacity=10);background:#000000;"></div><div style="position:absolute;top:250px;left:200px;width:400px;height:150px; padding:50px; text-align:center; color:#575757; font-size:12px;background:#ffffff; font-family:dotum,돋움,돋움체;"><b>처리중입니다. 잠시만 기다려주세요</b><img src="//img0001.echosting.cafe24.com/admin/center/newadmin/c/send.gif" border=""/></div></div>';
        		document.getElementById('dLoading_div').innerHTML = sLoding;
        	}
        }
    },

    unsetLoding:function ()
    {
    	if (document.getElementById('dLoading')) {
    		document.getElementById('dLoading').style.display = 'none';
    	}
    }
}

var bNvOn = false;
function onNvPointLayer(targetLayer, ex, ey, dMode)
{
    bNvOn = true;
    document.body.appendChild(document.getElementById('divNvPointInfo'));
    var obj = document.getElementById(targetLayer);
    obj.style.display = '';

    var leftMargine = obj.offsetWidth;
    if (dMode == 1)
    {
        var XY = getAbsPosition(event);
        obj.style.top = XY.y + document.body.scrollTop + 15;
        obj.style.left = XY.x + document.body.scrollLeft + 5;

        if (obj.attachEvent) {
        obj.attachEvent('onmouseover', setNvOn);
        } else {
                obj.addEventListener('mouseover', setNvOn, false);
        }

        var iLyPoint = (parseInt(XY.x, 10) + parseInt(obj.style.width, 10)) - parseInt(document.body.offsetWidth, 10);
        if (iLyPoint > 20) {
            obj.style.left = document.body.scrollLeft + XY.x - 20 - iLyPoint;
        }
    }
    return true;
}
function setNvOn() {
    bNvOn = true;
}
function offNvPointLayerTic(bIntval)
{
    bNvOn = false;
    if (bIntval == true) {
        setTimeout("offNvPointLayer()", 200);
    } else {
        offNvPointLayer();
    }
}
function offNvPointLayer()
{
    if (bNvOn == false) divNvPointInfo.style.display='none';
}





// 네이버 마일리지 유입경로 관련 by 한정우 2011.7.20
function getNcisyArgs()
{
    try {
        var args = new Object();
        var query = top.location.search.substring(1);
        var pairs = query.split("&");

        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) continue;
            var argname = pairs[i].substring(0,pos);
            var value = pairs[i].substring(pos+1);
            args[argname] = unescape(value);
        }
        return args;
    } catch(e) {
        return {'Ncisy':'', 'debug' : '', 'NpRef' : ''};
    }
}

function getNcisyTime()
{
    try{
        return Math.floor(new Date().getTime() / 1000);
    }catch(e){}
}

function getNcisyDomain(url)
{
    try{
        return url.match(/:\/\/(.[^/]+)/)[1];
    }catch(e){}
}

function getNcisyCookie(name)
{
    try{
        var nameEQ = name+"=";
        var ca = document.cookie.split(';');
        for (var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }catch(e){}
}

function setNcisy(mode)
{
    try{
        var sNcisy = '';
        var args = getNcisyArgs();

        if (args.Ncisy) var sNcisy = args.Ncisy;
        if (args.debug) var sDebug = args.debug;
        if (args.NpRef) var sNpRef = args.NpRef;

        var sNcisyCookie = getNcisyCookie('Ncisy'); // 쿠키에 저장된 Ncisy
        var sNpHostCookie = getNcisyCookie('NpHost'); // 쿠키에 저장된 referer
        var sNpDomainCookie = getNcisyCookie('NpDomain'); // 쿠키에 저장된 현재 도메인
        var sNcisyReferrer = getNcisyDomain(document.referrer); // 레퍼러 도메인
        if (sNcisyReferrer != undefined){
            if (sNcisyReferrer.indexOf('.naver.com') > -1){
                sNcisyReferrer = 'naver.com';
            }else{
                sNcisyReferrer = sNcisyReferrer.replace(/www./, '');
            }
        }

        // 쇼핑하우나 기타등등 사이트에서 frame으로 쇼핑몰 링크가 되는 경우 접근에러가 발생한다 .
        // 따라서 top. 이부분에서 에러가 발생한다면 document.domain 으로 셋팅하도록 한다.
        try {
            var sDomainName = top.document.domain; // 현재 도메인
        } catch (e) {
            sDomainName = document.domain;
        }

        var punycode = new Punycode;         // 한글도메인 punycode문제로 추가
        //ascii도메인을 encode해도 같은 ascii가 나오므로, 영문도메인 인코드해도 상관 없음.
        sNcisyReferrer = punycode.ToASCII(sNcisyReferrer);
        sDomainName = punycode.ToASCII(sDomainName);
        sDomainName = sDomainName.replace(/www./, '');
        sDomainName2 = 'www.'+sDomainName;

        // 이미 저장된 쿠기가 있을 경우
        if (sNcisyCookie){
            // 레퍼러가 naver.com 도 아니고 현재 도메인과도 다를 경우 삭제
            if (sNcisyReferrer != undefined && sNcisyReferrer != sNpHostCookie && sNcisyReferrer != sNpDomainCookie){
                document.cookie = "Ncisy=; path=/; domain="+sDomainName;
                document.cookie = "NpHost=; path=/; domain="+sDomainName;
                document.cookie = "NpDomain=; path=/; domain="+sDomainName;
                document.cookie = "Ncisy=; path=/; domain="+sDomainName2;
                document.cookie = "NpHost=; path=/; domain="+sDomainName2;
                document.cookie = "NpDomain=; path=/; domain="+sDomainName2;
            }
        }

        if (sNcisy != '' && (sNcisyReferrer =='naver.com' || sNpRef == 'naver_point_exception')) {
            var aNcisy = sNcisy.split("|");
            var aNcisyTime = aNcisy[2].split("=");
            var sNcisyTime = aNcisyTime[1];
            var sExpireDate = (sNcisyTime - getNcisyTime())/(60*60*24);
            if (sExpireDate > 0){
                document.cookie = "Ncisy="+sNcisy+"; path=/; domain="+sDomainName;
                document.cookie = "NpHost="+sNcisyReferrer+"; path=/; domain="+sDomainName;
                document.cookie = "NpDomain="+sDomainName+"; path=/; domain="+sDomainName;
                document.cookie = "Ncisy="+sNcisy+"; path=/; domain="+sDomainName2;
                document.cookie = "NpHost="+sNcisyReferrer+"; path=/; domain="+sDomainName2;
                document.cookie = "NpDomain="+sDomainName+"; path=/; domain="+sDomainName2;
            }
        }

    }catch(e){}
}

function setNcisyRate(defaultSaveRate)
{
    try {
        var oNaverRate = {
            'deft' : defaultSaveRate,
            'base' : 0,
            'add' : 0
        };

        if (typeof(wcs) == 'object') {
            var inflowParam = wcs.getMileageInfo();
            if (inflowParam != false) {
                oNaverRate.base = wcs.getBaseAccumRate();
                oNaverRate.add = wcs.getAddAccumRate();
            } else {
                oNaverRate.base = oNaverRate.deft;
            }
        } else {
            // 네이버 스크립트에 문제가 있거나 다른 문제로 공통스크립트가 동작 안되는 경우 실행됨.(거의 실행될일은 없음. > 나중엔 삭제할 예정)
            // 네이버지식쇼핑 > 상품상세 > 추가적립률 적용 > 다음쇼핑하우 > 상품상세 유입시 추가적립률 초기화 해야함.
            setNcisy();

            var sNcisyCookie = getNcisyCookie('Ncisy'); // 쿠키에 저장된 Ncisy
            var aNcisy       = sNcisyCookie.split("|");
            var aNcisyTime   = aNcisy[2].split("=");
            var aNcisyBa     = aNcisy[3].split("=");
            var sNcisyBa     = parseFloat(aNcisyBa[1]);
            var aNcisyAa     = aNcisy[4].split("=");
            var sNcisyAa     = parseFloat(aNcisyAa[1]);
            var iSaveRate    = (defaultSaveRate != undefined) ? defaultSaveRate : sNcisyBa;

            if (aNcisyTime[1] > getNcisyTime()) {
                if (isNaN(sNcisyBa) == false) {
                    oNaverRate.base = sNcisyBa;
                }

                if (isNaN(sNcisyAa) == false) {
                    oNaverRate.add = sNcisyAa;
                }
            } else {
                if (isNaN(iSaveRate) == false) {
                    oNaverRate.deft = iSaveRate;
                    oNaverRate.base = iSaveRate;
                }
            }
        }

        oNaverRate.deft = castDataType(oNaverRate.deft);
        oNaverRate.base = castDataType(oNaverRate.base);
        oNaverRate.add  = castDataType(oNaverRate.add);

        var setText = '';
        var nPointStatusImg = '';

        if (wcs.getMileageInfo() != false) {
            if (oNaverRate.base > 0) {
                var iPrintRate = oNaverRate.base + oNaverRate.add;
                nPointStatusImg = '<a href="#none" onclick="openMileageIntroPopup()"><img src="//img.echosting.cafe24.com/design/skin/default/product/txt_naver_on2.png" border="0" align="absmiddle" style="margin-top:-3px;"></a>';
                setText = '<span style="color:#1ec228" >' + iPrintRate + '%</span> 적립 ' + nPointStatusImg;
            }
        } else {
            nPointStatusImg = '<a href="#none" onclick="openMileageIntroPopup()"><img src="//img.echosting.cafe24.com/design/skin/default/product/txt_naver_off2.png" border="0" align="absmiddle" style="margin:-4px 3px 0;"></a>';
            document.getElementById('nPointStatus').innerHTML = nPointStatusImg;
            setText = '(네이버 통해 방문 시 적립/사용 가능) ';
        }

        document.getElementById('NcisyRate').parentNode.innerHTML = '<span id="NcisyRate"></span>';
        document.getElementById('NcisyRate').innerHTML = setText;


      //이미지확대
        if (location.pathname == '/front/php/image_zoom.php') {
	        var oMobileImg = document.getElementsByTagName('img');
	        var iMobileImgLen = oMobileImg.length;
	        var sNoneImg = '//img.cafe24.com/images/ec_admin/addservice/npoint/bi_03.gif';

	        for (var i = 0; i < iMobileImgLen; i++) {
	        	if (oMobileImg[i].getAttribute('src') == sNoneImg) {
	        		oMobileImg[i].style.display = 'none';
	        		break;
	        	}
	        }

	        document.getElementById('nPointGuideIcon').style.display = 'none';
        }

    } catch (e) {}
}



function getTax(product_price, tax_type, prdTaxRate)
{
    if (tax_type == 'A'){
        if (prdTaxRate == '') {
            prdTaxRate = 0;
        }
        var tmp_tax = (parseInt(product_price)*parseInt(prdTaxRate))/(100+parseInt(prdTaxRate));
        taxDec = Math.floor(tmp_tax);
        return taxDec;
    }
    return 0;
}

//Javascript Punycode converter derived from example in RFC3492.
//This implementation is created by some@domain.name and released into public domain
function Punycode() {

    this.utf16 = {
        decode:function(input){
            var output = [], i=0, len=input.length,value,extra;
            while (i < len) {
                value = input.charCodeAt(i++);
                if ((value & 0xF800) === 0xD800) {
                    extra = input.charCodeAt(i++);
                    if ( ((value & 0xFC00) !== 0xD800) || ((extra & 0xFC00) !== 0xDC00) ) {
                        throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence");
                    }
                    value = ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000;
                }
                output.push(value);
            }
            return output;
        },
        encode:function(input){
            var output = [], i=0, len=input.length,value;
            while (i < len) {
                value = input[i++];
                if ( (value & 0xF800) === 0xD800 ) {
                    throw new RangeError("UTF-16(encode): Illegal UTF-16 value");
                }
                if (value > 0xFFFF) {
                    value -= 0x10000;
                    output.push(String.fromCharCode(((value >>>10) & 0x3FF) | 0xD800));
                    value = 0xDC00 | (value & 0x3FF);
                }
                output.push(String.fromCharCode(value));
            }
            return output.join("");
        }
    }

    var initial_n = 0x80;
    var initial_bias = 72;
    var delimiter = "\x2D";
    var base = 36;
    var damp = 700;
    var tmin=1;
    var tmax=26;
    var skew=38;
    var maxint = 0x7FFFFFFF;

    function decode_digit(cp) {
        return cp - 48 < 10 ? cp - 22 : cp - 65 < 26 ? cp - 65 : cp - 97 < 26 ? cp - 97 : base;
    }

    function encode_digit(d, flag) {
        return d + 22 + 75 * (d < 26) - ((flag != 0) << 5);
    }
    function adapt(delta, numpoints, firsttime ) {
        var k;
        delta = firsttime ? Math.floor(delta / damp) : (delta >> 1);
        delta += Math.floor(delta / numpoints);

        for (k = 0; delta > (((base - tmin) * tmax) >> 1); k += base) {
                delta = Math.floor(delta / ( base - tmin ));
        }
        return Math.floor(k + (base - tmin + 1) * delta / (delta + skew));
    }

    function encode_basic(bcp, flag) {
        bcp -= (bcp - 97 < 26) << 5;
        return bcp + ((!flag && (bcp - 65 < 26)) << 5);
    }

    this.decode=function(input,preserveCase) {
        var output=[];
        var case_flags=[];
        var input_length = input.length;

        var n, out, i, bias, basic, j, ic, oldi, w, k, digit, t, len;

        n = initial_n;
        i = 0;
        bias = initial_bias;

        basic = input.lastIndexOf(delimiter);
        if (basic < 0) basic = 0;

        for (j = 0; j < basic; ++j) {
            if (preserveCase) case_flags[output.length] = ( input.charCodeAt(j) -65 < 26);
            if ( input.charCodeAt(j) >= 0x80) {
                throw new RangeError("Illegal input >= 0x80");
            }
            output.push( input.charCodeAt(j) );
        }

        for (ic = basic > 0 ? basic + 1 : 0; ic < input_length; ) {
            for (oldi = i, w = 1, k = base; ; k += base) {
                    if (ic >= input_length) {
                        throw RangeError ("punycode_bad_input(1)");
                    }
                    digit = decode_digit(input.charCodeAt(ic++));

                    if (digit >= base) {
                        throw RangeError("punycode_bad_input(2)");
                    }
                    if (digit > Math.floor((maxint - i) / w)) {
                        throw RangeError ("punycode_overflow(1)");
                    }
                    i += digit * w;
                    t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
                    if (digit < t) { break; }
                    if (w > Math.floor(maxint / (base - t))) {
                        throw RangeError("punycode_overflow(2)");
                    }
                    w *= (base - t);
            }

            out = output.length + 1;
            bias = adapt(i - oldi, out, oldi === 0);

            if ( Math.floor(i / out) > maxint - n) {
                throw RangeError("punycode_overflow(3)");
            }
            n += Math.floor( i / out ) ;
            i %= out;

            if (preserveCase) { case_flags.splice(i, 0, input.charCodeAt(ic -1) -65 < 26);}

            output.splice(i, 0, n);
            i++;
        }
        if (preserveCase) {
            for (i = 0, len = output.length; i < len; i++) {
                if (case_flags[i]) {
                    output[i] = (String.fromCharCode(output[i]).toUpperCase()).charCodeAt(0);
                }
            }
        }
        return this.utf16.encode(output);
    };

    this.encode = function (input,preserveCase) {
        var n, delta, h, b, bias, j, m, q, k, t, ijv, case_flags;

        if (preserveCase) {
            case_flags = this.utf16.decode(input);
        }
        input = this.utf16.decode(input.toLowerCase());

        var input_length = input.length; // Cache the length

        if (preserveCase) {
            for (j=0; j < input_length; j++) {
                case_flags[j] = input[j] != case_flags[j];
            }
        }

        var output=[];

        n = initial_n;
        delta = 0;
        bias = initial_bias;

        for (j = 0; j < input_length; ++j) {
            if ( input[j] < 0x80) {
                output.push(
                    String.fromCharCode(
                        case_flags ? encode_basic(input[j], case_flags[j]) : input[j]
                    )
                );
            }
        }

        h = b = output.length;

        if (b > 0) output.push(delimiter);

        while (h < input_length) {

            for (m = maxint, j = 0; j < input_length; ++j) {
                ijv = input[j];
                if (ijv >= n && ijv < m) m = ijv;
            }

            if (m - n > Math.floor((maxint - delta) / (h + 1))) {
                throw RangeError("punycode_overflow (1)");
            }
            delta += (m - n) * (h + 1);
            n = m;

            for (j = 0; j < input_length; ++j) {
                ijv = input[j];

                if (ijv < n ) {
                    if (++delta > maxint) return Error("punycode_overflow(2)");
                }

                if (ijv == n) {
                    for (q = delta, k = base; ; k += base) {
                        t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
                        if (q < t) break;
                        output.push( String.fromCharCode(encode_digit(t + (q - t) % (base - t), 0)) );
                        q = Math.floor( (q - t) / (base - t) );
                    }
                    output.push( String.fromCharCode(encode_digit(q, preserveCase && case_flags[j] ? 1:0 )));
                    bias = adapt(delta, h + 1, h == b);
                    delta = 0;
                    ++h;
                }
            }

            ++delta, ++n;
        }
        return output.join("");
    }

    this.ToASCII = function ( domain ) {
        var domain_array = domain.split(".");
        var out = [];
        for (var i=0; i < domain_array.length; ++i) {
            var s = domain_array[i];
            out.push(
                s.match(/[^A-Za-z0-9-]/) ?
                "xn--" + this.encode(s) :
                s
            );
        }
        return out.join(".");
    }
    this.ToUnicode = function ( domain ) {
        var domain_array = domain.split(".");
        var out = [];
        for (var i=0; i < domain_array.length; ++i) {
            var s = domain_array[i];
            out.push(
                s.match(/^xn--/) ?
                this.decode(s.slice(4)) :
                s
            );
        }
        return out.join(".");
    }
}

function openMileageIntroPopup() {
    var iWidth = 404;
    var iHeight = 412;
    var iLeft = (screen.width - iWidth) / 2;
    var iTop = (screen.height  - iHeight) / 2;
    var sOpt = "width="+iWidth+", height="+iHeight+", left="+iLeft+", top="+iTop+", status=no, resizable=no";

    window.open("http://static.mileage.naver.net/static/20130708/ext/intro.html", "mileageIntroPopup", sOpt);
}

/**
 * 자료형 cast
 * @param float fData 숫자
 * @return mixed
 */
function castDataType(fData)
{
    if (isNaN(fData) == false) {
        if ((fData % 1) == 0) {
            return parseInt(fData);
        } else {
            return parseFloat(fData);
        }
    } else {
        return 0;
    }
}
setNcisy();
