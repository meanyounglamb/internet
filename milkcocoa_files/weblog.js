/*
 * make cookie if contain cafe_mkt parameter in url
 */

var cmc_document = document;
var s_uid;    
var s_uname;    
var doc_uid;
var s_url = cmc_document.URL;
var cmclog_ref = "";
var cmc_adid = "";
var cmc_CUK45 = "";          //45days cookie
var cmc_CID = "";

// make s_uid, s_uname from script src url
var src_path = document.getElementById('cmclog_script').src;

var uid_end = src_path.lastIndexOf("uid=",src_path);
var uname_start = src_path.indexOf("uname=",src_path);
var uname_end = src_path.lastIndexOf("uname=",src_path);

s_uid=src_path.substring(uid_end+4,uname_start-1);
s_uname=src_path.substring(uname_end+6,src_path.length);

//set_Cuk45_Cookie();
var cmc_domain = "";
var cmc_temp_domain = document.URL.match(/https?\:\/\/(www\.)?([^\/]*)/);
if(cmc_temp_domain&&cmc_temp_domain[2]) cmc_domain = "."+cmc_temp_domain[2];
var today = new Date();

var cookie_day = 45 ;   // 45day cookie add

var cmc_id_new = s_uid.replace("_","-");	//new domain change

var cookie_ck="F";
var cookie_ck2="F";
for (var i in temp=document.cookie.split('; ')) {
  if(typeof(temp[i])=='string') {
    var cmc_cs = temp[i].split('=');
    if(/^CMC_CUK45/.test(cmc_cs[0])) {
      if(cmc_cs[1] == 'undefined' || cmc_cs[1] == '') {
        cookie_ck ='F';
      } else {
        // 45일 쿠키있음
        cookie_ck ='T';
        setCookie("CMC_CUK45", cmc_cs[1],cookie_day);
        cmc_CUK45 = cmc_cs[1] ;
      }
      continue ;
    } 
    if(/^CID/.test(cmc_cs[0]) || /^CMCID/.test(cmc_cs[0])) {
      if(cmc_cs[1] == 'undefined' || cmc_cs[1] == '') {
        cookie_ck2 ='F';
      } else {
        // lifttime이 없는 쿠키있음
        cookie_ck2 ='T';
        var cmc_cid_1 = cmc_cs[1].split("_");
        if(cmc_cid_1[0] == 'CID') {
          var cmc_cid_cs = cmc_cs[1].replace('CID','CMCID');
        } else {
          var cmc_cid_cs = cmc_cs[1] ;
        }
        cmc_CID = cmc_cid_cs ;
      }
      continue ;
    }
  }
}

if(cookie_ck == 'F'){
  setCookie("CMC_CUK45", "CUK45_"+s_uid+"_"+today.getTime(),cookie_day);
  cmc_CUK45 = "CUK45_"+s_uid+"_"+today.getTime() ;
}
if(cookie_ck2 == 'F'){
  setCookie2("CMCID", "CMCID_"+s_uid+"_"+today.getTime());
  cmc_CID = "CMCID_"+s_uid+"_"+today.getTime() ;
}

// NVAR -> n_media change 2016.05
if(/cafe_mkt=/.test(s_url) || /NVAR=/.test(s_url) || /OVRAW=/.test(s_url) || /DMCOL=/.test(s_url) || /n_media=/.test(s_url) || /NCKWDM=/.test(s_url) ){
  // get ref
  if (cmc_document.referrer) {
    cmclog_ref=cmc_document.referrer;
  } else {
    try {
      if (opener&&typeof(opener) == "object") {
        if (typeof(opener.document) != "unknown") {
          cmclog_ref = opener.document.URL;
        }
      }
      if (! cmclog_ref) {
        if (typeof(parent) == "object" ) {
          if (typeof(parent.document) != "unknown") {
            cmclog_ref = parent.document.referrer;
          }
        }
        if (! cmclog_ref) {
          if (parent.opener&&typeof(parent.opener) == "object" ) {
            if (typeof(parent.opener.document) != "unknown") {
              cmclog_ref = parent.opener.document.referrer;
            }
          }
        }
      }
    }
    catch(e) {
    }
    finally {
      ref = '';
    }
  }

  if (! cmclog_ref && opener) {
    try {
      if (typeof(opener) == "object" ) {
        if (typeof(opener.parent) == "object" ) {
          if (typeof(opener.parent.document) != "unknown") {
            cmclog_ref = opener.parent.document.referrer;
          }
        }
      }
    }
    catch(e) {
    }
    finally {
      ref = '';
    }
  }
  // 2 - end
  
  // 프로토콜
  var protocol_pre = "http://";
  if ("https:" == document.location.protocol) protocol_pre = "https://";

  var cmc_docUid = escape("cmclog-sell.html?type=ref_mkt_cuk&mall_id="+s_uid+"&CUK45="+cmc_CUK45+"&uref="+cmclog_ref+"&CMCID="+cmc_CID);
  document.write(unescape("%3Cscript src='"+protocol_pre + cmc_id_new+ "." + "cmclog.cafe24.com/"+cmc_docUid+"' type='text/javascript'%3E%3C/script%3E"));
}

/*
 * set 45 cookie function
 */
function setCookie(cookieName, value, exdays){
    var exdate = new Date();
    var cmc_temp_domain = document.URL.match(/https?\:\/\/(www\.)?([^\/]*)/);
    var cmc_domain = "";
    if(cmc_temp_domain&&cmc_temp_domain[2]) cmc_domain = "."+cmc_temp_domain[2];

    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue + ";path=/" + ";domain="+cmc_domain;
}
/*
 * set lifetime 0 cookie function
 */
function setCookie2(cookieName, value){
    var today = new Date();
    var cmc_temp_domain = document.URL.match(/https?\:\/\/(www\.)?([^\/]*)/);
    var cmc_domain = "";
    if(cmc_temp_domain&&cmc_temp_domain[2]) cmc_domain = "."+cmc_temp_domain[2];

    document.cookie = cookieName +"=" + value+";path=/" + ";domain="+cmc_domain;   
}