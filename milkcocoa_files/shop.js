var qna_edit=1;
function addCart(f,next) {
	var astr = '';
	var ems = '';

	if (f.stat.value!=2) {
		ems = '\n �˼��մϴ�\n\n '+soldout_name+'�� ��ǰ�� �ֹ��� �� �����ϴ�.\t\n';
		if (typeof f.sold_reserve!='undefined' && f.sold_reserve.value=='Y') {
			ems+='\n �����ֹ��ϱ⸦ �̿��Ͻø� �԰��� �����帮�ڽ��ϴ�.\t';
		}
		window.alert(ems);
		return;
	}

	var min_ord=eval(f.min_ord.value);
	var max_ord=eval(f.max_ord.value);
	var buy_ea=eval(f.buy_ea.value);

	if (buy_ea<min_ord) {
		if(min_ord>1) astr='�� ��ǰ�� ';
		window.alert(astr+'�ּ� '+min_ord+'�� �̻� �����ϼž��մϴ�.\t');
		f.buy_ea.value=min_ord;
		return;
	}

	if (max_ord && buy_ea>max_ord) {
		window.alert('�� ��ǰ�� �ִ� '+max_ord+'������ �����Ͻ� �� �ֽ��ϴ�.\t');
		f.buy_ea.value=max_ord;
		return;
	}

	var opt_no = f.opt_no.value.toNumber();
	if (opt_no > 0) {
		for (j=1; j<=eval(opt_no); j++)	{
			if(!f.elements['option_necessary'+j]) continue;
			if (f.elements['option_necessary'+j].value=="Y" || f.elements['option_necessary'+j].value=="C") { // necessary
				if (f.elements['option_type'+j].value==2) { // select
					if (!checkSel(f.elements['option'+j],f.elements['option_name'+j].value+'��(��)')) return;
				} else { // radio, checkbox
					if (!checkCB(f.elements['option'+j],f.elements['option_name'+j].value+'��(��)')) return;
				}
			}

			// <2006-12-01 : �ɼ����üũ - Han
			if(f.elements['option_ea_ck'+j].value == "Y" && f.elements['option_necessary'+j].value=="Y") {
				if(f.elements['option_ea_num'+j].value < 1) {
					window.alert("�ش� �ɼ��� ǰ���Ǿ����ϴ�. - "+f.elements['option_name'+j].value+"   ");
					return;
				}
				if(buy_ea > f.elements['option_ea_num'+j].value) {
					window.alert("�ش� �ɼ��� "+f.elements['option_ea_num'+j].value+"������ ���Ű� �����մϴ�. - "+f.elements['option_name'+j].value+"   ");
					f.buy_ea.value=f.elements['option_ea_num'+j].value;
					return;
				}
			}
			// >
		}
	}

	if(typeof cart_direct_order != 'undefined' && next==2){
		if(cart_direct_order == 'D') cwith=confirm('\n ��ٱ��Ͽ� �ִ� ��ǰ�� �Բ� �ֹ��Ͻðڽ��ϱ�?\n\n \'���\'�� Ŭ���Ͻø� �����Ͻ� ��ǰ�� �ֹ��Ǹ� ���� ��ٱ��� ��ǰ�� �����˴ϴ�.                  ');
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

	// 2008-10-15 : ���̽� ī���� ó�� - Han
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
		ems = '\n �˼��մϴ�\n\n '+soldout_name+'�� ��ǰ�� �ֹ��� �� �����ϴ�.\t\n';
		if (typeof f.sold_reserve!='undefined' && f.sold_reserve.value=='Y') {
			ems+='\n �����ֹ��ϱ⸦ �̿��Ͻø� �԰��� �����帮�ڽ��ϴ�        ';
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
					if(f['option_type'+ii].value==2){ if(!checkSel(f['option'+ii+'[]'],f['option_name'+ii].value+'��(��)')) return; }
					else{ if(!checkCB(f['option'+ii+'[]'],f['option_name'+ii].value+'��(��)')) return; }
				}
			}
		}
	}else{
		for(jj=0; jj<ea_num; jj++){
			buy_ea += eval(f["buy_ea[]"][jj].value);
			if(opt_no>0){
				for(ii=1; ii<=opt_no; ii++){
					if(f['option_necessary'+ii].value=="Y"){
						if(f['option_type'+ii].value==2){ if(!checkSel(f['option'+ii+"[]"][jj],f['option_name'+ii].value+'��(��)')) return; }
						else{ if(!checkCB(f['option'+ii][jj],f['option_name'+ii].value+'��(��)')) return; }
					}
				}
			}
		}
	}
	if(buy_ea<min_ord){ 
		if(min_ord>1) astr='�� ��ǰ�� '; else astr='';
		alert(astr+'�ּ� '+min_ord+'�� �̻� �����ϼž��մϴ�'); return;
	}
	if(max_ord && buy_ea>max_ord){ alert('�� ��ǰ�� �ִ� '+max_ord+'������ �����Ͻ� �� �ֽ��ϴ�'); return; }

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
		window.alert('\n ���� ��ǰ�� ���� �Ǹ����Դϴ�\n\n �����ϱ� �Ǵ� ��ٱ��ϴ�⸦ Ŭ���ϼ���.\t\n');
		return;
	} else if (typeof f.sold_reserve=='undefined' || f.sold_reserve.value!='Y')	{
		alert('\n �˼��մϴ� \n\n ���� ��ǰ�� ���� �ֹ��� �Ұ����մϴ�.\t\n');
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
		alert('���ø���Ʈ�� ������ϴ�');
		return false;
	}
	return true;
}

function cartToWish(f){ //2011-04-11 ���ø���Ʈ ��� Jung
		if(!checkCB(f.cno,"���ø���Ʈ�� ���� ��ǰ�� �ϳ� �̻�")) return;
		f.exec_file.value = "mypage/wish.exe.php";
		f.exec.value='add';
		f.submit();
}

function deleteWish(f){
	if(!checkWish(f)) return;
	if(!checkCB(f.wno,"������ ��ǰ�� �ϳ� �̻�")) return;
	f.exec.value='delete';
	f.submit();
}

function cartWish(f){ // 2007-12-13 : wishlist > cart - Han
	if(!checkWish(f)) return;
	if(!checkCB(f.wno,"��ٱ��Ͽ� ���� ��ǰ�� �ϳ� �̻�")) return;
	f.exec_file.value = "cart/cart.exe.php";
	f.exec.value='from_wish';
	f.submit();
}

function checkCart(f){
	if (f.cart_rows.value=="0")
	{
		alert('��ٱ��ϰ� ������ϴ�');
		return false;
	}
	return true;
}

function deleteCart(f){
	if(!checkCart(f)) return;
	if(!checkCB(f.cno,"������ ��ǰ�� �ϳ� �̻�")) return;
	f.exec.value='delete';

	// 2008-10-16 : ���̽�ī���� - Han
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
	if (!confirm('��ٱ��ϸ� ��� ���ðڽ��ϱ�?')) return;
	f.exec.value='truncate';

	// 2008-10-16 : ���̽�ī���� - Han
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

	// 2008-10-16 : ���̽�ī���� - Han
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
		if(!checkCB(f.cno,"������ ��ǰ�� �ϳ� �̻�")) return;
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
		alert('��ٱ��ϰ� ������ϴ�  ');
		return;
	}
	if (c2>0 && !confirm('\n �Ϲ� ��ǰ�� ������ �Һ� ��ǰ�� �Բ� �����Ͻ� ���     \n\n ������ �Һΰ� �Ұ����մϴ�\n\n ����Ͻðڽ��ϱ�?\n'))
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
		if (f.name.value=='�̸�') f.name.value='';
		if (f.pwd.value=='��й�ȣ') f.pwd.value='';
		if(!checkBlank(f.name,'�̸���')) return false;
		if(!checkBlank(f.pwd,'��й�ȣ��')) return false;
	}
	if (typeof f.rev_pt!='undefined')
	{
		if (f.pno.value) pmsg="��ǰ�� ������";
		else pmsg="������";

		if (!checkCB(f.rev_pt,pmsg)) return false;
	}
	
	if(!checkBlank(f.title,'������')) return false;
	if(review_strlen){
		if(review_strlen > f.title.value.length){ alert("������ "+review_strlen+"�� �̻� �Է��ϼž� �մϴ�"); return false; }
	}
	if(!checkBlank(f.content,'��ǰ����')) return false;

	return true;
}

function checkQnaFrm(f){

	if (qa==2)
	{
		if(!memberOnly(this_url,1,1)) return false;

	}
	if (qa=='' && mlv==10)
	{
		if (f.name.value=='�̸�') f.name.value='';		
		if(!checkBlank(f.name,'�̸���')) return false;

		if (f.pwd.value=='��й�ȣ' || f.pwd.value=='pass') f.pwd.value='';
		if(!checkBlank(f.pwd,'��й�ȣ��')) return false;
	}

	if (typeof f.cate!='undefined')
	{
		if (!checkSel(f.cate,'�з���')) return false;
	}
	if(!checkBlank(f.title,'������')) return false;
	if(qna_strlen){
		if(qna_strlen > f.title.value.length){ alert("������ "+qna_strlen+"�� �̻� �Է��ϼž� �մϴ�"); return false; }
	}
	if(!checkBlank(f.content,'������')) return false;
	return true;
}

// ��Ǫ �ı� ���� ���̾� ����
function writeReview(){
	var tmp=document.getElementById('revWriteDiv');
	if (ra=='2')
	{
		if(memberOnly(this_url,1,1)) layTgl(tmp);		
	}
	else if (ra=='3')
	{
		alert('�� ��ǰ�� ������ ���� ��ǰ���� �ۼ��Ͻ� �� �ֽ��ϴ�');
		return;
	}
	else layTgl(tmp);		
}

// ��Ǫ ���� ���� ���̾� ����
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
// ��õ���Ϻ����� �˾�â���� 2006-11-17 - Han
function recomMail(pno,w,h){
	if(mlv == 10){
	    c=confirm("\n �α����� �ʿ��� �����Դϴ�          \n\n �α����Ͻðڽ��ϱ�? \n");
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
// ��õ���Ϻ����� ��üũ 2006-11-20 - Han
function checkProRequest(frm){
	if (!checkBlank(frm.from_name,"������ ����� �̸���")) return false;
	if (!checkBlank(frm.from_email,"������ ����� �̸�����")) return false;
	if(CheckMail(frm.from_email.value) == false){
		alert("������ ����� ��Ȯ�� �����ּҸ� �Է��ϼ���."); return false;
	}
	if (!checkBlank(frm.to_name,"�޴� ����� �̸���")) return false;
	if (!checkBlank(frm.to_email,"�޴� ����� �̸�����")) return false;
	if(CheckMail(frm.to_email.value) == false){
		alert("�޴� ����� ��Ȯ�� �����ּҸ� �Է��ϼ���."); return false;
	}
	if (!checkBlank(frm.sub,"������")) return false;
	if (!checkBlank(frm.content,"������")) return false;
}
function checkRevCmt(f){
	if (!checkBlank(f.content,'������')) return false;
}

function delRevCmt(no){
	if (!confirm('�����Ͻðڽ��ϱ�?')) return;
	f=document.reviewDelFrm;
	f.no.value=no;
	f.exec_file.value='shop/review_comment.exe.php';
	f.submit();
}

function delRev(no){
	ams='';
	if (alv!='')
	{
		ams='\n\n (���� ���θ� �����ڷ� �α������̹Ƿ� �ٷ� �����˴ϴ�)';
	}
	if (!confirm('\n �����Ͻðڽ��ϱ�?  '+ams+'\n')) return;
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
// <2006-11-22 Qna����, ��������߰� - Han
function delQna(no){
	ams='';
	if (alv!='')
	{
		ams='\n\n (���� ���θ� �����ڷ� �α������̹Ƿ� �ٷ� �����˴ϴ�)';
	}
	if (!confirm('\n �����Ͻðڽ��ϱ�?  '+ams+'\n')) return;
	f=document.qnaFrm;
	f.no.value=no;
	f.exec_file.value='shop/qna_reg.exe.php';
	f.exec.value='delete';
	f.submit();
}
function conDelQna(no){ // 2007-03-07 : Qna������� ���� - Han
	f=document.forms["qna_pfrm"+no];
	f.exec_file.value="shop/qna_reg.exe.php";
	f.exec.value='delete';
	document.getElementById('qna_pwd'+no).style.display='block';
	document.getElementById('qna_modi'+no).style.display='none';
}
function conDelRev(no){ // 2007-03-07 : Review������� ���� - Han
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
	if(!checkBlank(f.pwd,'��й�ȣ��')) return false;
}
function checkQnaModiFrm(f){
	if (typeof f.cate!='undefined')
	{
		if (!checkSel(f.cate,'�з���')) return false;
	}
	if(!checkBlank(f.title,'������')) return false;
	if(!checkBlank(f.content,'������')) return false;
}
// >
// <2006-11-24 Review����, ��������߰� - Han
function checkReviewpwdFrm(f){
	if(!checkBlank(f.pwd,'��й�ȣ��')) return false;
}
function checkReviewModiFrm(f){
	if(!checkBlank(f.title,'������')) return false;
	if(!checkBlank(f.content,'������')) return false;
}
// >

function zoomView(pno,w,h){
	if (!w) w=735;
	if (!h) h=630;

	url=root_url+'/shop/zoom.php?pno='+pno;
	window.open(url,'wmZoomView','top=10,left=10,height='+h+',width='+w+',status=no,scrollbars=no,toolbar=no,menubar=no');
}

function noPrd(){
	alert('���� �Ǹ����� ��ǰ�� �ƴմϴ�');
}

function orderCust(tp,newstat){
	var cf=document.orderCustFrm;
	var oldstat=eval(cf.stat.value);
	if (oldstat>10 && newstat>10)
	{
		alert('���/ȯ��/��ǰ �������Դϴ�');
		return;
	}
	if(newstat == 1 && oldstat > 2) {
		window.alert('����� ���۵� �ֹ��� �����Ͻ� �� �����ϴ�.');
		return;
	}
	if (newstat==12 && oldstat>3) // ���
	{
		alert('�ֹ� ��Ҵ� ������� �����մϴ�\n\n ��ǰ ��û�� �Ͻʽÿ�.\n');
		return;
	}
	if (newstat==16 && oldstat<4)
	{
		alert('��ǰ ��û�� ����Ŀ� �����մϴ�\n\n �ֹ� ��� ��û�� �Ͻʽÿ�.\n');
		return;
	}
	if(newstat == 18 && oldstat < 4) {
		window.alert('��ȯ ��û��  ����Ŀ� �����մϴ�.\n\n�ֹ� ��� ��û�� �Ͻʽÿ�.\n');
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
		if(!checkBlank(f.name,'�̸���')) return false;
		if (!f.email.value)
		{
			alert('1:1 ģ�� ����� �̸����� �Է��ϼž� �亯�� ������ �� �ֽ��ϴ�');
			return false;
		}
	}

	if(!checkBlank(f.title,'���� ������')) return false;
	if(!checkBlank(f.content,'���� ������')) return false;
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
		alert('\n ���� �亯 �غ����Դϴ� \n\n Ȯ���� �ż��� �亯�帮�ڽ��ϴ�           \n');
		return;
	}
}

function checkQnaSecret(f){
	if (!checkBlank(f.pwd,"��й�ȣ��")) return false;
}

function downLoadCoupon(n){
	if (confirm('������ �ٿ�����ðڽ��ϱ�?'))
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
		alert('���ż����� �Է����ּ���    ');
		return;
	}
	f.submit();
}

// <2006-11-28 ����Ȯ�� Ȯ�� �Լ� �߰� - Han
function receiveProduct(ono, escrow_type, escrow_id){
	if(!confirm("��ǰ�� �����̽��ϱ�? \n\n��ǰ�� �����ź��� 'Ȯ��'��ư�� �����ּ���.")) return;

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

function UserDefine() { // �ϳ� ����ũ�� ���ſϷ�/���� �޽��� ó���Լ�(�ϳ����࿡�� ������ �޼ҵ�, ���� ���̹Ƿ� ���� �Ұ�)
	var f = document.cporder;
	var ctype = ( document.cporder.ctype.value == "CFRM" ) ? "���ſϷᰡ" : "���Ű�����";

	if(status_cd == "SUCCESS")	{
		alert("����ũ�� "+ctype+" ���������� �Ϸ�Ǿ����ϴ�.");
	} else if (status_cd == "CANCEL") {
		alert("����ũ�� "+ctype+" ��ҵǾ����ϴ�.");
	} else {
		alert("����ũ�� ����"+status_cd);
	}
}
// >

var mtopt_no=1;
function addMultiOpt(){ // 2007-03-20 : ��Ƽ �ɼ� �߰� - Han
    var obj=document.all.multiOpt;
	if(!obj) return;
	var ori=obj.innerHTML;
	def=defaultOpt;
	if(def == ""){ alert(" �������ε��� ���� �� �õ��� �ֽñ� �ٶ��ϴ�"); return; }
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

function deleteMultiOpt(objnum){ // 2007-03-20: ��Ƽ �ɼ� ���� - Han
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

function rvQnaHit(type, no){ // 2007-12-04 : Review & Qna ��ȸ�� ���� - Han
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
		window.alert('Cy Open Scrap ���񽺰� Ȱ��ȭ �Ǿ����� �ʰų�, SID�� ��ϵǾ����� �ʽ��ϴ�');
		return false;
	}

    var xml_url = escape(root_url+'/main/exec.php?exec_file=shop/cy_engine.exe.php&pno='+pno);
    var cyScrap_url = 'http://api.cyworld.com/openscrap/shopping/v1/?xu='+xml_url +'&sid='+cy_sid;

    window.open(cyScrap_url, 'cyopenscrap', 'width=450,height=410');
}



/* +----------------------------------------------------------------------------------------------+
' |  2010-04-22 ���̹� üũ�ƿ� by zardsama
' +----------------------------------------------------------------------------------------------+*/
function buy_nc() {
	if(nhn.CheckoutButton.prdable != 'Y') {
		window.alert('�˼��մϴ�. ���̹� üũ�ƿ����� ���Ű� �Ұ��� ��ǰ�Դϴ�');
		return false;
	}
	if(nhn.CheckoutButton.enable == 'N') {
		window.alert('�˼��մϴ�. ��� �����Ͽ� ���̹� üũ�ƿ����� �����Ͻ� �� �����ϴ�');
		return false;
	}
	addCart(document.prdFrm, 'checkout');
}

function wishlist_nc() {
	if(nhn.CheckoutButton.prdable != 'Y') {
		window.alert('�˼��մϴ�. ���̹� üũ�ƿ����� ���Ű� �Ұ��� ��ǰ�Դϴ�');
		return false;
	}
	if(nhn.CheckoutButton.enable == 'N') {
		window.alert('�˼��մϴ�. ��� �����Ͽ� ���̹� üũ�ƿ����� �����Ͻ� �� �����ϴ�');
		return false;
	}

	addWish(document.prdFrm, 'checkout');
}

function order_nc() {
	if(nhn.CheckoutButton.enable == 'N') {
		window.alert('��ٱ��Ͽ� ������ ��ǰ�� �����ϴ�.');
		return false;
	}

	var fr = document.getElementsByName('cartFrm');
	try {
		fr = fr[0];
		fr.exec.value = 'checkout';
		fr.submit();
	} catch (e) {
		window.alert('üũ�ƿ� �����ϱ� �����Դϴ�.');
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
		window.alert('iPay �����ϱ� �����Դϴ�.');
		window.alert(e.description);
	}
}