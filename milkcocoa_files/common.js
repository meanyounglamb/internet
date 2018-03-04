var NUM = "0123456789";
var DNUM = NUM+".";
var SALPHA = "abcdefghijklmnopqrstuvwxyz";
var ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+SALPHA;
var EMAIL = "!#$%&*+-./=?@^_`{|}"+NUM+ALPHA;
var PASSWORD = "!@.#,$%^*&_-"+ALPHA+NUM;

var oldNum=new Array();
oldNum['qna']='';
oldNum['rev']='';

var isCRM;

String.prototype.trim = function() {
	var str = this;
	return this.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '');
}

String.prototype.toNumber = Number.prototype.toNumber = function() {
	var num = this;
	if(typeof this == 'string') num = this.replace(/[^0-9.]/, '');

	num = /^[0-9]+\.[0-9]+$/.test(num) ? parseFloat(num) : parseInt(num);
	if(isNaN(num)) num = 0;
	return num;
}

function byName(nm, from) { // document.폼네임 으로 처리한 구스크립트 처리용
	if(!from) from = document;
	var el = from.getElementsByName(nm);
	return  (el.length > 0) ? el[0] : null;
}

function CheckType(s,spc) {
	var i;
	for(i=0; i<s.length; i++) {
		if (spc.indexOf( s.substring(i, i+1)) < 0) {
			return false;
		}
	}
	return true;
}

function nextTab(obj,nxt,len){
	if (obj.value.length>=len) nxt.focus();
}

function setConfig(name,value){
	setCookie( name, value, 365 );
	alert('설정이 저장되었습니다');
}

function setCookie(name, value, expiredays){
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function getCookie( name ){
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x <= document.cookie.length ) {
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie ) {
		if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
			endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 )
			break;
	}
	return "";
}

function layTgl(obj, speed) {
	var obj = $(obj);

	if(obj.length < 1) return;

	if (obj.css('display') == 'none') obj.show(speed);
	else obj.hide(speed);
}

function layTgl2(obj_name) {
	layTgl(document.getElementById(obj_name));
}

function textDisable(o,d){
	if (d) {
		o.style.backgroundColor='#EFEFEF';
		o.disabled=true;
	} else {
		o.style.backgroundColor='';
		o.disabled=false;
	}
}

function checkBlank(o,m){
	if (typeof o=='undefined') return true;
	if (o.value.trim() == '') {
		window.alert(m+' 입력하세요');
		try { o.focus(); } catch (ex) { }
		return false;
	}
	return true;
}

function checkSel(o,m){
	if (o.selectedIndex == 0) {
		window.alert(m+' 선택하세요');
		o.focus();
		return false;
	}
	return true;
}

function checkCB(obj, msg){
	icbk=0;
	if(!obj) {
		window.alert('선택할 항목이 없습니다\t');
		return false;
	}

	if (obj.length) {
		for (dh=0; dh<obj.length; dh++) {
			if (obj[dh].checked==true) {
				icbk++;
				break;
			}
		}
	} else if (obj && obj.checked==true) {
		icbk++;
	}

	if (icbk<1) {
		alert(msg+' 선택하세요');
		return false;
	}
	return true;
}

function checkAll(obj, ck){
	$(obj).attr('checked', ck);
}

function checkNum(o, m){
	if (/[^0-9]/.test(o.value)) {
		window.alert(m+' 숫자만 입력하셔야 합니다.\t');
		o.focus();
		return false;
	}
	return true;
}

function wisaOpen(url,name,scroll,w,h) {
	if (!scroll) scroll='no';
	if (!w) w='100';
	if (!h) h='100';
	if (isCRM) crmFrm.location.href = url;
	else return window.open(url,name,'top=10px,left=10px,height='+h+'px,width='+w+'px,status=yes,resizable=yes,scrollbars='+scroll+',toolbar=no,menubar=no');
}


function selfResize(w, h){
	var ori_width = document.documentElement.scrollWidth;
	var ori_height = document.documentElement.scrollHeight;

	var w1 = (w) ? w : document.documentElement.scrollWidth;
	var h1 = (h) ? h : document.documentElement.scrollHeight;
	if(w1 < 100) w1 = 100;
	if(h1 < 100) h1 = 100;
	window.resizeTo(w1, h1);

	var w2 = w1 + (document.documentElement.scrollWidth-document.documentElement.clientWidth);
	var h2 = h1 + (document.documentElement.scrollHeight-document.documentElement.clientHeight);
	window.resizeTo(w2, h2);
}

function Resize(w, h) {
	var sh = screen.Height-150;
	if (h>sh) h=sh;

	if(Math.abs(document.body.offsetWidth - document.body.clientWidth) > 5) window.resizeTo(w + 26, h + 55);
	else window.resizeTo(w + 10, h + 59);
}

function zipSearch(form_nm,zip_nm,addr1_nm,addr2_nm){
	var srurl='/common/zip_search.php?form_nm='+form_nm+'&zip_nm='+zip_nm+'&addr1_nm='+addr1_nm+'&addr2_nm='+addr2_nm+'&urlfix=Y';
	window.open(srurl,'zip', ('scrollbars=yes,resizable=no,width=374, height=170'));
}

function zipSearch2(form_nm, val) {

	var srurl=root_url+'/main/exec.php?exec_file=common/zipSearch.php&form_nm='+form_nm+'&search='+val;

	frm=document.getElementsByName(hid_frame);
	frm[0].src=srurl;
}

function zipInput(f) {

	var sel=f.elements['addressee_sel'].value;
	var zip1=sel.charAt(0)+sel.charAt(1)+sel.charAt(2);
	var zip2=sel.charAt(4)+sel.charAt(5)+sel.charAt(6);
	var zip=zip1+"-"+zip2+" ";
	var addr=sel.replace(zip,"");
	var zip=zip.replace(" ","");

	f.elements['addressee_zip'].value=zip;
	f.elements['addressee_addr1'].value=addr;
}

function CheckMail(email){
	aindex=email.indexOf("@");
	dotindex=email.indexOf(".");

	if (aindex==-1 || dotindex==-1) return false;
	return true;
}

function isEmpty(data){
	for (ii=0; ii<data.length; ii++) {
		if(data.substring(ii, ii+1) != " ") return false;
	}
	return true;
}

function checkPhone(o,m){
	var r=9;
	for (i=0; i<3; i++)	{
		if (isEmpty(o[i].value) || !CheckType(o[i].value, NUM))	{
			r=i;
			break;
		}
	}
	return r;
}

function chgEmail(txt,sel,current) {
	if (typeof sel=='undefined') return;

	if (current) {
		for (i=0; i<sel.length; i++) {
			if (sel[i].value==current) {
				sel.selectedIndex=i;
				break;
			}
		}

		if (sel.selectedIndex==0) sel.selectedIndex=sel.length-1;
	}
	else txt.value=sel.value;

	if (sel.selectedIndex<sel.length-1) {
		txt.readOnly=true;
		txt.style.backgroundColor='#dbdbdb';
	} else {
		txt.readOnly=false;
		txt.style.backgroundColor='';
	}
}

var openssl_bak = "";
function checkLoginFrm(f){
	if (f.member_type) {
		if (!checkCB(f.member_type,"개인/기업회원을")) return false;
	}
	if (!checkBlank(f.member_id,"아이디를")) return false;
	if (!checkBlank(f.pwd,"비밀번호를")) return false;

	if (f.setHttps) { // 2008-05-19 보안서버 적용 by zardsama
		f.action = (f.setHttps.checked == true) ? f.action.replace ("http:","https:") : f.action.replace ("https:","http:");
	}

	if (f.setOpenSSL) { // 전역변수 setOpenSSL 은 common.js 에 선언되어있습니다
		if (!openssl_bak) openssl_bak = f.action;
		f.action = (f.setOpenSSL.checked == true) ? ssl_url : openssl_bak;
	}
}

function checkGuestOrderFrm(f){
	if (!checkBlank(f.ono,"주문번호를")) return false;
	if (!checkBlank(f.phone,"전화번호를")) return false;
}

function memberOnly(u,c,t){
	if (mlv==10) {
		if (c==1 && !confirm('\n 로그인이 필요한 서비스입니다.\t\t\n\n 로그인하시겠습니까? \n')) {
			if(t==1) return false;
			else return;
			u='';
		}
		u=root_url+'/member/login.php?rURL='+escape(u);
	}
	if (u && t!=3) location.href=u;
	else if (t==1 || t==3) return true;
}

function checkSearchFrm(f){
	if (!checkBlank(f.search_str,"검색어를")) return false;
}

function layTglList(old,lay_name,lay_no){
	var olay = document.getElementById(lay_name+oldNum[old]);
	var nlay = document.getElementById(lay_name+lay_no);

	if (oldNum[old]!=lay_no) {
		if (oldNum[old]) {
			if(olay) olay.style.display="none";
		}
		if(nlay) nlay.style.display="block";
		oldNum[old]=lay_no;
	} else {
		if(nlay) nlay.style.display="none";
		oldNum[old]="";
	}
}

function setComma(str, chk) {
	if(typeof str != 'string' && typeof str != 'number') return str;
	var str = str.toString().replace(/,/g, '');
	if(chk) {
		if(/[^0-9]/.test(str)) {
			window.alert('숫자만 입력 하셔야 합니다.\t');
			return false;
		}
	}
	return str.replace(/([0-9])(?=([0-9]{3})+(?![0-9]))/g, '$1,');
}

function removeComma(str) {
	if(typeof(str) == 'string') str = str.replace(/,|\./g, '').toNumber();
	return str;
}

function kcpCardReceipt(tno){
	url='http://admin.kcp.co.kr/Modules/Sale/Card/ADSA_CARD_BILL_Receipt.jsp?c_trade_no='+tno
	window.open(url,name,'top=10,left=10,height=700,width=440,status=no,scrollbars=yes,toolbar=no,menubar=no');
}

function inicisCardReceipt(tid) {	// 이니시스 영수증 출력
	var receiptUrl = "https://iniweb.inicis.com/DefaultWebApp/mall/cr/cm/mCmReceipt_head.jsp?noTid=" + tid + "&noMethod=1";
	window.open(receiptUrl,"receipt","width=430,height=700");
}

function closePopup(popup){
	setCookie(popup,'Y',1);
	window.close();
}

function closePopup2(popup,n){
	setCookie(popup,'Y',1);
	layTgl2('wm_popup_'+n);
}

function closePopup7(popup,n){
	setCookie(popup,'Y',7);
	layTgl2('wm_popup_'+n);
}

function closePopup3(url){
	if (url)
	{
		parent.document.location.href=url;
	}
	window.close();
}

function setCookie( name, value, expiredays ) {
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function newSMSpwd(){
	url=root_url+'/member/sms_find.php';
	location.href = url;
}

function click_prd_scroll(t){
	if (click_prd.length<1) return;

	if (t=="+")	{
		tmp=click_prd_finish+1;
		if (tmp>click_prd.length)		{
			window.alert('최근 본 상품의 마지막 상품입니다');
			return;
		}
		click_prd_start++;
		click_prd_finish++;
	} else {
		tmp=click_prd_finish-1;
		if (tmp==click_prd_limit) {
			window.alert('최근 본 상품의 첫번째 상품입니다');
			return;
		}
		click_prd_start--;
		click_prd_finish--;
	}

	for (i=click_prd_start; i<click_prd_finish; i++) {
		tmp=i-click_prd_start;
		document.getElementById('click_prd_title'+tmp).innerHTML=click_prd[i];
	}
}

function viewMember2(n,id){
	if (id == undefined) id='';
	var nurl=root_url+'/_manage/?body=member@member_view.frm&ref_front=true&mno='+n+'&mid='+id;
	window.open(nurl,'view_member','top=10,left=10,width=950,status=no,toolbars=no,scrollbars=yes');
}

function flashMovie(fid, src, wid, hei, fvs, wmd, version) {
	var fPrint = '';
	var Id = document.getElementById(fid);
	var Src = src;
	var Width = wid;
	var Height = hei;
	var FlashVars = (fvs != undefined)? fvs :'';
	var Wmod = (wmd != undefined)? wmd :'';
	if(!version) version = '10,0,0,0';

	if(isObject(Id)) {
		fPrint  = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version="'+version+' width="'+Width+'" height="'+Height+'" id="wisa_'+fid+'">';
		fPrint += '<param name="movie" value="'+Src+'">';
		fPrint += '<param name="allowScriptAccess" value="always" />';
		fPrint += '<param name="allowFullScreen" value="false" />';
		fPrint += '<param name="quality" value="high">';
		fPrint += (FlashVars != null) ? '<param name="flashvars" value="'+FlashVars+'">' : '';
		fPrint += (Wmod != null) ? '<param name="wmode" value="'+Wmod+'">' : '';
		fPrint += '<embed';
		fPrint += ' src="'+Src+'"';
		fPrint += (FlashVars != null) ? ' FlashVars="'+FlashVars+'"' : '';
		fPrint += (Wmod != null) ? ' wmode="'+Wmod+'"' : '';
		fPrint += ' quality="high"';
		fPrint += ' allowScriptAccess="always"';
		fPrint += ' allowFullScreen="false"';
		fPrint += ' pluginspage="http://www.macromedia.com/go/getflashplayer"';
		fPrint += ' type="application/x-shockwave-flash" ';
		fPrint += ' width="'+Width+'"';
		fPrint += ' height="'+Height+'"';
		fPrint += '></embed>';
		fPrint += '</object>';
		Id.innerHTML = fPrint;
	}
}

function isObject(a) {
    return (a && typeof a == 'object');
}

function flashMovie2(fid,src,wid,hei,fvs,wmd) {
	flashMovie(fid, src, wid, hei, fvs, wmd, '9,0,0,0');
}

function viewWMMsg(n) {
	if (n) url=root_url+'/mypage/msg_view.php?no='+n;
	else url=root_url+'/mypage/msg_list.php?mode=1';
	wisaOpen(url,'wmMgsWin');
}

function sendMsg(n){
	if (mlv==10) {
		window.alert('로그인하십시오');
		return;
	}
	nurl=root_url+'/mypage/msg_send.php?mode=1&mno='+n;
	window.open(nurl,'sendMSGW','top=10,left=10,width=450,height=100,status=no,toolbars=no,scrollbars=yes');
}

function trim(str){
	str = str.replace(/^\s*/,'').replace(/\s*$/, '');
	return str;
}

function qmc_check(o){
	if (o.checked==true) r='Y';
	else r='N';

	setCookie('quick_menu_move_check',r,365);
}

function seImgSize(o,width) {
	if (o.width > width) o.style.width=width;
}

function AdminMailSend(url,w,h){ // 2006-12-10 : 관리자에게메일 - Han
	if(!w) w=500; if(!h) h=500;
	var Op=window.open(url, "AdminM", "width="+w+", height="+h+", status=no, scrollbars=yes");
	Op.focus();
}

function adminMSck(f) {
	if(!checkBlank(f.from_name,"이름을")) return false;
	if(!checkBlank(f.from_email,"이메일을")) return false;
	if(!checkBlank(f.sub,"제목을")) return false;
	if(!checkBlank(f.content,"내용을")) return false;
}

function getHttpRequest(URL,method) { // Ajax 사용함수
	nochache = new Date();

	if ( URL.indexOf("?") < 0) URL += "?";

	URL = URL+"&ncache="+nochache;
	if ( method == null ) method = "GET";

	var xmlhttp = null;
	if(window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
	else 	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open(method, URL, false);

	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState==4 && xmlhttp.status == 200 && xmlhttp.statusText=='OK') {
			responseText = xmlhttp.responseText;
		}
	}
	xmlhttp.send('');

	return responseText = xmlhttp.responseText;
}

function createBackDiv(target, bgC, w, h, fr){
	w=w ? w : 830;
	h=h ? h : 500;
	fr=fr ? fr : '';
	bw=target.document.body.clientWidth;
	bh=target.document.body.scrollHeight;
	bh2=target.document.body.clientHeight;
	oh=target.document.body.scrollTop;
	posX=(bw-w)/2;
	posY=(bh-h)/2;

	if(!target.document.getElementById('dmMainBgDiv')){
		obj=target.document.createElement('div');
		with(obj.style){
			position='absolute';
			left=0;
			top=0;
			width='100%';
			height=(bh < bh2) ? bh2 : bh;
			backgroundColor='#000000';
			filter='Alpha(Opacity=50)';
			opacity='0.5';
			zIndex='50';
		}
		obj.id='dmMainBgDiv';
		target.document.body.appendChild(obj);
		obj.innerHTML='<iframe style="width:100%; height:100%; filter=\'Alpha(Opacity=0);\'"></iframe>';

		obj=target.document.createElement('div');
		with(obj.style){
			position='absolute';
			left=posX;
			top=oh+10;
			width=w;
			height=bh2-20;
			if(bgC) backgroundColor=bgC;
			zIndex='100';
		}
		obj.id='dmMainDiv';
		target.document.body.appendChild(obj);
	}
}

function finishedHosting(url, type){
	createBackDiv(this, '');
	bh=document.body.clientHeight;
	posY=(bh-417)/2;
	div=document.getElementById('dmMainDiv');
	if(type == 1){ // 사용자
		content='<img src="'+url+'/_manage/image/service/hosting_end2.gif" width="550" height="417">';
	}else{
		content='<img src="'+url+'/_manage/image/service/hosting_end1.gif" width="550" height="417" usemap="#goExtend">\n';
		content+='<map name="goExtend"><area shape="rect" href="./?body=service@service_main&stype=1" coords="212,180,339,220"></map>';
	}
	div.innerHTML='<div id="finishHDiv" align="center" style="padding-top:'+posY+'px;">'+content+'</div>';
}

function wclose() {
	if (parent.isCRM) {
		var frm = parent.document.getElementById("crmFrm");
		frmHeight = frm.offsetHeight;
		if (frm) frm.style.height = 0;

		parent.Resize(parent.document.body.scrollWidth, parent.document.body.scrollHeight);
		parent.document.getElementById("crmDiv").style.overflow = "hidden";
	}
	else window.close()
}

function FilterNumOnly(i) {
	if(!i) return;

	var exp = /[^0-9]+/;
	while(exp.test(i.value) == true){
		i.value = i.value.replace(exp, '');
	}
}

function addEvent(object, event ,listener) {
	if (object.addEventListener) object.addEventListener (event, listener, false);
	else if (object.attachEvent) object.attachEvent ('on' + event, listener);
}


//2011-05-31 게시판 카테고리 셀렉트 선택 Jung
function moveCate(db) {
	var f = document.getElementById('selectCateFrm');
	document.location.href=root_url+"/board/?db="+db+"&cate="+f.selectCate.value;
}


// 2012-04-04 escrowValid.js by zardsama
function goValidEscrow(mertid){
	var strMertid = mertid;
	window.open("https://pgweb.dacom.net/pg/wmp/mertadmin/jsp/mertservice/s_escrowYn.jsp?mertid="+strMertid,"check","width=339, height=263, scrollbars=no, left = 200, top = 50");

}

function goValidEscrowByBusiNo(busino, hashdata){
	window.open("https://pgweb.dacom.net/pg/wmp/mertadmin/jsp/mertservice/s_escrowYn.jsp?busino="+busino+"&hashdata="+hashdata,"check","width=339, height=263, scrollbars=no, left = 200, top = 50");
}

// 윙모바일 더보기 스크립트
function prdMore(obj_id, file_name, module) {
	var obj = $('#'+obj_id);
	var page = obj.attr('module_page');
	if(!page) page = 2;

	if(page == 'end') {
		window.alert('마지막 페이지입니다.');
		return;
	}

	var param = {"_tmp_file_name":file_name, "single_module":module, "striplayout":1, "module_page":page, "document_url":document.URL};
	var getURL = window.location.toString().split('?');
	if(getURL[1]) {
		var temp = getURL[1].split('&');
		for(var key in temp) {
			var temp2 = temp[key].split('=');
			param[temp2[0]] = temp2[1]
		}
	}

	$.get(root_url+'/main/exec.php?exec_file=skin_module/skin_ajax.php', param, function(result) {
		if(result) {
			obj.append(result);
			page++;
			obj.attr('module_page', page);
		} else {
			window.alert('마지막 페이지입니다.');
			obj.attr('module_page', 'end');
		}
	});
}

function getFixedSize(obj, size) {
	if(obj.width > size) {
		obj.style.width = size+'px';
	}
}