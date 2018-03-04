var ajax_divname,req,hid_now,pg_type;

function prdBoardView(type, no){
	ajax_divname=(type == 'review') ? 'revContent'+no : 'revQna'+no;

	w=document.getElementById(ajax_divname);
	if(!w) return;

	if(w.style.display == 'block'){
		w.style.display='none';
		return;
	}

	pg_type=pg_type ? pg_type : '';
	hid_now=hid_now ? hid_now : '';
	no=no ? no : '';

	req=newXMLHttpRequest();
	req.onreadystatechange=processReqChange;
	q=root_url+'/main/exec.php?exec_file=shop/'+type+'_reg.exe.php&urlfix=Y&exec=view&hid_now='+hid_now+'&no='+no+'&pg_type='+pg_type;
	req.open('POST',q,true);
	req.send(q);
}

function newXMLHttpRequest() {
	var xmlreq = false;

	if (window.XMLHttpRequest) {
		xmlreq = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			xmlreq = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e1) {
			try {
				xmlreq = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e2) {
				// Unable to create an XMLHttpRequest with ActiveX
			}
		}
	}
	return xmlreq;
}

function processReqChange() {
	if (req.readyState == 4) {
		if (req.status == 200) {
			printData();
		} else {
			//alert("시스템 점검 중입니다 (No XML):\n" +  req.statusText);
		}
	}
}

function printData() {
	result=req.responseText;
	var mdv=document.getElementById(ajax_divname);
	mdv.innerHTML=result;
	mdv.style.display='block';
}

function autoImgResize(obj, w){
	if(obj.offsetWidth > w) obj.style.width=w+'px';
}