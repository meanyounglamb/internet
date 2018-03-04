////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ��   ���� ī�װ� ����
//	ex) ķ����
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
//  ��   imgOver
//
//**************************************************************************************************************
//
//  Example)
//      <img src="/_image/common/�̹���.jpg" alt="" title="" onmouseover="imgOver(this)" onmouseout="imgOver(this,'out')">
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
//  ��   goFlash
//
//**************************************************************************************************************
//
//  Usage) �÷��� ��ũ �ڹٽ�ũ��Ʈ ����
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
//  ��   setPng24
//
//**************************************************************************************************************
//
//  Usage) IE 7 ���Ͽ��� png24 �� ����ä�� ����
//
//  Example)
//      <img src="�̹���" alt="" title="" class="png24">
//      -  css ���϶Ǵ� �������� .png24{tmp:expression(setPng24(this));} �� �������־�� ��밡��
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setPng24(obj) { 
      var browser = navigator.appName;
      var version = parseFloat(navigator.appVersion.replace (/^.*MSIE ([.0-9]+).*$/,"$1"));

      if(browser.indexOf("Internet Explorer") && version < 7.0 ) { // IE6 ���Ͽ����� ���� 2008-03-14 by zardsama
            obj.width=obj.height=1; 
            obj.className=obj.className.replace(/\bpng24\b/i,''); 
            obj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+ obj.src +"',sizingMethod='image');" 
            obj.src='';  
            return ''; 
      }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ��   bookmarksite
//
//**************************************************************************************************************
//
//  Usage) ���ã��
//         -  ����� �������� ���θ����� - ��ǥ������ ���� - ��ǥ������, 
//            ����� �������� ���θ����� - Ÿ��Ʋ��Ÿ�˻� - �������� Ÿ��Ʋ�� �������� ��
//
//  Example)
//      <img src="�̹������" alt="���ã��" onclick="addBookmark()">
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
//	�� R2Slider 1.0
//
//	- 2008-03-20 by zardsama
//
// ************************************************************************************************************
//
// Usage)
//		var ������ = new R2Slider("���̾� ID","������", �ӵ�, ��ܸ���);
//		������.slide();
//
//		- �ӵ�, ��ܸ����� ���� ���� / ���� ���� ����
//		- '������.limitTop' Ȥ�� '������.limitBottom' ���� ��/�ϴ� �Ѱ� ���� ��������
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
	if (isNaN(parseInt(marginTop))) marginTop = 0;	// ��� ���� ����Ʈ
	if (isNaN(parseInt(divPitch))) divPitch = 15;	// �̵� ���� ����Ʈ
	if (!dElement) dElement = document.documentElement; // DTD strict �϶� ( Transitional �϶��� document.body )

	this.timer;	// Ÿ�̸� ����
	this.slider = slider;	// ��ü ������
	this.obj = document.getElementById (id);	// ������Ʈ
	this.marginTop = parseInt(marginTop);	// ��� ����
	this.divPitch = parseInt(divPitch);	// �̵� ����
	this.dElement = dElement; // DTD �� ���� ��ť��Ʈ ������Ʈ
	this.limitTop;	 // ��� �Ѱ���
	this.limitBottom;	 // �ϴ� �Ѱ���
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
//  ��   imgresize
//
//**************************************************************************************************************
//
//  Usage) �̹��� ������¡
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function imgresize(obj, limit) {//�̹��� ������¡
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