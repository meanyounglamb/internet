var qna_edit=1;
function addCart(f,next) {
	var astr = '';
	var ems = '';

	if (f.stat.value!=2) {
		ems = '\n 죄송합니다\n\n '+soldout_name+'된 상품은 주문할 수 없습니다.\t\n';
		if (typeof f.sold_reserve!='undefined' && f.sold_reserve.value=='Y') {
			ems+='\n 예약주문하기를 이용하시면 입고후 연락드리겠습니다.\t';
		}
		window.alert(ems);
		return;
	}

	var min_ord=eval(f.min_ord.value);
	var max_ord=eval(f.max_ord.value);
	var buy_ea=eval(f.buy_ea.value);

	if (buy_ea<min_ord) {
		if(min_ord>1) astr='이 상품은 ';
		window.alert(astr+'최소 '+min_ord+'개 이상 구매하셔야합니다.\t');
		f.buy_ea.value=min_ord;
		return;
	}

	if (max_ord && buy_ea>max_ord) {
		window.alert('이 상품은 최대 '+max_ord+'개까지 구매하실 수 있습니다.\t');
		f.buy_ea.value=max_ord;
		return;
	}

	var opt_no = f.opt_no.value.toNumber();
	if (opt_no > 0) {
		for (j=1; j<=eval(opt_no); j++)	{
			if(!f.elements['option_necessary'+j]) continue;
			if (f.elements['option_necessary'+j].value=="Y" || f.elements['option_necessary'+j].value=="C") { // necessary
				if (f.elements['option_type'+j].value==2) { // select
					if (!checkSel(f.elements['option'+j],f.elements['option_name'+j].value+'을(를)')) return;
				} else { // radio, checkbox
					if (!checkCB(f.elements['option'+j],f.elements['option_name'+j].value+'을(를)')) return;
				}
			}

			// <2006-12-01 : 옵션재고체크 - Han
			if(f.elements['option_ea_ck'+j].value == "Y" && f.elements['option_necessary'+j].value=="Y") {
				if(f.elements['option_ea_num'+j].value < 1) {
					window.alert("해당 옵션은 품절되었습니다. - "+f.elements['option_name'+j].value+"   ");
					return;
				}
				if(buy_ea > f.elements['option_ea_num'+j].value) {
					window.alert("해당 옵션은 "+f.elements['option_ea_num'+j].value+"까지만 구매가 가능합니다. - "+f.elements['option_name'+j].value+"   ");
					f.buy_ea.value=f.elements['option_ea_num'+j].value;
					return;
				}
			}
			// >
		}
	}

	if(typeof cart_direct_order != 'undefined' && next==2){
		if(cart_direct_order == 'D') cwith=confirm('\n 장바구니에 있는 상품과 함께 주문하시겠습니까?\n\n \'취소\'을 클릭하시면 선택하신 상품만 주문되며 기존 장바구니 상품은 삭제됩니다.                  ');
		else if(cart_direct_order == 'Y') cwith=0;
		else cwith=1;
	} else if(next == 'checkout' || next == 'ipay') {
		cwith=0;
	} else {
		cwith=1;
	}

	if (next==1 || next==2 || next == 'checkout' || next == 'ipay')	{
		tg=hid_frame;
		ac=root_url+'/main/exec.php?exec_file=cart/cart.exe.php&cwith='+cwith;
		f.next.value=next;
	} else {
		tg='';
		ac=root_url+'/shop/order.php';
	}

	// 2008-10-15 : 에이스 카운터 처리 - Han
	if(ace_counter == '1'){
		AEC_F_D(_AEC_prodidlist[0],'i',buy_ea);
	}
	
	f.exec.value='add';
	f.target=tg;
	f.action=ac;
	f.submit();
}

function addMultiCart(f,next){
	if (f.stat.value!=2) {
		ems = '\n 죄송합니다\n\n '+soldout_name+'된 상품은 주문할 수 없습니다.\t\n';
		if (typeof f.sold_reserve!='undefined' && f.sold_reserve.value=='Y') {
			ems+='\n 예약주문하기를 이용하시면 입고후 연락드리겠습니다        ';
		}
		window.alert(ems);
		return;
	}

	var opt_no=eval(f.opt_no.value);
	var min_ord=eval(f.min_ord.value);
	var max_ord=eval(f.max_ord.value);
	var buy_ea=0;
	var ea_num=f["buy_ea[]"].length;
	if(!ea_num) ea_num=1;
	if(ea_num == 1){
		buy_ea += eval(f["buy_ea[]"].value);
		if(opt_no>0){
			for(ii=1; ii<=opt_no; ii++){
				if(f['option_necessary'+ii].value=="Y"){
					if(f['option_type'+ii].value==2){ if(!checkSel(f['option'+ii+'[]'],f['option_name'+ii].value+'을(를)')) return; }
					else{ if(!checkCB(f['option'+ii+'[]'],f['option_name'+ii].value+'을(를)')) return; }
				}
			}
		}
	}else{
		for(jj=0; jj<ea_num; jj++){
			buy_ea += eval(f["buy_ea[]"][jj].value);
			if(opt_no>0){
				for(ii=1; ii<=opt_no; ii++){
					if(f['option_necessary'+ii].value=="Y"){
						if(f['option_type'+ii].value==2){ if(!checkSel(f['option'+ii+"[]"][jj],f['option_name'+ii].value+'을(를)')) return; }
						else{ if(!checkCB(f['option'+ii][jj],f['option_name'+ii].value+'을(를)')) return; }
					}
				}
			}
		}
	}
	if(buy_ea<min_ord){ 
		if(min_ord>1) astr='이 상품은 '; else astr='';
		alert(astr+'최소 '+min_ord+'개 이상 구매하셔야합니다'); return;
	}
	if(max_ord && buy_ea>max_ord){ alert('이 상품은 최대 '+max_ord+'개까지 구매하실 수 있습니다'); return; }

	tg=hid_frame;
	ac=root_url+'/main/exec.php?exec_file=cart/cart.exe.php';
	f.next.value=next;
	
	f.exec.value='multi_option';
	f.target=hid_frame;
	f.action=root_url+'/main/exec.php?exec_file=cart/cart.exe.php';
	f.submit();
}

function reservePrd(f,url){
	if (f.stat.value!=3) {
		window.alert('\n 현재 상품은 정상 판매중입니다\n\n 구매하기 또는 장바구니담기를 클릭하세요.\t\n');
		return;
	} else if (typeof f.sold_reserve=='undefined' || f.sold_reserve.value!='Y')	{
		alert('\n 죄송합니다 \n\n 현재 상품은 예약 주문이 불가능합니다.\t\n');
		return;
	}
	if (url=='') location.href=root_url+'/shop/reserve.php?pno='+f.pno.value;
	else location.href=url;
}

function priceCal(f){
	var mpc;
	if (typeof f.multi_price=='undefined') mpc=0;
	else mpc=eval(f.multi_price.value);

	if (mpc==0) return;
	if (mpc>1) {
		for (m=0; m<mpc; m++) {
			if (f.price[m].checked==true) {
				tmp=f.price[m].value.split("::");
				price=eval(tmp[1]);
				break;
			}
		}
	} else {
		tmp=f.price.value.split("::");
		price=tmp[1].toNumber();
	}

	f.new_total_prc.value = f.total_prc.value.toNumber() + price;
}

function optionCal(f,opt_no,sval){
	tmp=sval.split("::");
	f.elements['option_sel_item'+opt_no].value=tmp[0];
	f.elements['option_prc'+opt_no].value=tmp[1];
	f.elements['option_ea_num'+opt_no].value=tmp[2];

	if(f.ea_type.value == '1') {
		var total_option = f.opt_no.value.toNumber();
		var complex1 = null;
		for (i=1; i <= total_option; i++) {
			if($('[name=option_necessary'+i+']').val() == 'C') {
				if(!complex1) complex1 = i;
				else {
					complex2 = i;
					break;
				}
			}
		}

		if(opt_no == complex1 && complex2 > 0) {
			var complex1_opt = $('#option'+complex1).val();
			$.get('/main/exec.php?exec_file=shop/getOptionstock.exe.php&urlfix=Y&timestamp='+new Date(), {"pno":f.pno.value, "opt":complex1_opt, "opt_no":complex2}, function(result) {
				if(result) $('#option'+complex2).replaceWith(result);
			});
		}
	}

	totalCal(f);
}

function totalCal(f){
	priceCal(f);
	new_total_prc=eval(f.total_prc.value); // 2006-05-12
	total_option=eval(f.opt_no.value);
	if (total_option) {
		for (i=1; i<=total_option; i++)
		{
			oprc = eval(f.elements['option_prc'+i].value);
			if (!oprc) oprc=0;
			//if (oprc)
			//{
				how_cal=f.elements['option_how_cal'+i].value;
				if (how_cal==1) new_total_prc+=oprc;
				else if (how_cal==3) {
					oprc_ea=eval(f.elements['opt_ea'+i].value);
					if (!oprc_ea || oprc_ea<1) oprc_ea=1;
					new_total_prc+=oprc*oprc_ea;
				} else {
					new_total_prc*=oprc;
				}
			//}
		}
	}

	var tmp1=document.getElementById('sell_prc_str');
	f.new_total_prc.value=new_total_prc;
	if(tmp1) tmp1.innerHTML=setComma(new_total_prc);
}

function addWish(f, mode){
	if(!mode) mode = 'add';
	f.exec.value = mode;
	f.rURL.value=this_url;
	f.target=hid_frame;
	f.action=root_url+'/main/exec.php?exec_file=mypage/wish.exe.php';
	f.submit();
}

function checkWish(f){
	if (eval(f.total_wish.value)<1) {
		alert('위시리스트가 비었습니다');
		return false;
	}
	return true;
}

function cartToWish(f){ //2011-04-11 위시리스트 담기 Jung
		if(!checkCB(f.cno,"위시리스트에 담을 상품을 하나 이상")) return;
		f.exec_file.value = "mypage/wish.exe.php";
		f.exec.value='add';
		f.submit();
}

function deleteWish(f){
	if(!checkWish(f)) return;
	if(!checkCB(f.wno,"삭제할 상품을 하나 이상")) return;
	f.exec.value='delete';
	f.submit();
}

function cartWish(f){ // 2007-12-13 : wishlist > cart - Han
	if(!checkWish(f)) return;
	if(!checkCB(f.wno,"장바구니에 담을 상품을 하나 이상")) return;
	f.exec_file.value = "cart/cart.exe.php";
	f.exec.value='from_wish';
	f.submit();
}

function checkCart(f){
	if (f.cart_rows.value=="0")
	{
		alert('장바구니가 비었습니다');
		return false;
	}
	return true;
}

function deleteCart(f){
	if(!checkCart(f)) return;
	if(!checkCB(f.cno,"삭제할 상품을 하나 이상")) return;
	f.exec.value='delete';

	// 2008-10-16 : 에이스카운터 - Han
	if(typeof ace_counter_cart != 'undefined'){
		if(ace_counter_cart == '1'){
			cnum=f['cno[]'].length ? f['cno[]'].length : 1;
			for(ii=0; ii<cnum; ii++){ 
				if(cnum > 1){
					if(f['cno[]'][ii].checked) {
						if (document.getElementsByName("buy_ea["+ii+"]").length > 0) AEC_F_D(_AEC_prodidlist[ii], 'o', f['buy_ea['+ii+']'].value);
						else AEC_F_D(_AEC_prodidlist[ii], 'o', f['buy_ea[]'][ii].value);
					}
				}else{
					if(f['cno[]'].checked) {
						if (document.getElementsByName("buy_ea["+ii+"]").length > 0) AEC_F_D(_AEC_prodidlist[ii], 'o', f['buy_ea['+ii+']'].value);
						else AEC_F_D(_AEC_prodidlist[ii], 'o', f['buy_ea[]'].value);
					}
				}
			}
		}
	}
	f.submit();
}

function deletePartCart(f,cn){
	if(!checkCart(f)) return;
	if(f['cno[]'].length > 1) {
		f.cno[cn].checked=true;
	} else {
		f.cno.checked=true;
	}
	f.exec.value='delete';
	f.submit();
}

function truncateCart(f){
	if(!checkCart(f)) return;
	if (!confirm('장바구니를 모두 비우시겠습니까?')) return;
	f.exec.value='truncate';

	// 2008-10-16 : 에이스카운터 - Han
	if(typeof ace_counter_cart != 'undefined'){
		if(ace_counter_cart == '1'){
			AEC_D_A();
		}
	}
	f.submit();
}

function updateCart(f){
	if(!checkCart(f)) return;
	checkAll(f.cno,true);
	f.exec.value='update';

	// 2008-10-16 : 에이스카운터 - Han
	if(typeof ace_counter_cart != 'undefined'){
		if(ace_counter_cart == '1'){
			cnum=f['cno[]'].length ? f['cno[]'].length : 1;
			for(ii=0; ii<cnum; ii++){ 
				if(cnum > 1){
					if (document.getElementsByName("buy_ea["+ii+"]").length > 0) AEC_U_V(_AEC_prodidlist[ii], f['buy_ea['+ii+']'].value);
					else AEC_U_V(_AEC_prodidlist[ii], f['buy_ea[]'][ii].value);
				}else{
					if (document.getElementsByName("buy_ea["+ii+"]").length > 0) AEC_U_V(_AEC_prodidlist[ii], f['buy_ea['+ii+']'].value);
					else AEC_U_V(_AEC_prodidlist[ii], f['buy_ea[]'].value);
				}
			}
		}
	}
	f.submit();
}

function orderCart(f, checked){
	if(!checkCart(f)) return;
	u=root_url+'/shop/order.php';
	if (typeof f.cart_where!='undefined' && f.cart_where.value)
	{
		u+='?cart_where='+f.cart_where.value;
	}

	if(checked == 'checked') {
		if(!checkCB(f.cno,"구매할 상품을 하나 이상")) return;
		f.action = u;
		f.target = '_self';
		f.submit();
	} else {
		location.href=u;
	}
}

function orderCartAll(){
	c1=eval(document.cartFrm1.cart_rows.value);
	c2=eval(document.cartFrm2.cart_rows.value);

	total_cart=c1+c2;
	if (total_cart==0)
	{
		alert('장바구니가 비었습니다  ');
		return;
	}
	if (c2>0 && !confirm('\n 일반 상품과 무이자 할부 상품을 함께 구매하실 경우     \n\n 무이자 할부가 불가능합니다\n\n 계속하시겠습니까?\n'))
	{
		return;
	}
	location.href=root_url+'/shop/order.php';
}

function checkRevFrm(f){

	if (ra==2)
	{
		if(!memberOnly(this_url,1,1)) return false;

	}
	if (ra==1 && mlv==10)
	{
		if (f.name.value=='이름') f.name.value='';
		if (f.pwd.value=='비밀번호') f.pwd.value='';
		if(!checkBlank(f.name,'이름을')) return false;
		if(!checkBlank(f.pwd,'비밀번호를')) return false;
	}
	if (typeof f.rev_pt!='undefined')
	{
		if (f.pno.value) pmsg="상품의 점수를";
		else pmsg="점수를";

		if (!checkCB(f.rev_pt,pmsg)) return false;
	}
	
	if(!checkBlank(f.title,'제목을')) return false;
	if(review_strlen){
		if(review_strlen > f.title.value.length){ alert("제목은 "+review_strlen+"자 이상 입력하셔야 합니다"); return false; }
	}
	if(!checkBlank(f.content,'상품평을')) return false;

	return true;
}

function checkQnaFrm(f){

	if (qa==2)
	{
		if(!memberOnly(this_url,1,1)) return false;

	}
	if (qa=='' && mlv==10)
	{
		if (f.name.value=='이름') f.name.value='';		
		if(!checkBlank(f.name,'이름을')) return false;

		if (f.pwd.value=='비밀번호' || f.pwd.value=='pass') f.pwd.value='';
		if(!checkBlank(f.pwd,'비밀번호를')) return false;
	}

	if (typeof f.cate!='undefined')
	{
		if (!checkSel(f.cate,'분류를')) return false;
	}
	if(!checkBlank(f.title,'제목을')) return false;
	if(qna_strlen){
		if(qna_strlen > f.title.value.length){ alert("제목은 "+qna_strlen+"자 이상 입력하셔야 합니다"); return false; }
	}
	if(!checkBlank(f.content,'내용을')) return false;
	return true;
}

// 상푸 후기 쓰기 레이어 열기
function writeReview(){
	var tmp=document.getElementById('revWriteDiv');
	if (ra=='2')
	{
		if(memberOnly(this_url,1,1)) layTgl(tmp);		
	}
	else if (ra=='3')
	{
		alert('본 상품을 구매한 고객만 상품평을 작성하실 수 있습니다');
		return;
	}
	else layTgl(tmp);		
}

// 상푸 질답 쓰기 레이어 열기
function writeQna(){
	if (qna_edit==2)
	{
		f=document.qnaFrm;
		if (typeof f.name!='undefined') {
			f.name.readOnly=false;
			f.name.style.backgroundColor='';
			f.name.value='';
		}
		if (typeof f.pwd!='undefined') {
			f.pwd.readOnly=false;
			f.pwd.style.backgroundColor='';
			f.pwd.value='';
		}
		f.title.value="";
		f.content.value="";
		qna_edit=1;
	}
	var tmp=document.getElementById('qnaWriteDiv');
	if (qa=='2' || qa=='3')
	{
		if(memberOnly(this_url,1,1)) layTgl(tmp);		
	}
	else layTgl(tmp);		
}
// 추천메일보내기 팝업창열기 2006-11-17 - Han
function recomMail(pno,w,h){
	if(mlv == 10){
	    c=confirm("\n 로그인이 필요한 서비스입니다          \n\n 로그인하시겠습니까? \n");
		if(c){
			window.location=root_url+'/member/login.php?rURL='+escape(this_url);
		}
		return;
	}
	if (!w) w=600
	if (!h) h=500
	url=root_url+'/shop/product_request.php?pno='+pno;
	window.open(url,'proRequest','top=10,left=10,height='+h+',width='+w+',status=no,scrollbars=yes,toolbar=no,menubar=no');
}
// 추천메일보내기 폼체크 2006-11-20 - Han
function checkProRequest(frm){
	if (!checkBlank(frm.from_name,"보내는 사람의 이름을")) return false;
	if (!checkBlank(frm.from_email,"보내는 사람의 이메일을")) return false;
	if(CheckMail(frm.from_email.value) == false){
		alert("보내는 사람의 정확한 메일주소를 입력하세요."); return false;
	}
	if (!checkBlank(frm.to_name,"받는 사람의 이름을")) return false;
	if (!checkBlank(frm.to_email,"받는 사람의 이메일을")) return false;
	if(CheckMail(frm.to_email.value) == false){
		alert("받는 사람의 정확한 메일주소를 입력하세요."); return false;
	}
	if (!checkBlank(frm.sub,"제목을")) return false;
	if (!checkBlank(frm.content,"내용을")) return false;
}
function checkRevCmt(f){
	if (!checkBlank(f.content,'내용을')) return false;
}

function delRevCmt(no){
	if (!confirm('삭제하시겠습니까?')) return;
	f=document.reviewDelFrm;
	f.no.value=no;
	f.exec_file.value='shop/review_comment.exe.php';
	f.submit();
}

function delRev(no){
	ams='';
	if (alv!='')
	{
		ams='\n\n (현재 쇼핑몰 관리자로 로그인중이므로 바로 삭제됩니다)';
	}
	if (!confirm('\n 삭제하시겠습니까?  '+ams+'\n')) return;
	f=document.reviewDelFrm;
	f.no.value=no;
	f.exec_file.value='shop/review_reg.exe.php';
	f.submit();
}

function editRev(no){
	f=document.reviewDelFrm;
	f.no.value=no;
	f.exec_file.value='shop/review_edit.php';
	f.submit();
}
// <2006-11-22 Qna수정, 삭제기능추가 - Han
function delQna(no){
	ams='';
	if (alv!='')
	{
		ams='\n\n (현재 쇼핑몰 관리자로 로그인중이므로 바로 삭제됩니다)';
	}
	if (!confirm('\n 삭제하시겠습니까?  '+ams+'\n')) return;
	f=document.qnaFrm;
	f.no.value=no;
	f.exec_file.value='shop/qna_reg.exe.php';
	f.exec.value='delete';
	f.submit();
}
function conDelQna(no){ // 2007-03-07 : Qna삭제기능 보완 - Han
	f=document.forms["qna_pfrm"+no];
	f.exec_file.value="shop/qna_reg.exe.php";
	f.exec.value='delete';
	document.getElementById('qna_pwd'+no).style.display='block';
	document.getElementById('qna_modi'+no).style.display='none';
}
function conDelRev(no){ // 2007-03-07 : Review삭제기능 보완 - Han
	f=document.forms["review_pfrm"+no];
	f.exec_file.value="shop/review_reg.exe.php";
	f.exec.value='delete';
	document.getElementById('review_pwd'+no).style.display='block';
	document.getElementById('review_modi'+no).style.display='none';
}
function editQna(no){
	qna_edit=2;
	f=document.qnaFrm;
	f.no.value=no;
	f.exec_file.value='shop/qna_edit.php';
	f.exec.value='';
	f.submit();
}
function checkQnapwdFrm(f){
	if(!checkBlank(f.pwd,'비밀번호를')) return false;
}
function checkQnaModiFrm(f){
	if (typeof f.cate!='undefined')
	{
		if (!checkSel(f.cate,'분류를')) return false;
	}
	if(!checkBlank(f.title,'제목을')) return false;
	if(!checkBlank(f.content,'내용을')) return false;
}
// >
// <2006-11-24 Review수정, 삭제기능추가 - Han
function checkReviewpwdFrm(f){
	if(!checkBlank(f.pwd,'비밀번호를')) return false;
}
function checkReviewModiFrm(f){
	if(!checkBlank(f.title,'제목을')) return false;
	if(!checkBlank(f.content,'내용을')) return false;
}
// >

function zoomView(pno,w,h){
	if (!w) w=735;
	if (!h) h=630;

	url=root_url+'/shop/zoom.php?pno='+pno;
	window.open(url,'wmZoomView','top=10,left=10,height='+h+',width='+w+',status=no,scrollbars=no,toolbar=no,menubar=no');
}

function noPrd(){
	alert('현재 판매중인 상품이 아닙니다');
}

function orderCust(tp,newstat){
	var cf=document.orderCustFrm;
	var oldstat=eval(cf.stat.value);
	if (oldstat>10 && newstat>10)
	{
		alert('취소/환불/반품 접수중입니다');
		return;
	}
	if(newstat == 1 && oldstat > 2) {
		window.alert('배송이 시작된 주문은 변경하실 수 없습니다.');
		return;
	}
	if (newstat==12 && oldstat>3) // 취소
	{
		alert('주문 취소는 배송전에 가능합니다\n\n 반품 신청을 하십시오.\n');
		return;
	}
	if (newstat==16 && oldstat<4)
	{
		alert('반품 신청은 배송후에 가능합니다\n\n 주문 취소 신청을 하십시오.\n');
		return;
	}
	if(newstat == 18 && oldstat < 4) {
		window.alert('교환 신청은  배송후에 가능합니다.\n\n주문 취소 신청을 하십시오.\n');
		return;
	}

	cf.cate1.value=tp;
	cf.cate2.value=newstat;

	if (mlv==10) cf.method='post';
	else cf.method='get';
	cf.submit();
}

function checkCounselFrm(f){
	if (mlv==10)
	{
		if(!checkBlank(f.name,'이름을')) return false;
		if (!f.email.value)
		{
			alert('1:1 친절 상담은 이메일을 입력하셔야 답변을 받으실 수 있습니다');
			return false;
		}
	}

	if(!checkBlank(f.title,'문의 제목을')) return false;
	if(!checkBlank(f.content,'문의 내용을')) return false;
}


function toggleAttatchImage(s,w,h){
	var mimg1=document.getElementById('mainImg');
	if (mimg1.src==s) return;
	var mimg=document.getElementById('mimg_div');
	str='<img id="mainImg" src="'+s+'" width="'+w+'" height="'+h+'">';
	mimg.innerHTML=str;
/*
	var mimg=document.getElementById('mainImg');
	mimg.src=root_url+'/_image/_default/etc/spacer.gif';
	mimg.width=w;
	mimg.height=h;
	mimg.src=s;
*/
}

function csView(no,stat){
	layTglList('rev','revQna',no);

	return;

	if (!stat)
	{
		layTglList('rev','revQna',no);
	}
	else
	{
		alert('\n 현재 답변 준비중입니다 \n\n 확인후 신속히 답변드리겠습니다           \n');
		return;
	}
}

function checkQnaSecret(f){
	if (!checkBlank(f.pwd,"비밀번호를")) return false;
}

function downLoadCoupon(n){
	if (confirm('쿠폰을 다운받으시겠습니까?'))
	{
		curl=root_url+'/main/exec.php?exec_file=mypage/coupon_download.php&no='+n+'&rURL='+escape(this_url);
		window.frames[hid_frame].location.href=curl;
		//location.href=curl;
	}
}

function multiCart(f){
	total_ea=0;
	for (i=0; i<f.buy_ea.length; i++)
	{
		total_ea+=eval(f.buy_ea[i].value);
	}
	if (total_ea<=0) {
		alert('구매수량을 입력해주세요    ');
		return;
	}
	f.submit();
}

// <2006-11-28 수취확인 확인 함수 추가 - Han
function receiveProduct(ono, escrow_type, escrow_id){
	if(!confirm("상품을 받으셨습니까? \n\n상품을 받으신분은 '확인'버튼을 눌러주세요.")) return;

	if (escrow_type == "hana_escrow" && escrow_id ){
		var ef = document.getElementById("hana_escrow");
		if (ef)	{
			ef.tid.value = escrow_id;
			ef.ctype.value = "CFRM";

			approve();
			if ( status_cd != "SUCCESS" ) return;
		}
	}

	gurl=root_url+"/main/exec.php?exec_file=mypage/receive.exe.php&ono="+ono;
	window.frames[hid_frame].location.href=gurl;
}

function UserDefine() { // 하나 에스크로 구매완료/거절 메시지 처리함수(하나은행에서 지정된 메소드, 변수 명이므로 변경 불가)
	var f = document.cporder;
	var ctype = ( document.cporder.ctype.value == "CFRM" ) ? "구매완료가" : "구매거절이";

	if(status_cd == "SUCCESS")	{
		alert("에스크로 "+ctype+" 성공적으로 완료되었습니다.");
	} else if (status_cd == "CANCEL") {
		alert("에스크로 "+ctype+" 취소되었습니다.");
	} else {
		alert("에스크로 에러"+status_cd);
	}
}
// >

var mtopt_no=1;
function addMultiOpt(){ // 2007-03-20 : 멀티 옵션 추가 - Han
    var obj=document.all.multiOpt;
	if(!obj) return;
	var ori=obj.innerHTML;
	def=defaultOpt;
	if(def == ""){ alert(" 페이지로딩이 끝난 후 시도해 주시기 바랍니다"); return; }
	if(document.all.optDelImg){
		imgN="optDelImg";
		def=def.replace(imgN, imgN+mtopt_no);
		def=def.replace("visibility: hidden", "visibility: visible");
		def=def.replace("VISIBILITY: hidden", "VISIBILITY: visible");
		def=def.replace("deleteMultiOpt()", "deleteMultiOpt("+mtopt_no+")");
	}
	obj.innerHTML=ori+"<div id=\"multiOpt"+mtopt_no+"\">"+def+"</div>";
	mtopt_no++;
}

function deleteMultiOpt(objnum){ // 2007-03-20: 멀티 옵션 삭제 - Han
	if(!objnum) return;
	var obj=document.all["multiOpt"+objnum];
	if(!obj) return;
	obj.innerHTML="";
	optobj=document.all.multiOpt;
	if(!optobj) return;
	delobj="<DIV id="+obj.id+">&nbsp;</DIV>";
	var con=optobj.innerHTML.replace(delobj, "");
	optobj.innerHTML=con;
}

function rvQnaHit(type, no){ // 2007-12-04 : Review & Qna 조회수 증가 - Han
	window.frames[hid_frame].location.href=root_url+'/main/exec.php?exec_file=shop/hit.exe.php&type='+type+'&no='+no;
}

function modRevCmt(no){
	f=document.reviewDelFrm;
	f.no.value=no;
	f.exec.value='modify';
	f.exec_file.value='shop/review_comment.exe.php';
	f.submit();
}

function CyScrap(pno) {
	if(!cy_sid) {
		window.alert('Cy Open Scrap 서비스가 활성화 되어있지 않거나, SID가 등록되어있지 않습니다');
		return false;
	}

    var xml_url = escape(root_url+'/main/exec.php?exec_file=shop/cy_engine.exe.php&pno='+pno);
    var cyScrap_url = 'http://api.cyworld.com/openscrap/shopping/v1/?xu='+xml_url +'&sid='+cy_sid;

    window.open(cyScrap_url, 'cyopenscrap', 'width=450,height=410');
}



/* +----------------------------------------------------------------------------------------------+
' |  2010-04-22 네이버 체크아웃 by zardsama
' +----------------------------------------------------------------------------------------------+*/
function buy_nc() {
	if(nhn.CheckoutButton.prdable != 'Y') {
		window.alert('죄송합니다. 네이버 체크아웃으로 구매가 불가한 상품입니다');
		return false;
	}
	if(nhn.CheckoutButton.enable == 'N') {
		window.alert('죄송합니다. 재고가 부족하여 네이버 체크아웃으로 구매하실 수 없습니다');
		return false;
	}
	addCart(document.prdFrm, 'checkout');
}

function wishlist_nc() {
	if(nhn.CheckoutButton.prdable != 'Y') {
		window.alert('죄송합니다. 네이버 체크아웃으로 구매가 불가한 상품입니다');
		return false;
	}
	if(nhn.CheckoutButton.enable == 'N') {
		window.alert('죄송합니다. 재고가 부족하여 네이버 체크아웃으로 구매하실 수 없습니다');
		return false;
	}

	addWish(document.prdFrm, 'checkout');
}

function order_nc() {
	if(nhn.CheckoutButton.enable == 'N') {
		window.alert('장바구니에 구매할 상품이 없습니다.');
		return false;
	}

	var fr = document.getElementsByName('cartFrm');
	try {
		fr = fr[0];
		fr.exec.value = 'checkout';
		fr.submit();
	} catch (e) {
		window.alert('체크아웃 구매하기 에러입니다.');
		window.alert(e.description);
	}
}

function buy_ipay() {
	addCart(document.prdFrm, 'ipay');
}

function order_ipay() {
	var fr = document.getElementsByName('cartFrm');
	try {
		fr = fr[0];
		fr.exec.value = 'ipay';
		fr.submit();
	} catch (e) {
		window.alert('iPay 구매하기 에러입니다.');
		window.alert(e.description);
	}
}