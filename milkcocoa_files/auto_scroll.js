function userEScroll()
{

    var thisObj = this;
    this.timeObj = null;
    this.no_gap= null;

    /*** 내장변수 ***/
    this.gap = 0;
    this.direction = 1;

    this.add = add;
    this.exec = exec;
    this.start = start;
    this.stop = stop;
    this.scroll = scroll;
    this.direct = direct;
    this.go = go;

    function add(str)
    {
        this.contents[this.contents.length] = str;
    }

    function exec()
    {
        this.basis = (this.mode == "left") ? this.width : this.height;
        var outWidth = this.width * ((this.mode == "left") ? this.line : 1);
        var outHeight = this.height * ((this.mode == "top") ? this.line : 1);

        var outline = "<div id=" + this.id + " style='overflow:hidden;width:" + outWidth + "px;height:" + outHeight + "px'><table></table></div>";
        document.write(outline);
        this.obj = document.getElementById(this.id);

        var tb = this.obj.appendChild(document.createElement("table"));
        var tbody = tb.appendChild(document.createElement("tbody"));
        tb.cellPadding = 0 ;
        tb.cellSpacing = 0 ;
        tb.onmouseover = function(){thisObj.stop()};
        tb.onmouseout = function(){thisObj.start()};

        if (this.mode=="left") var tr = tbody.appendChild(document.createElement("tr"));
        for (k in this.contents){
            if (this.mode=="top") var tr = tbody.appendChild(document.createElement("tr"));
            var td = tr.appendChild(document.createElement("td"));
            td.noWrap = true;
            td.style.width = this.width;
            td.style.height = this.height;
            td.style.textAlign = this.align;
            td.style.verticalAlign = this.valign;
            td.innerHTML = this.contents[k];
        }

        var len = (this.contents.length<this.line) ? this.contents.length : this.line;
        for (i=0;i<len;i++){
            if (this.mode=="top") var tr = tbody.appendChild(document.createElement("tr"));
            td = tr.appendChild(document.createElement("td"));
            td.noWrap = true;
            td.style.width = this.width;
            td.style.height = this.height;
            td.style.textAlign = this.align;
            td.style.verticalAlign = this.valign;
            td.innerHTML = this.contents[i];
        }

        this.obj.parent = this;
        this.tpoint = this.basis * this.contents.length;
        this.start();
    }

    function scroll()
    {
        var out = (this.mode=="left") ? this.obj.scrollLeft : this.obj.scrollTop;
        if (out%this.basis==0){
            if (this.no_gap != 'Y') this.gap++;
            if (this.gap>=this.delay) this.gap = 0;
        }
        if (!this.gap){
            var ret = (out==this.tpoint) ? this.direction : out + this.direction;
            if (ret<0) ret = this.tpoint + ret;
            if (this.mode=="left") this.obj.scrollLeft = ret;
            else this.obj.scrollTop = ret;
        }
    }

    function start()
    {
        this.timeObj = window.setInterval("(document.getElementById('" + this.id + "')).parent.scroll()",this.speed);
    }

    function stop()
    {
        clearTimeout(this.timeObj);
    }

    function direct(d)
    {
        this.direction = d;
    }

    function go()
    {
        this.stop();
        var out = (this.mode=="left") ? this.obj.scrollLeft : this.obj.scrollTop;
        var ret = (parseInt(out / this.basis) + this.direction) * this.basis;
        if (ret<0) ret = this.tpoint + ret;
        if (ret>this.tpoint) ret = this.basis;
        if (this.mode=="left") this.obj.scrollLeft = ret;
        else this.obj.scrollTop = ret;
    }

}


function userStyleFilter(){
    var thisObj=this;
    this.n=0;
    this.width=100;
    this.height=100;
    this.interval=0;
    this.setTimeId='';
    this.obj_id='';
    this.obj='';
    this.cdiv='';
    this.filterStyle='';
    this.duration='';
    this.transition='';

    this.rotateStop=rotateStop;
    this.rotateStart=rotateStart;
    this.rotate=rotate;
    this.setimgurl=setimgurl;
    this.exec=exec;

    function rotateStop(){
        clearTimeout(this.setTimeId);
    }
    function rotateStart(){
        this.rotate();
    }
    function rotate(){
        this.n = (this.n >= (this.faden_images.length)) ? 0 : this.n;
        this.setimgurl();
        this.setTimeId=setTimeout(this.id+".rotate()",this.interval);
    }
    function setimgurl(){
        this.exec();
        this.obj.filters[0].Apply();
        this.obj.innerHTML=this.faden_images[this.n];
        this.obj.filters[0].Play();
        this.n++;
    }
    function exec(){
        if(this.cdiv == 1) return;
        var outline = "<div id=" + this.obj_id + " style='overflow:hidden;width:" + this.width + "px;height:" + this.height + "px'></div>";
        document.write(outline);
        this.obj = document.getElementById(this.obj_id);
        this.obj.style.filter=this.filterStyle;
        this.obj.filters[0].duration=this.duration;
        if(this.transition != '') this.obj.filters[0].transition=this.transition;

        //this.obj.onmouseover=function(){thisObj.rotateStop()};
        //this.obj.onmouseout=function(){thisObj.rotateStart()};
        this.cdiv=1;
    }
}

// 슬라이드
function wingQuickSlide(quick_limit_top, quick_margin_top, quick_margin_bottom, quick_speed){

    if(!quick_limit_top) quick_limit_top=0; // 전체 페이지 기준 위쪽 한계 픽셀
    if(!quick_margin_top) quick_margin_top=0; // 현재 보고 있는 화면 기준 위쪽 한계 픽셀
    if(!quick_margin_bottom) quick_margin_bottom=100; // 아래쪽 한계 픽셀
    if(!quick_speed) quick_speed=10; // 한번에 움직이는 픽셀 간격
	var dElement = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
	
    w=document.getElementById("wing_auto_slide");
    if(w){
		var pitch = (parseInt(dElement.scrollTop)+ parseInt(quick_margin_top)) - parseInt(w.style.top);
		if (pitch == 0) return;
		else nextPos = parseInt(w.style.top) + pitch / quick_speed;
		nextPos = (pitch > 0) ? Math.ceil(nextPos) : Math.floor(nextPos);

		var limitBottom = dElement.scrollHeight - parseInt(quick_margin_bottom)- parseInt(w.offsetHeight);

		if (quick_limit_top && nextPos < quick_limit_top) nextPos = quick_limit_top;
		if (limitBottom && nextPos  > limitBottom ) nextPos = limitBottom;
		if (nextPos < quick_margin_top) nextPos = quick_margin_top;
		if (isNaN(nextPos)) nextPos = 0;

		w.style.top = nextPos+"px";
    }
}

// 최근상품 스크롤
function wingRecentVScroll(type){
    var w=document.getElementById('wing_recent_view_box');
    if(w){
        var w_top=parseInt(w.style.top);
        var w_height=w.offsetHeight;
        if(type == 1){
            w_hlimit=(w_height-wing_recent_view_scroll)*-1;
            if(w_top <= w_hlimit){
                alert('최근 본 상품의 첫번째입니다');
                return;
            }
            w_top -= wing_recent_view_scroll;
        }
        if(type == 2){
            if(w_top >= 0){
                alert('최근 본 상품의 마지막입니다');
                return;
            }
            w_top += wing_recent_view_scroll;
        }
        w.style.top=w_top+'px';
    }
}