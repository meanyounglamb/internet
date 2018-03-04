////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ▒   하위 카테고리 노출
//	ex) 캠핑콜
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function oncate(no) {
	var cateno = $('.cate'+no);
	var cateimg = $('#cateimg'+no);
	$(cateno).show();
	$(cateimg).attr('src','/_image/common/hd_cate'+no+'_over.gif');
	$('#header').css('zIndex','100');
}
function offcate(no) {
	var cateno = $('.cate'+no);
	var cateimg = $('#cateimg'+no);
	$(cateno).hide();
	$(cateimg).attr('src','/_image/common/hd_cate'+no+'.gif');
	$('#header').css('zIndex','0');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ▒   imgOver
//
//**************************************************************************************************************
//
//  Example)
//      <img src="/_image/common/이미지.jpg" alt="" title="" onmouseover="imgOver(this)" onmouseout="imgOver(this,'out')">
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function imgOver(imgEl,opt) {

	if(imgEl.getAttribute('checked')) return;

    var src = imgEl.getAttribute('src');
    var ftype = src.substring(src.lastIndexOf('.'), src.length);
    
    if (opt == 'out') imgEl.src = imgEl.src.replace("_over"+ftype, ftype);
    else imgEl.src = imgEl.src.replace(ftype, "_over"+ftype);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ▒   goFlash
//
//**************************************************************************************************************
//
//  Usage) 플래시 링크 자바스크립트 연동
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var flashLink=new Array();
flashLink[00]="/";

function goFlash(n){
	if (!flashLink[n]) return;
	else if (n=='btn_cyworld') window.open(flashLink[n]);
	else location.href=flashLink[n];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ▒   setPng24
//
//**************************************************************************************************************
//
//  Usage) IE 7 이하에서 png24 의 알파채널 지원
//
//  Example)
//      <img src="이미지" alt="" title="" class="png24">
//      -  css 파일또는 문서내에 .png24{tmp:expression(setPng24(this));} 가 지정되있어야 사용가능
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setPng24(obj) { 
      var browser = navigator.appName;
      var version = parseFloat(navigator.appVersion.replace (/^.*MSIE ([.0-9]+).*$/,"$1"));

      if(browser.indexOf("Internet Explorer") && version < 7.0 ) { // IE6 이하에서만 동작 2008-03-14 by zardsama
            obj.width=obj.height=1; 
            obj.className=obj.className.replace(/\bpng24\b/i,''); 
            obj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+ obj.src +"',sizingMethod='image');" 
            obj.src='';  
            return ''; 
      }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ▒   bookmarksite
//
//**************************************************************************************************************
//
//  Usage) 즐겨찾기
//         -  위사몰 관리자의 쇼핑몰관리 - 대표도메인 설정 - 대표도메인, 
//            위사몰 관리자의 쇼핑몰관리 - 타이틀메타검색 - 웹브라우저 타이틀이 내용으로 들어감
//
//  Example)
//      <img src="이미지경로" alt="즐겨찾기" onclick="addBookmark()">
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addBookmark() {
	var url = root_url;
    var title = document.title;

    if (window.sidebar) {// firefox
        window.sidebar.addPanel(title, url, ""); 
    }

    else if(window.opera && window.print) {// opera
        var elem = document.createElement('a');
        elem.setAttribute('href',url);
        elem.setAttribute('title',title);
        elem.setAttribute('rel','sidebar');
        elem.click();
    }

    else if(window.external) {// IE
        window.external.AddFavorite(url, title);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	▒ R2Slider 1.0
//
//	- 2008-03-20 by zardsama
//
// ************************************************************************************************************
//
// Usage)
//		var 변수명 = new R2Slider("레이어 ID","변수명", 속도, 상단마진);
//		변수명.slide();
//
//		- 속도, 상단마진은 생략 가능 / 추후 변경 가능
//		- '변수명.limitTop' 혹은 '변수명.limitBottom' 으로 상/하단 한계 지점 설정가능
//
//
//	Example )
//		<div id="scroll" style="position:absolute; width: 100px; height: 400px;"></div>
//		<script type="text/javascript">
//			var test = new R2Slider ("scroll","test",null,null,null);
//			test.limitTop = 100;
//			test.slide();
//		</script>
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

R2Slider = function(id, slider, divPitch, marginTop, dElement) {
	if (isNaN(parseInt(marginTop))) marginTop = 0;	// 상단 마진 디폴트
	if (isNaN(parseInt(divPitch))) divPitch = 15;	// 이동 간격 디폴트
	if (!dElement) dElement = document.documentElement; // DTD strict 일때 ( Transitional 일때는 document.body )

	this.timer;	// 타이머 변수
	this.slider = slider;	// 객체 변수명
	this.obj = document.getElementById (id);	// 오브젝트
	this.marginTop = parseInt(marginTop);	// 상단 마진
	this.divPitch = parseInt(divPitch);	// 이동 간격
	this.dElement = dElement; // DTD 에 따른 도큐먼트 엘리먼트
	this.limitTop;	 // 상단 한계점
	this.limitBottom;	 // 하단 한계점
}


R2Slider.prototype.moveIt = function(){
	var pitch = (parseInt(this.dElement.scrollTop)+ parseInt(this.marginTop)) - parseInt(this.obj.style.top);

	if (pitch == 0) return;
	else nextPos = parseInt(this.obj.style.top) + pitch / this.divPitch
	nextPos = (pitch > 0) ? Math.ceil(nextPos) : Math.floor(nextPos);

	var limitBottom = this.dElement.scrollHeight - parseInt(this.limitBottom)- parseInt(this.obj.offsetHeight);
	if ( this.limitTop && nextPos  < this.limitTop ) nextPos = this.limitTop;
	if ( this.limitBottom && nextPos  > limitBottom ) nextPos = limitBottom;
	if (nextPos < this.marginTop) nextPos = this.marginTop;
	if (isNaN(nextPos)) nextPos = 0;

	this.obj.style.top = nextPos+"px";
}


R2Slider.prototype.slide = function() {
	this.timer = setInterval(""+this.slider+".moveIt()", 10);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ▒   imgresize
//
//**************************************************************************************************************
//
//  Usage) 이미지 리사이징
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function imgresize(obj, limit) {//이미지 리사이징
    var box = document.getElementById(obj);
    var img = box.getElementsByTagName('img');

    for (var i=0;i<img.length;i++) {
        var iSrc = img[i].src;
        
        if (img[i].offsetWidth > limit) {
            img[i].style.width = limit+"px";
            img[i].style.cursor='pointer';
            img[i].onclick = function(){
                window.open(this.src);
            }
        }
    }
}