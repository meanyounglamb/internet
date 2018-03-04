//==============================================================================
//  SYSTEM      :  ������ ũ�ν� ������� Ajax�� ���̺귯��
//  PROGRAM     :  XMLHttpRequest�� ���� �ۼ����� �մϴ�
//  FILE NAME   :  jslb_ajaxXXX.js
//  CALL FROM   :  Ajax Ŭ���̾�Ʈ
//  AUTHER      :  Toshirou Takahashi http://jsgt.org/mt/01/
//  SUPPORT URL :  http://jsgt.org/mt/archives/01/000409.html
//  CREATE      :  2005.6.26
//  TEST-URL    :  ��� http://jsgt.org/ajax/ref/lib/test_head.htm
//  TEST-URL    :  ����   http://jsgt.org/mt/archives/01/000428.html
//  TEST-URL    :  �񵿱� 
//        http://allabout.co.jp/career/javascript/closeup/CU20050615A/index.htm
//  TEST-URL    :  SQL     http://jsgt.org/mt/archives/01/000392.html
//------------------------------------------------------------------------------
// �ֽ� ����   : http://jsgt.org/mt/archives/01/000409.html 
// ���۱� ǥ���ǹ� ����. ��� �̿�� ������ ����. ���� �ʿ� ����.
//
//

	////
	// ���۰����� ������ ����
	//
	// @sample        if(chkAjaBrowser()){ location.href='nonajax.htm' }
	// @sample        oj = new chkAjaBrowser();if(oj.bw.safari){ /* Safari �ڵ� */ }
	// @return        ���̺귯���� ���۰����� �������� true  true|false
	//
	//  Enable list (v038����)
	//   WinIE 5.5+ 
	//   Konqueror 3.3+
	//   AppleWebKit��(Safari,OmniWeb,Shiira) 124+ 
	//   Mozilla��(Firefox,Netscape,Galeon,Epiphany,K-Meleon,Sylera) 20011128+ 
	//   Opera 8+ 
	//
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
	

	////
	// XMLHttpRequest ������Ʈ ����
	//
	// @sample        oj = createHttpRequest()
	// @return        XMLHttpRequest ������Ʈ(�ν��Ͻ�)
	//
	function createHttpRequest()
	{
		if(window.ActiveXObject){
			 //Win e4,e5,e6��
			try {
				return new ActiveXObject("Msxml2.XMLHTTP") ;
			} catch (e) {
				try {
					return new ActiveXObject("Microsoft.XMLHTTP") ;
				} catch (e2) {
					return null ;
	 			}
	 		}
		} else if(window.XMLHttpRequest){
			 //Win Mac Linux m1,f1,o8 Mac s1 Linux k3��
			return new XMLHttpRequest() ;
		} else {
			return null ;
		}
	}
	
	////
	// �ۼ��� �Լ�
	//
	// @sample         sendRequest(onloaded,'&prog=1','POST','./about2.php',true,true)
	// @param callback �ۼ��Žÿ� �⵿�ϴ� �Լ� �̸�
	// @param data	   �۽��ϴ� ������ (&�̸�1=��1&�̸�2=��2...)
	// @param method   "POST" �Ǵ� "GET"
	// @param url      ��û�ϴ� ������ URL
	// @param async	   �񵿱��� true ������ false
	// @param sload	   ���� �ε� true�� �����������Ǵ� false�� �⺻
	// @param user	   ���� �������� ����� �̸�
	// @param password ���� �������� ��ȣ
	//
	function sendRequest(callback,data,method,url,async,sload,user,password)
	{
		//XMLHttpRequest ������Ʈ ����
		var oj = createHttpRequest();
		if( oj == null ) return null;
		
		//���� �ε��� ����
		var sload = (!!sendRequest.arguments[5])?sload:false;
		if(sload || method.toUpperCase() == 'GET')url += "?";
		if(sload)url=url+"t="+(new Date()).getTime();
		
		//������ ����
		var bwoj = new chkAjaBrowser();
		var opera	  = bwoj.bw.opera;
		var safari	  = bwoj.bw.safari;
		var konqueror = bwoj.bw.konqueror;
		var mozes	  = bwoj.bw.mozes ;

		//�۽� ó��
		//opera�� onreadystatechange�� �ߺ� ������ ���� �� �־� onload�� ����
		//Moz,FireFox�� oj.readyState==3������ �����ϹǷ� ������ onload�� ����
		//Win ie������ onload�� �������� �ʴ´�
		//Konqueror�� onload�� �Ҿ���
		//���� http://jsgt.org/ajax/ref/test/response/responsetext/try1.php
		if(opera || safari || mozes){
			oj.onload = function () { callback(oj); }
		} else {
		
			oj.onreadystatechange =function () 
			{
				if ( oj.readyState == 4 ){
					callback(oj);
				}
			}
		}

		//URL ���ڵ�
		data = uriEncode(data)
		if(method.toUpperCase() == 'GET') {
			url += data
		}
		
		//open �޼ҵ�
		oj.open(method,url,async,user,password);

		//��� application/x-www-form-urlencoded ����
		setEncHeader(oj)

		//�����
		//alert("////jslb_ajaxxx.js//// \n data:"+data+" \n method:"+method+" \n url:"+url+" \n async:"+async);
		
		//send �޼ҵ�
		oj.send(data);

		//URI ���ڵ� ��� ����
		function setEncHeader(oj){
	
			//��� application/x-www-form-urlencoded ����
			// @see  http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/interact/forms.html#h-17.13.3
			// @see  #h-17.3
			//   ( enctype�� �⺻���� "application/x-www-form-urlencoded")
			//   h-17.3�� ���ء�POST/GET ������� ����
			//   POST���� "multipart/form-data"�� ������ �ʿ䰡 �ִ� ��쿡�� Ŀ���͸����� ���ּ���.
			//
			//  �� �޼ҵ尡 Win Opera8.0���� ������ ���Ƿ� �б�(8.01�� OK)
			var contentTypeUrlenc = 'application/x-www-form-urlencoded; charset=utf-8';
			if(!window.opera){
				oj.setRequestHeader('Content-Type',contentTypeUrlenc);
			} else {
				if((typeof oj.setRequestHeader) == 'function')
					oj.setRequestHeader('Content-Type',contentTypeUrlenc);
			}	
			return oj
		}

		//URL ���ڵ�
		function uriEncode(data){

			if(data!=""){
				//&��=�� �ϴ� �����ؼ� encode
				var encdata = '';
				var datas = data.split('&');
				for(i=1;i<datas.length;i++)
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

