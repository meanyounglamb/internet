var m_option_cnt = 1;  // 추가 옵션 개수 (옵션 다중 선택 기능 사용시)
var naverChk_soldout_flag = 'T'; //네이버 페이 품절에 따른 표시여부
var naverChk_dlv_flag     = 'T'; //네이버 페이 해외배송에 따른 표시여부

var isPrdView = 'T';
var sCommentInsertParam = '';   //상품사용후기, 상품 Q&A 댓글 파라미터

/*
    수량 조절기능
    @modify 최환호 <hhchoi@simplexi.com>
    @date 2008-06-30
*/
function quantity_control()
{
    if (typeof(document.relationProd['basket_info[]'].length) == 'undefined') {
            if (window.event.srcElement == document.relationProd["up"]){
                document.relationProd["quantity1"].value = eval(document.relationProd["quantity1"].value)+1;
            }

            if (window.event.srcElement == document.relationProd["down"] && document.relationProd["quantity1"].value > 1){
                document.relationProd["quantity1"].value = eval(document.relationProd["quantity1"].value)-1;
            }
            RtnPrd.prdChk(document.relationProd["basket_info[]"]);
    } else {
        for (i=0; i < document.relationProd["quantity1[]"].length; i++){
            if (window.event.srcElement == document.relationProd["up"][i]){
                document.relationProd["quantity1[]"][i].value = eval(document.relationProd["quantity1[]"][i].value)+1;
            }

            if (window.event.srcElement == document.relationProd["down"][i] && document.relationProd["quantity1[]"][i].value > 1){
                document.relationProd["quantity1[]"][i].value = eval(document.relationProd["quantity1[]"][i].value)-1;
            }
            RtnPrd.prdChk(document.relationProd["basket_info[]"][i]);
        } //end for
    }
}



/**
 * 장바구니 담기 처리중인지 체크 - (ECHOSTING-79705, 2013.05.22 by wcchoi)
 * see ==> php\lib\basket_lib.php
 */
function add_basket_completed() {
    setRunningAddBasket(false); // see ==> common_ro.js
}

/*
    관련상품 장바구니 담기 추가
    @modify 최환호 <hhchoi@simplexi.com>
    @date 2008-07-14
*/
function add_basket( arg, cmd )
{
    //관련상품 동시선택여부확인 / 2012-02-28  / yiseok
    var isRelationPrdInclude = false;

    if (typeof(OPT_INFO_DETAIL)=='object' || typeof(PRDT_BASIC_INFO) == 'object' || typeof(isPrdtComp) != 'undefined') {//prdt_comp페이지
        isPrdView = 'F';
    }

    if (arg == 1 && typeof(document.frm['quantity_override_flag']) == 'object'){
        selectbuy_action();
        if (_bIsOverride){
            document.frm.quantity_override_flag.value ='T';
        }else{
            document.frm.quantity_override_flag.value ='F';
        }
    }

    var multi_option_data = '';
    // 추가 커맨드가 있다면 기존 체크로직은 수행하지 않음
    // 멀티상품만 담는다면
    if ( cmd || check_frm() )
    {
        frm.command.value = ( cmd ) ? cmd : 'add';
        frm.redirect.value = arg ;
        if (frm.option16 != undefined){
            alert('상품옵션은 15개까지만 가능합니다.\n관리자에 문의하십시요');
            return;
        }

        if (typeof(frm['relation_product']) == 'object') {
                if (frm.relation_product.value == "yes") {
                    value = relation_product();
                    if (value == "no") {
                        return;
                    }
                }
        }

        if (typeof(document.forms['relationProd']) == 'object') {

           //서로 다른 폼인데 서브밋하게 되면 모든 값들이 넘어가야되기 때문에 아래와같이 처리
           if (typeof(oFrm['basket_info[]'].length) == 'undefined') {
                if (document.relationProd["basket_info[]"].checked == true)
                {
                    if (isPrdView == 'T') {
                        if (!RtnPrd.prdChk(document.relationProd["basket_info[]"])) return;
                    }

                    //사용자 옵션넘김no가 아닐경우
                    if (document.relationProd["option_use[]"].value != "no"){
                        temp_product_no = document.relationProd["basket_info[]"].value.split("|");
                        product_no = temp_product_no[0];

                        //사용자 지정 옵션 입력값 처리
                        if (isPrdView == 'F') {//상품비교페이지
                            var sPrdtComName = "option_add_"+product_no+"[]";
                            var oObjCom = document.getElementsByName(sPrdtComName);
                            if (typeof(oObjCom) == "object") {
                                for (j=0;j<oObjCom.length;j++){
                                    input = document.createElement("INPUT");
                                    input.setAttribute("type", "hidden");
                                    input.setAttribute("name", "user_option_"+product_no+"[]");
                                    input.setAttribute("value", oObjCom[j].value);
                                    frm.appendChild(input);
                                }
                            }
                        } else { //상품상세, 기본
                            var sUsrName = "user_option_"+product_no+"[]"; //user_option_00[]
                            var oUserOpt = document.getElementsByName(sUsrName);
                            if (typeof(oUserOpt)!='object' || oUserOpt.length <= 0) {
                                var sUsrNameS = "user_option_"+product_no; //user_option_00
                                var oUserOpt = document.getElementsByName(sUsrNameS);
                            }
                            if (typeof(oUserOpt)=='object' && oUserOpt.length > 0) {
                                for (var j=0;j<oUserOpt.length;j++) {
                                    if (oUserOpt[j].value=="") {
                                        alert('필수 옵션을 입력해주세요.');
                                        oUserOpt[j].focus();
                                        return;
                                    }
                                }
                                for (var j=0;j<oUserOpt.length;j++) {
                                    input = document.createElement("INPUT");
                                    input.setAttribute("type", "hidden");
                                    input.setAttribute("name", "user_option_"+product_no+"[]");
                                    input.setAttribute("value", oUserOpt[j].value);
                                    frm.appendChild(input);
                                }
                            }
                        }

                        //사용자 지정 옵션 명 처리
                        if (isPrdView == 'T') {//상품상세 페이지 (기본)
                            if (typeof(document.relationProd['user_option_name_'+product_no]) == "object") {
                                input = document.createElement("INPUT");
                                input.setAttribute("type", "hidden");
                                input.setAttribute("name", "user_option_name_"+product_no);
                                input.setAttribute("value", document.relationProd['user_option_name_'+product_no].value);
                                frm.appendChild(input);
                            }
                        } else if (isPrdView == 'F') {//상품비교 페이지
                            if (typeof(PRDT_AddOptName_INFO)=='object') {
                                input = document.createElement("INPUT");
                                input.setAttribute("type", "hidden");
                                input.setAttribute("name", "user_option_name_"+product_no);
                                input.setAttribute("value", PRDT_AddOptName_INFO[i]);
                                frm.appendChild(input);
                            }
                        }
                    }

                    //상품정보를 폼이름relationProd에서 폼이름 frm으로 넘김
                    input = document.createElement("INPUT");
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", "basket_info[]");
                    input.setAttribute("value", document.relationProd["basket_info[]"].value);
                    frm.appendChild(input);

                    //관련상품 동시선택여부확인 / 2012-02-28  / yiseok
                    isRelationPrdInclude = true;
                }
           } else {
                for (i=0;i<document.relationProd["basket_info[]"].length;i++){
                    if (document.relationProd["basket_info[]"][i].checked == true)
                    {
                        if (isPrdView == 'T') {
                            if (!RtnPrd.prdChk(document.relationProd["basket_info[]"][i])) return;
                        }

                        //사용자 옵션넘김 no가 아닐경우
                        if (document.relationProd["option_use[]"][i].value != "no"){
                            temp_product_no = document.relationProd["basket_info[]"][i].value.split("|");
                            product_no = temp_product_no[0];

                            //사용자 지정 옵션 입력값 처리
                            if (isPrdView == 'F') {//상품비교페이지
                                var sPrdtComName = "option_add_"+product_no+"[]";
                                var oObjCom = document.getElementsByName(sPrdtComName);
                                if (typeof(oObjCom) == "object") {
                                    for (j=0;j<oObjCom.length;j++){
                                        input = document.createElement("INPUT");
                                        input.setAttribute("type", "hidden");
                                        input.setAttribute("name", "user_option_"+product_no+"[]");
                                        input.setAttribute("value", oObjCom[j].value);
                                        frm.appendChild(input);
                                    }
                                }
                            } else { //상품상세, 기본
                                var sUsrName = "user_option_"+product_no+"[]"; //user_option_00[]
                                var oUserOpt = document.getElementsByName(sUsrName);
                                if (typeof(oUserOpt)!='object' || oUserOpt.length <= 0) {
                                    var sUsrNameS = "user_option_"+product_no; //user_option_00
                                    var oUserOpt = document.getElementsByName(sUsrNameS);
                                }

                                if (typeof(oUserOpt)=='object' && oUserOpt.length > 0) {
                                    for (var j=0;j<oUserOpt.length;j++) {
                                        if (oUserOpt[j].value=="") {
                                            alert('필수 옵션을 입력해주세요.');
                                            oUserOpt[j].focus();
                                            return;
                                        }
                                    }
                                    for (var j=0;j<oUserOpt.length;j++) {
                                        input = document.createElement("INPUT");
                                        input.setAttribute("type", "hidden");
                                        input.setAttribute("name", "user_option_"+product_no+"[]");
                                        input.setAttribute("value", oUserOpt[j].value);
                                        frm.appendChild(input);
                                    }
                                }
                            }

                            //사용자 지정 옵션 명 처리
                            if (isPrdView == 'T') {//상품상세 페이지 (기본)
                                if (typeof(document.relationProd['user_option_name_'+product_no]) == "object") {
                                    input = document.createElement("INPUT");
                                    input.setAttribute("type", "hidden");
                                    input.setAttribute("name", "user_option_name_"+product_no);
                                    input.setAttribute("value", document.relationProd['user_option_name_'+product_no].value);
                                    frm.appendChild(input);
                                }
                            } else if (isPrdView == 'F') {//상품비교 페이지
                                if (typeof(PRDT_AddOptName_INFO)=='object') {
                                    input = document.createElement("INPUT");
                                    input.setAttribute("type", "hidden");
                                    input.setAttribute("name", "user_option_name_"+product_no);
                                    input.setAttribute("value", PRDT_AddOptName_INFO[i]);
                                    frm.appendChild(input);
                                }
                            }

                        }

                        //상품정보를 폼이름relationProd에서 폼이름 frm으로 넘김
                        input = document.createElement("INPUT");
                        input.setAttribute("type", "hidden");
                        input.setAttribute("name", "basket_info[]");
                        input.setAttribute("value", document.relationProd["basket_info[]"][i].value);
                        frm.appendChild(input);

                        //관련상품 동시선택여부확인 / 2012-02-28  / yiseok
                        isRelationPrdInclude = true;
                    }
                }
           }
        }

        // 2012.05.30 : AceCounter 수량 전달용 : 박준형
        var actcnt_multi_quantity = 0;

        // 2009-07-01 추가 옵션 필수 값 체크  - 권혁천
        for (i=1;i<m_option_cnt;i++) {

            // 2012.05.30 : AceCounter 수량 전달용 : 박준형
            actcnt_multi_quantity = actcnt_multi_quantity + parseInt( document.getElementById('quantity_' + i).value);

            divstatus = document.getElementById('m_option_'+i).style.display;
            if (divstatus=='block') {
                multi_option_data += '^' + document.getElementById('quantity_' + i).value;
                for (var j =0; j < optionInfo.id.length; j++) {
                    if (optionInfo.type[j]=='selectbox') {
                       var vfrm = document.getElementById('selectbox_' + i + '_' + (j+1));
                       multi_option_data += '|' + vfrm.options[vfrm.selectedIndex].value ;
                    } else {
                       multi_option_data += '|' + document.getElementById('inputbox_' + i + '_' + (j+1)).value;
                    }
                }
            }
        }

        if (arg == 0){
          if (document.frm.basket_popup == undefined ){
                document.frm.setAttribute("target", '');
          }else{
            if (document.frm.basket_popup.value =='T' && isRelationPrdInclude != true){
              if (document.getElementById('ifrmBasketPopup') == null) {
                  document.frm.setAttribute("target", '');
              }else{
                  document.frm.setAttribute("target", 'ifrmBasketPopup');
              }
            }else{
              document.frm.setAttribute("target", '');
              document.frm.basket_popup.value = 'F';
            }
          }
        } else {
           try {
              document.frm.setAttribute("target", '');
              document.frm.basket_popup.value = 'F';
           } catch (e) { }
       }

        // AceCounter 수량 전달용  : 박준형
        try {
            var total_acecnt_quantity = 0;
            if (actcnt_multi_quantity!=''){
                total_acecnt_quantity = actcnt_multi_quantity+parseInt(document.getElementById('qtTxt').value);
            }
            else{
                total_acecnt_quantity = parseInt(document.getElementById('qtTxt').value);
            }
            var _A_nl_send = Array( total_acecnt_quantity.toString() );
            AEC_CALL_STR_FUNC(document.getElementsByName('product_no')[0].value,'i',_A_nl_send );
        }catch (e) {}

        // 장바구니 담기에 대해서만 처리 - (ECHOSTING-79705, 2013.05.22 by wcchoi)
        // see ==> common_ro.js
        if (arg == 0 && isRunningAddBasket()) {
            alertRunningAddBasket(); return;
        }

        if (arg == 'naver_checkout') {
            // add inflow param from naver common JS to Checkout Service
            try {
                if (typeof(wcs) == 'object') {
                    var inflowParam = wcs.getMileageInfo();
                    if (inflowParam != false) {
                        input = document.createElement("INPUT");
                        input.setAttribute("type", "hidden");
                        input.setAttribute("name", "naver_inflow_param");
                        input.setAttribute("value", inflowParam);
                        frm.appendChild(input);
                    }
                }
            } catch (e) {}

            //oOrderPage.value N 새창, P 현재창
            var oOrderPage = document.getElementById("is_order_page");
            if (oOrderPage != null && oOrderPage.value == "N") {
                document.frm.target = "_blank";
                frm.multi_option_data.value = multi_option_data;
                document.frm.action = "/front/php/basket.php";
                document.frm.submit();
            } else {
                frm.multi_option_data.value = multi_option_data;
                document.frm.action = "/front/php/basket.php";
                document.frm.submit();
            }

        }else{
            frm.multi_option_data.value = multi_option_data;
            document.frm.action = "/front/php/basket.php";
            document.frm.submit();
        }
    }
}

function add_wish_list() {
    var f = document.frm;
    var multi_option_data = '';
    if ( check_frm() )
    {
        if (frm.option16 != undefined) {
            alert('상품옵션은 15개까지만 가능합니다.\n관리자에 문의하십시요');
            return;
        }

        //추가 옵션 필수 값 체크
        for (i=1;i<m_option_cnt;i++) {
            divstatus = document.getElementById('m_option_'+i).style.display;
            if (divstatus=='block') {
                multi_option_data += '^' + document.getElementById('quantity_' + i).value;
                for (var j =0; j < optionInfo.id.length; j++) {
                    if (optionInfo.type[j]=='selectbox') {
                       var vfrm = document.getElementById('selectbox_' + i + '_' + (j+1));
                       multi_option_data += '|' + vfrm.options[vfrm.selectedIndex].value ;
                    } else {
                        multi_option_data += '|' + document.getElementById('inputbox_' + i + '_' + (j+1)).value;
                    }
                }
            }
        }

        frm.multi_option_data.value = multi_option_data;
        document.frm.action = "/front/php/insert_wish_a.php";
        document.frm.submit();
     }
 }

/*
    체크된 상품만 장바구니에 넣기 위해 필요값을 구분자로 추가시킨다
    이미 배열로 들어있는 값 : 상품코드|카테고리코드|상품종류|최소구매수량|상품이름|상품가격
    추가 시키는 값          : 수량|옵션개수|옵션선택값
    @author 최환호 <hhchoi@simplexi.com>
    @date 2008-04-07
*/
function relation_product()
{
    oFrm = document.forms['relationProd'];

    _chkCnt = 0;
    var option_msg = "필수옵션이 선택되지 않았습니다.";

    if (typeof(oFrm['basket_info[]'].length) == 'undefined') {
        if (oFrm['basket_info[]'].checked == true) {
            var temp = oFrm["basket_info[]"].value.split("|");
            var product_min = temp[3];

            //필수 옵션 체크
            if (oFrm["option_use[]"].value != "no") {
                if (oFrm["option_use[]"].value>1) {
                      option_name = 'option_'+temp[0]+'[]';
                      var oOpt = document.getElementsByName(option_name);

                      for (j=0;j<oFrm[option_name].length;j++)
                      {
                           var ncss = oOpt[j].getAttribute('ncss');
                           if (ncss=='T' && oOpt[j].value == "") {
                                alert(option_msg);
                                oOpt[j].focus();
                                return "no";
                            }
                      }

                } else if (oFrm["option_use[]"].value==1) {
                    option_name = 'option_'+temp[0];
                    var oOpt = document.getElementsByName(option_name);
                    if (typeof(oOpt)=='object' && oOpt.length > 0) {
                        var ncss = oOpt[0].getAttribute('ncss');

                        if (ncss=='T' &&oFrm[option_name].value == "") {
                            alert(option_msg);
                            oFrm[option_name].focus();
                            return "no";
                        }
                    }
                }
            }

            //체크된 것만 수량 체크
            if (oFrm['basket_info[]'].length > 1) {
                quantity = oFrm["quantity1[]"];
            } else {
                quantity = oFrm["quantity1"];
            }

            if (!quantity.value)
            {
                alert ('수량을 입력해 주십시오.');
                quantity.focus();
                return "no";
            }

            for (j = 0; j < quantity.value.length; j++) {
                if (! (quantity.value.charAt(j) >= '0' && quantity.value.charAt(j) <= '9')){
                    alert ('수량은 숫자만 가능합니다.');
                    quantity.select();
                    return "no";
                }
            }

            if (parseInt(quantity.value) < product_min)
            {
                 alert ('최소 주문수량은 ' + product_min + ' 입니다.');
                 quantity.focus();
                 return "no";
            }

            if (oFrm['basket_info[]'].checked == true) {
                oFrm["basket_info[]"].value = oFrm["basket_info[]"].value + "|" + oFrm["quantity1"].value;

                if (oFrm["option_use[]"].value != "no") {

                    temp = oFrm["basket_info[]"].value.split("|");

                    if (oFrm["option_use[]"].value>1) {
                        option_name = 'option_'+temp[0]+'[]';

                        oFrm["basket_info[]"].value = oFrm["basket_info[]"].value + "|" + oFrm[option_name].length;

                        for (j=0;j<oFrm[option_name].length;j++)
                        {
                            oFrm["basket_info[]"].value = oFrm["basket_info[]"].value + "|" + oFrm[option_name][j].value;
                        }

                    } else {
                        option_name = 'option_'+temp[0];

                        oFrm["basket_info[]"].value = oFrm["basket_info[]"].value + "|1";
                        oFrm["basket_info[]"].value = oFrm["basket_info[]"].value + "|" + oFrm[option_name].value;
                    }
                }

            }
        }
    } else {

        for (i=0;i<oFrm['basket_info[]'].length;i++) {

            if (oFrm['basket_info[]'][i].checked == true) {

                var temp = oFrm["basket_info[]"][i].value.split("|");
                var product_min = temp[3];

                if (oFrm["option_use[]"][i].value != "no") {

                    if (oFrm["option_use[]"][i].value>1 || (oFrm["option_use[]"][i].value == 1 && isPrdView == 'F')) {
                        option_name = 'option_'+temp[0]+'[]';
                        var oOpt = document.getElementsByName(option_name);
                        var iOptLength = oOpt.length;
                        for (j=0;j<iOptLength;j++)
                        {
                            var ncss = oOpt[j].getAttribute('ncss');
                            if (ncss=='T' && oOpt[j].value == "") {//필수옵션일때 체크 추가 2010-10-19. 서나리
                                alert(option_msg);
                                oOpt[j].focus();
                                return "no";
                            }
                        }

                    } else if (oFrm["option_use[]"][i].value==1) {
                        option_name = 'option_'+temp[0];
                        var oOpt = document.getElementsByName(option_name);
                        if (typeof(oOpt)=='object' && oOpt.length > 0) {
                            var ncss = oOpt[0].getAttribute('ncss');

                            if (ncss == 'T' && oFrm[option_name] && oFrm[option_name].value == "") {
                                alert(option_msg);
                                oFrm[option_name].focus();
                                return "no";
                            }
                        }
                    }
                }

                //체크된 것만 수량 체크
                if (oFrm['basket_info[]'].length > 1) {
                    quantity = oFrm["quantity1[]"][i];
                } else {
                    quantity = oFrm["quantity1"][i];
                }

                if (!quantity.value)
                {
                    alert ('수량을 입력해 주십시오.');
                    quantity.focus();
                    return "no";
                }

                for (j = 0; j < quantity.value.length; j++) {

                    if (! (quantity.value.charAt(j) >= '0' && quantity.value.charAt(j) <= '9'))
                    {
                        alert ('수량은 숫자만 가능합니다.');
                        quantity.select();
                        return "no";
                    }
                }

                if (parseInt(quantity.value) < product_min)
                {
                    alert ('최소 주문수량은 ' + product_min + ' 입니다.');
                    quantity.focus();
                    return "no";
                }
            }
        }

        for (i=0;i<oFrm['basket_info[]'].length;i++) {
            if (oFrm['basket_info[]'][i].checked == true) {

                oFrm["basket_info[]"][i].value = oFrm["basket_info[]"][i].value + "|" + oFrm["quantity1[]"][i].value;       //수량

                if (oFrm["option_use[]"][i].value != "no") {

                    temp = oFrm["basket_info[]"][i].value.split("|");

                    if (oFrm["option_use[]"][i].value>1 || isPrdView == 'F') { //복수개 옵션 또는 상품비교
                        option_name = 'option_'+temp[0]+'[]';
                        var oOptInfo = document.getElementsByName(option_name);
                        if (typeof(oOptInfo)=="object" && oOptInfo.length > 0) {//옵션 있을 경우
                            //옵션종류수
                            oFrm["basket_info[]"][i].value = oFrm["basket_info[]"][i].value + "|" + oFrm[option_name].length;

                            //옵션선택값
                            if (oFrm["option_use[]"][i].value == 1) {//상품비교
                                oFrm["basket_info[]"][i].value = oFrm["basket_info[]"][i].value + "|" + oFrm[option_name].value;
                            } else {
                                for (var j=0; j<oFrm[option_name].length; j++) {
                                    oFrm["basket_info[]"][i].value = oFrm["basket_info[]"][i].value + "|" + oFrm[option_name][j].value;
                                }
                            }
                        }

                    } else {
                        option_name = 'option_'+temp[0];

                        oFrm["basket_info[]"][i].value = oFrm["basket_info[]"][i].value + "|1";
                        if ( oFrm[option_name] )
                            oFrm["basket_info[]"][i].value = oFrm["basket_info[]"][i].value + "|" + oFrm[option_name].value;
                    }
                }
            }
        } // end of for
    }
} //end of relation_product()

//세트상품 모두 체크
//최환호 <hhchoi@simplexi.com> date 2008-09-10
function chkRelProd()
{
    var delvTypeValue = '';
    //해외배송이 선택되어 있으면 세트상품은 선택이 안되게 처리
    if (document.frm.delvType != undefined){
        for (i=0;i<document.frm.elements.length;i++) {
            if (document.frm.elements[i].type == 'radio') {
                if (document.frm.elements[i].name == 'delvType' && document.frm.elements[i].checked == true) {
                    delvTypeValue = document.frm.elements[i].value;
                }
            }
        }

    }

    if (delvTypeValue != "B" ) {
        if (document.relationProd.rel_check_all.checked) {
            var value = true;
        } else {
            var value = false;
        }
        for (i=0;i<document.relationProd.elements.length;i++) {
            if (document.relationProd.elements[i].type == 'checkbox') {
                if (document.relationProd.elements[i].name == 'basket_info[]') {
                    document.relationProd.elements[i].checked = value;
                }
            }
        }
    } else {
        relationProd.rel_check_all.checked = false;
        for (i=0;i<document.relationProd.elements.length;i++) {
            if (document.relationProd.elements[i].type == 'checkbox') {
                if (document.relationProd.elements[i].name == 'basket_info[]') {
                    document.relationProd.elements[i].checked = false;
                }
            }
        }

        alert('해외배송 설정시 세트상품 구매가 불가능합니다.');
    }

}

//세트상품개별 체크
//최환호 <hhchoi@simplexi.com> date 2008-09-10
function set_product_check(obj)
{
    var delvTypeValue = '';
    //해외배송이 선택되어 있으면 세트상품은 선택이 안되게 처리
    if (document.frm.delvType != undefined){
        for (i=0;i<document.frm.elements.length;i++) {
            if (document.frm.elements[i].type == 'radio') {
                if (document.frm.elements[i].name == 'delvType' && document.frm.elements[i].checked == true) {
                    delvTypeValue = document.frm.elements[i].value;
                }
            }
        }

    }

    if (delvTypeValue == "B") {
        obj.checked = false;
        alert('해외배송 설정시 세트상품 구매가 불가능합니다.');
    }
    RtnPrd.prdChk(obj);
}

//해외 배송 선택시 관련상품이 있으면 경고창
function delv_check(obj)
{
    // syjung200908 : try
    try {
        naverChk_dlv_flag = 'F';
        set_display_naverchk();
        
        var cnt = 0;
        for (i=0;i<document.relationProd.elements.length;i++) {
            if (document.relationProd.elements[i].type == 'checkbox') {
                if (document.relationProd.elements[i].name == 'basket_info[]' && document.relationProd.elements[i].checked == true) {
                    cnt++
                }
            }
        }
    
        if (cnt != 0) {
           for (i=0;i<document.frm.elements.length;i++) {
                if (document.frm.elements[i].type == 'radio') {
                    if (document.frm.elements[i].name == 'delvType') {
                        if (document.frm.elements[i].value == "A") {
                            document.frm.elements[i].checked = true;
                        }
                    }
                }
            }
    
           alert('해외배송은 세트상품 구매가 불가능합니다.');
        }
    } catch ( e ) {}

}

function check_frm()
{
    if (arguments[0] != undefined){
        var service_mode = arguments[0];
    }else{
        var service_mode = "";
    }

    // 옵션필수 선택항목체크
    var neededfrm;
    var divstatus;
    if (service_mode == "nv"){
        var option_msg = "필수옵션이 선택되지 않았습니다.";
    }else{
        var option_msg = "필수옵션이 선택되지 않았습니다.";
    }

    // by jsyoon 필수선택옵션 체크 05/11/17
    if (frm.nids != undefined){
        if (frm.nids.length == undefined){
            neededfrm = eval("document.frm." + frm.nids.value);
            if (neededfrm.value == '0') {
                alert(option_msg);
                neededfrm.focus();
                return false;
            }

            // 2009-07-01 추가 옵션 필수 값 체크 - 권혁천
            for (i=1;i<m_option_cnt;i++) {
                divstatus = document.getElementById('m_option_'+i).style.display;
                neededfrm = document.getElementById('selectbox_'+i+'_1');
                if (divstatus=='block' && neededfrm.value == '0') {
                    alert(option_msg);
                    neededfrm.focus();
                    return false;
                }

                if (chkQuantity(document.getElementById('quantity_'+i))==false) {
                    return false;
                }
            }

        } else {
            for (var i =0; i < frm.nids.length; i++){
                neededfrm = eval("document.frm." + frm.nids[i].value);
                if (neededfrm.value == '0') {
                    alert(option_msg);
                    neededfrm.focus();
                    return false;
                }
            }

            // 2009-07-01 추가 옵션 필수 값 체크  - 권혁천
            for (i=1;i<m_option_cnt;i++) {
                divstatus = document.getElementById('m_option_'+i).style.display;
                if (divstatus=='block') {
                    for (var j =0; j < optionInfo.multi_needed.length; j++) {
                        if (optionInfo.multi_needed[j]=='T') {
                            if (optionInfo.type[j]=='selectbox') {
                                neededfrm = document.getElementById('selectbox_'+i+'_'+(j+1));
                                if (neededfrm.value == '0') {
                                    alert(option_msg);
                                    neededfrm.focus();
                                    return false;
                                }
                            }else{
                                neededfrm = document.getElementById('inputbox_'+i+'_'+(j+1));
                                if (neededfrm.value == '') {
                                    alert(option_msg);
                                    neededfrm.focus();
                                    return false;
                                }
                            }
                        }
                    }
                    if (chkQuantity(document.getElementById('quantity_'+i))==false) {
                        return false;
                    }
                }
            }
        }
    } else {
        // 2009-07-01 추가 옵션 필수 값 체크  - 권혁천
        for (i=1;i<m_option_cnt;i++) {
            divstatus = document.getElementById('m_option_'+i).style.display;
            if (divstatus=='block') {
                for (var j =0; j < optionInfo.multi_needed.length; j++) {
                    if (optionInfo.multi_needed[j]=='T') {
                        if (optionInfo.type[j]=='selectbox') {
                            neededfrm = document.getElementById('selectbox_'+i+'_'+(j+1));
                            if (neededfrm.value == '0') {
                                alert(option_msg);
                                neededfrm.focus();
                                return false;
                            }
                        }else{
                            neededfrm = document.getElementById('inputbox_'+i+'_'+(j+1));
                            if (neededfrm.value == '') {
                                alert(option_msg);
                                neededfrm.focus();
                                return false;
                            }
                        }
                    }
                }
                if (chkQuantity(document.getElementById('quantity_'+i))==false) {
                    return false;
                }
            }
        }
    }

    // by jsyoon 옵션문구 크기 체크


    // by 이경란 2008-01-30
    // option_add 체크 수정
    _optAddObj1 = frm['option_add'];
    option_msg = '필수 옵션을 입력해주세요';
    if ( typeof(_optAddObj1) == 'object') {
        if (typeof(_optAddObj1.length) == 'undefined'){
                var txtval = frm['add_option_name'].value;
                var bsize = 0;

                bsize = 255 - str_size_check(txtval) - 1;
                if (_optAddObj1.value == ''){
                    alert(option_msg);
                    _optAddObj1.focus();
                    return false;
                }

                if (!check_byte(_optAddObj1, bsize, "옵션문구는 한글 " + Math.floor(bsize / 2) + "자이내로만 입력가능합니다.")){
                    _optAddObj1.focus();
                    return false;
                }
        }else{
        _aTmp = frm['add_option_name'].value.split(";");

        for (i=0;i<_aTmp.length;i++) {
            _tmpObj = frm['option_add['+i+']'];

            if (typeof(_tmpObj) != 'undefined'){
                    var txtval = _aTmp[i];
                    var bsize = 0;

                    bsize = 255 - str_size_check(txtval) - 1;
                    if (!_tmpObj.value.length){
                        alert(option_msg);
                        _tmpObj.focus();
                        return false;
                    }

                    if (!check_byte(_tmpObj, bsize, "옵션문구는 한글 " + Math.floor(bsize / 2) + "자이내로만 입력가능합니다.")){
                        _tmpObj.focus();
                        return false;
                    }
                }
        }

        }
    } else {
        _aTmp = frm['add_option_name'].value.split(";");

        for (i=0;i<_aTmp.length;i++) {
            _tmpObj = frm['option_add['+i+']'];

            if (typeof(_tmpObj) != 'undefined'){
                    var txtval = _aTmp[i];
                    var bsize = 0;

                    bsize = 255 - str_size_check(txtval) - 1;
                    if (!_tmpObj.value.length){
                        alert(option_msg);
                        _tmpObj.focus();
                        return false;
                    }

                    if (!check_byte(_tmpObj, bsize, "옵션문구는 한글 " + Math.floor(bsize / 2) + "자이내로만 입력가능합니다.")){
                        _tmpObj.focus();
                        return false;
                    }
                }
        }

        //추가옵션의 필수옵션 체크
        for (var i=1;i<m_option_cnt;i++) {
            divstatus = document.getElementById('m_option_'+i).style.display;
            var iOptInfoLength = optionInfo.id.length;
            for (var j =0; j < iOptInfoLength; j++) {
                neededfrm = document.getElementById('inputbox_'+i+'_'+(j+1));
                if (typeof(neededfrm)=='object') {
                    if (divstatus=='block' && optionInfo.type[j]=='input' && neededfrm.value=='') {
                        alert(option_msg);
                        neededfrm.focus();
                        return false;
                    }
                }
            }
        }
    }

    if (chkQuantity(frm.quantity)==false)
    {
        return false;
    }

    return true;
}

function chkQuantity(quantity) {
    if (!quantity.value)
    {
        alert ('수량을 입력해 주십시오.');
        quantity.focus();
        return false;
    }

    for (i = 0; i < quantity.value.length; i++)
    {
        if (! (quantity.value.charAt(i) >= '0' && quantity.value.charAt(i) <= '9'))
        {
            alert ('수량은 숫자만 가능합니다.');
            quantity.select();
            return false;
        }
    }

    if (parseInt(quantity.value) < frm.product_min.value)
    {
        alert ('최소 주문수량은 ' + frm.product_min.value + ' 입니다.');
        quantity.select();
        return false;
    }
}
function review_read( id )
{
    show_id = document.all[id];
   ///ECHOSTING-28339의해 수정됨  block => table-row
    if ( show_id.style.display == 'table-row' )
    {
        show_id.style.display = 'none';
    }
    else
    {
        show_id.style.display = 'table-row';
    }
}

function recommend_mail_pop( product_no, category_no, display_group )
{

        //alert('추천메일보내기 준비중입니다.');

        option = "'toolbar=no," +
                "location=no," +
                "directories=no," +
                "status=no," +
                "menubar=no," +
                "scrollbars=yes," +
                "resizable=yes," +
                "width=576," +
                "height=568," +
                "top=300," +
                "left=200"

    filename = "/front/php/recommend_mail/recommend_mail.php?product_no=" + product_no + "&category_no=" + category_no;
    filename += "&display_group=" + display_group

        open_window( filename, option, "recommend_mail_pop" );
}

///2008-12-18 DOM으로 수정 -김영훈
function changeImage(img_url, width, height){
    // 2009-06-17 : 비표준으로 되어 있던 것을 수정 - 맹 준영
    document.getElementsByName('big_img')[0].src        = img_url;
    document.getElementsByName('big_img')[0].width    = width;
    document.getElementsByName('big_img')[0].height    = height;
       return;
}

// 상품의 복합형, 조합형별로 옵션 아이디를 가져오는 함수
// by jsyoon 05/11/17
function get_option_ids(idx) {
    var count = 0;
    var thisfrm = document.frm;
    var selfrm;
    var retval = '';
    var tmpval;

    // 조합형인경우
    if (otype == 'T') {
        if (thisfrm.opid.length == undefined){
            selfrm = eval("document.frm." + thisfrm.opid.value);
            tmpval = selfrm.options[selfrm.options.selectedIndex].value;
            if (tmpval == 0)
                return '';
            return  tmpval + "-0-0";
        }
        for (var i =0; i < 3; i++) {
            if (thisfrm.opid[i] == undefined){
                    tmpval = 0;
            } else {
                selfrm = eval("document.frm." + thisfrm.opid[i].value);
                tmpval = selfrm.options[selfrm.options.selectedIndex].value;
                // 옵션중 선택되지 않은 항목이 있는경우 return
                if (tmpval == 0)
                    return '';
            }

            if (i == 0)
                retval =+ tmpval;
            else
                retval = retval + "-" + tmpval;
        }
        // 복합형인경우
    } else if (otype == 'F'){
        for (var i =0; i < 3; i++) {
            if (i == (idx - 1)) {
                if (thisfrm.opid.length == undefined)
                    selfrm = eval("document.frm." + thisfrm.opid.value);
                else
                    selfrm = eval("document.frm." + thisfrm.opid[i].value);
                tmpval = selfrm.options[selfrm.options.selectedIndex].value;
            } else {
                tmpval = 0;
            }
            if (i == 0)
                retval =+ tmpval;
            else
                retval = retval + "-" + tmpval;
        }
    } else if (otype == 'E'){
        if (thisfrm.opid.length == undefined)
        {
            selfrm = eval("document.frm." + thisfrm.opid.value);
        }
        else
        {
            selfrm = eval("document.frm." + thisfrm.opid[(idx - 1)].value);
        }

        tmpval = selfrm.options[selfrm.options.selectedIndex].value;
            if (tmpval == 0)
            return '';
        retval = idx + "-" + tmpval;

    }
    return retval;
}

function coupon_apply(no)
{
    location.href = '/exec/front/newcoupon/IssueDownload?coupon_no=' + no + '&opener_url=' + document.URL;
}

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
}

// 2009-06-30 옵션추가 스크립트 - 권 혁 천
function makeOption () {
    try {
        if (optionInfo.id.length>0) {
            var multi_option_html = "";
            var html = '<div id="m_option_' + m_option_cnt + '" style="display:block;padding-top:10px;">';

            for (i=0; i<optionInfo.id.length; i++) {
                var baseTag = "";
                if (optionInfo.type[i]=='selectbox') {
                    var optionTag = "";
                    baseTag = document.getElementById('c_3_u4ms').value;
                    var f = document.getElementsByName(optionInfo.id[i])[0];
                    for (x=0; x<f.length; x++) {
                        optionTag +="<option value='" + f.options[x].value + "'> "+ f.options[x].text + "</option>";
                    }
                    baseTag = baseTag.replace(/\{\$multi_option_title\}/g, optionInfo.name[i]);
                    baseTag = baseTag.replace(/\{\$multi_selectbox_name\}/g, m_option_cnt + "_" + (i+1));
                    baseTag = baseTag.replace(/\{\$multi_selectbox_option\}/g, optionTag);

                } else {
                    baseTag = document.getElementById('c_3_u4mi').value;
                    baseTag = baseTag.replace(/\{\$multi_option_title\}/g, optionInfo.name[i]);
                    baseTag = baseTag.replace(/\{\$multi_inputbox_name\}/g, m_option_cnt + "_" + (i+1));
                }

                multi_option_html += baseTag;
            }

            var table = document.getElementById('c_3_u4mt').value;
            // selectbox,inputbox 옵션 세팅
            table = table.replace(/\{\$multi_option_html\}/g, multi_option_html);
            // 수량 display 유무
            var multi_quantity_display = (quantitybox=='text') ? 'block' : 'none';
            table = table.replace(/\{\$multi_quantity_display\}/g, multi_quantity_display);
            table = table.replace(/\{\$multi_quantitybox_type\}/g, quantitybox);
            if (quantitybox=='hidden')
                table = table.replace(/\{\$multi_quantitybox_cnt\}/g, '1');
            else
                table = table.replace(/\{\$multi_quantitybox_cnt\}/g, quantityboxCnt);
            table = table.replace(/\{\$multi_quantity_name\}/g, m_option_cnt);
            // 삭제 버튼 div id 등록
            table = table.replace(/\{\$multi_div_id\}/g, m_option_cnt);
            html += table + "</div>";

            document.getElementById('multiple').innerHTML += html;
            // 추가된 옵션별 가격합계를 위해 0으로 세팅
            optionTotal[m_option_cnt] = 0;
            optionVatTotal[m_option_cnt] = 0;
            m_option_cnt++;

            priceInnerHtml ();

            // 분리선 display = block
            document.getElementById('multiple_line').style.display = 'block';
        }
    } catch (e) {}
}

// 2009-07-01 금액계산 - 권 혁 천
function priceInnerHtml () {
    // 옵션이 있을때
    try
    {
        var price = 0;
        var price_one = 0;
        var basic_quantity = parseInt(document.frm.quantity.value.trim());
        var cnt = 0;
        var iMultiOptSubTotal = 0;

        // 선택된 옵션 금액 합계
        for (i=0; i<optionTotal.length; i++) {
            if (i==0) {
                //price += optionTotal[i] * basic_quantity;
            } else {
                // 추가된 옵션중 '삭제'하지 않은 옵션 개수 파악
                if (document.getElementById('m_option_' + i ).style.display == 'block'){
                    opt_cnt = parseInt(document.getElementById('quantity_' + i ).value.trim(), 10);
                    cnt += opt_cnt;
                    price_one += optionTotal[i]; // syjung201005 : only option price
                    var iMultiOptVatTmp = (_sVatDisplay != 'T' && _sPrdtPriceTaxType == 'A') ? optionVatTotal[i] : 0;
                    iMultiOptSubTotal += ((_iPrdtPriceBuy + parseInt(optionTotal[i], 10) + iMultiOptVatTmp) * parseInt(opt_cnt, 10)); //nrseo20110705: 추가옵션상품가
                }
            }
        }

        if (isNaN(basic_quantity)==false && isNaN(cnt)==false)
        {
            var aPrdtInfoCur = null;
            var aPrdtInfo = new Array();
            aPrdtInfo['iBaseCnt'] = basic_quantity;
            aPrdtInfo['iBaseOptPrice'] = (isNaN(optionTotal[0]))?0:optionTotal[0];
            aPrdtInfo['iBaseOptVatPrice'] = (isNaN(optionVatTotal[0]))?0:optionVatTotal[0];
            aPrdtInfo['iAddCnt'] = cnt;
            aPrdtInfo['iAddOptPriceOne'] = price_one;
            aPrdtInfo['iAddOptPriceAll'] = price_one;
            // price buy(판매가)
            aPrdtInfoCur = getPrdtInfo4Price(aPrdtInfo, 1);
            if (_sVatDisplay != 'T' && _sPrdtPriceTaxType == 'A') {//세액포함한 표시가 아니면서 & 과세일때
                var iOptTmp = aPrdtInfoCur['iBaseOptPrice'] + aPrdtInfoCur['iBaseOptVatPrice'];
            } else {
                var iOptTmp = aPrdtInfoCur['iBaseOptPrice'];
            }
            var iTemp = (_sIsSellingPrice == 'S') ? (_iPrdtPriceBuy + iOptTmp) : ((_iPrdtPriceBuy + iOptTmp) * aPrdtInfoCur['iBaseCnt']);
            setApplyHtml('main_price', number_format(iTemp) + price_unit);
            if (option_multiple == 'Y') setApplyHtml('main_price_sub', number_format(iMultiOptSubTotal + iTemp));
            // about_price 한정우 2010.11.3
            // 즉시할인(aboutPBP)는 상품가+옵션가에만 할인을 하고 수량에는 영향을 받지 않는다.
            // ((상품가 + 옵션가) 의 할인) * 수량
            if (about_per > 0){
                var iPrdPrice = _iPrdtPriceBuy + aPrdtInfoCur['iBaseOptPrice']; // 상품가+옵션가
                var iAboutPerPrice = 0; // 어바웃 할인금액
                var iAboutPrice = 0;    // 어바웃할인가(할인 적용된 상품가)
                if (iPrdPrice > 9){
                    if (iPrdPrice < 100){
                        iAboutPerPrice = Math.ceil((iPrdPrice * about_per/100));
                    }else{
                        iAboutPerPrice = Math.ceil((iPrdPrice * about_per/100)/10)*10;
                    }
                    if (iAboutPerPrice > 0){
                        iAboutPrice = (iPrdPrice - iAboutPerPrice) * aPrdtInfoCur['iBaseCnt'];
                        setApplyHtml('about_price', number_format(iAboutPrice) + price_unit);
                    }else{
                        setApplyHtml('about_price', number_format(iAboutPrice) + price_unit);
                    }
                }else{
                    setApplyHtml('about_price', number_format(iTemp) + price_unit);
                }
            }

            // price custom(소비자가)
            aPrdtInfoCur = getPrdtInfo4Price(aPrdtInfo, 2);
            var iTemp = (_sIsSellingPrice == 'S') ? (_iPrdtPriceCustom + aPrdtInfoCur['iBaseOptPrice']) : (_iPrdtPriceCustom + aPrdtInfoCur['iBaseOptPrice']) * aPrdtInfoCur['iBaseCnt'];
            var iVatOptionPrice = (_sIsSellingPrice == 'S') ? aPrdtInfoCur['iBaseOptVatPrice'] : aPrdtInfoCur['iBaseOptVatPrice'] * aPrdtInfoCur['iBaseCnt'];
            iTemp = (_sVatDisplay != 'T') ? iTemp + iVatOptionPrice : iTemp;
            setApplyHtml('spnViewPriceCustom', number_format(iTemp));

            // price org(상품가)
            aPrdtInfoCur = getPrdtInfo4Price(aPrdtInfo, 4);
            var iTemp = _iPrdtPriceOrg + aPrdtInfoCur['iBaseOptPrice'];
            iTemp2 = (_sIsSellingPrice == 'S') ? Math.round(iTemp) : Math.round(iTemp * aPrdtInfoCur['iBaseCnt']);
            setApplyHtml('spnViewPriceOrg', number_format(iTemp2));

            // price tax(세액)
            aPrdtInfoCur = getPrdtInfo4Price(aPrdtInfo, 8);
            var iTemp = (_sIsSellingPrice == 'S') ? (_iPrdtPriceTax + aPrdtInfoCur['iBaseOptVatPrice']) : (_iPrdtPriceTax + aPrdtInfoCur['iBaseOptVatPrice']) * aPrdtInfoCur['iBaseCnt'];
            setApplyHtml('spnViewPriceTax', number_format(iTemp));

            // price mile(적립금)
            aPrdtInfoCur = getPrdtInfo4Price(aPrdtInfo, 16);
            var iTemp = _iPrdtPriceBuy;
            setApplyHtml('spnViewPriceMile', number_format(getMileNew('cm', iTemp) * aPrdtInfoCur['iBaseCnt']));
            setApplyHtml('spnViewPriceMile_cash', number_format(getMileNew('cash', iTemp) * aPrdtInfoCur['iBaseCnt']));
            setApplyHtml('spnViewPriceMile_card', number_format(getMileNew('card', iTemp) * aPrdtInfoCur['iBaseCnt']));
            setApplyHtml('spnViewPriceMile_tcash', number_format(getMileNew('tcash', iTemp) * aPrdtInfoCur['iBaseCnt']));
            setApplyHtml('spnViewPriceMile_cell', number_format(getMileNew('cell', iTemp) * aPrdtInfoCur['iBaseCnt']));
            setApplyHtml('spnViewPriceMile_mileage', number_format(getMileNew('mileage', iTemp) * aPrdtInfoCur['iBaseCnt']));
            /* syjung201005 : because of cron proc
            var iTemp = _iPrdtPriceBuy * aPrdtInfoCur['iBaseCnt'];
            setApplyHtml('spnViewPriceMile', number_format(getMileNew('cm', iTemp)));
            setApplyHtml('spnViewPriceMile_cash', number_format(getMileNew('cash', iTemp)));
            setApplyHtml('spnViewPriceMile_card', number_format(getMileNew('card', iTemp)));
            setApplyHtml('spnViewPriceMile_tcash', number_format(getMileNew('tcash', iTemp)));
            setApplyHtml('spnViewPriceMile_cell', number_format(getMileNew('cell', iTemp)));
            setApplyHtml('spnViewPriceMile_mileage', number_format(getMileNew('mileage', iTemp)));
            */
        }
    }
    catch (e) {}
}

function getMileNew( sPayType, iPriceBase )
{
    var iUnit = _aMallDesignConf.default_set_mileage ;
    var sRountType = _aMallDesignConf.set_mileage_type ;
    var aConf = _aPrdtMileConf[sPayType];
    if ( !aConf ) return 0 ;
    var iPercent = 0 ;
    if ( aConf.mileage_type == 'P' ) {
        iPercent = parseInt( aConf.mileage_value ) ;
    } else {
        return parseInt( aConf.mileage_value ) ;
    }
    var iTemp = parseInt( iPriceBase ) * iPercent / 100 ;
    if ( !iUnit ) parseInt( iTemp ) ;
    iFormatUnit = parseInt( iUnit ) * 10 ;
    if ( sRountType == 'A' ) {
        iTemp = Math.floor( iTemp / iFormatUnit ) * iFormatUnit ;
    } else if ( sRountType == 'B' ) {
        iTemp = Math.round( iTemp / iFormatUnit ) * iFormatUnit ;
    } else if ( sRountType == 'C' ) {
        iTemp = Math.ceil( iTemp / iFormatUnit ) * iFormatUnit ;
    }
    return iTemp ;
}
function getPrdtInfo4Price(aPrdtInfo, iConfFactor)
{
    var iOptFactorG = parseInt(_aMallDesignConf['md_price_view_type_po_factor']);
    var iCntFactorG = parseInt(_aMallDesignConf['md_price_view_type_pc_factor']);
    var sOptFlag = _aMallDesignConf['md_price_view_type_po_flag'];
    var sCntFlag = _aMallDesignConf['md_price_view_type_pc_flag'];
    var aRet = new Array();
    aRet['iBaseCnt'] = (sCntFlag == 'T' && (iCntFactorG & iConfFactor)) ? parseInt(aPrdtInfo['iBaseCnt']) : 1;
    aRet['iBaseOptPrice'] = (sOptFlag == 'T' && (iOptFactorG & iConfFactor)) ? parseInt(aPrdtInfo['iBaseOptPrice']) : 0;
    aRet['iBaseOptVatPrice'] = (sOptFlag == 'T' && (iOptFactorG & iConfFactor)) ? parseInt(aPrdtInfo['iBaseOptVatPrice']) : 0;
    if (aPrdtInfo['iAddCnt'] > 0) {
        aRet['iAddCnt'] = (sCntFlag == 'T' && (iCntFactorG & iConfFactor)) ? parseInt(aPrdtInfo['iAddCnt']) : 1;
        if (aRet['iAddCnt'] == 1) {
            aRet['iAddOptPrice'] = (sOptFlag == 'T' && (iOptFactorG & iConfFactor)) ? parseInt(aPrdtInfo['iAddOptPriceOne']) : 0;
        } else {
            aRet['iAddOptPrice'] = (sOptFlag == 'T' && (iOptFactorG & iConfFactor)) ? parseInt(aPrdtInfo['iAddOptPriceAll']) : 0;
        }
    } else {
        aRet['iAddCnt'] = 0;
        aRet['iAddOptPrice'] = 0;
    }
    return aRet;
}
function setApplyHtml( sID, sHtml )
{
    //try {
        var hObj = document.getElementById( sID );
        if (hObj) {
            document.getElementById( sID ).innerHTML = sHtml ;
        }
    //} catch (e) {}
}
function applyPriceViewType()
{
    var hSpnViewPriceCustom = document.getElementById('spnViewPriceCustom');
    var hSpnViewPriceOrg = document.getElementById('spnViewPriceOrg');
    var hSpnViewPriceTax = document.getElementById('spnViewPriceTax');
    var hSpnViewPriceMile = document.getElementById('spnViewPriceMile');
}
// 2009-07-01 삭제시 초기화( 레이어, 금액)
function optionDivControl (idx) {
    var divBlockCnt = 0;
    document.getElementById('m_option_' + idx ).style.display='none';

    // 분리선 display = none
    for (i=1;i<m_option_cnt;i++) {
        if (document.getElementById('m_option_' + i ).style.display == 'block') {
            divBlockCnt++;
            break;
        }
    }
    if (divBlockCnt==0) {
        document.getElementById('multiple_line').style.display = 'none';
    }

    // 옵션 추가 금액 초기화
    optionTotal[idx] = 0;
    optionVatTotal[idx] = 0;
    priceInnerHtml ();
}

// 2009-06-30 추가된 옵션 선택시 ' 총 상품금액/판매가 ' 수정 - 권 혁 천
function optionMultiple(selectbox) {

    try {
        // ie8 이상 버젼에서 selected attribute가 없으면 선택된 옵션에 대한 어트리뷰트가 존재하지 않음
        var iLength = selectbox.options.length;
        for(var i = 0; i < iLength ; i++) {
            selectbox.options[i].removeAttribute("selected");
        }
        selectbox.options[selectbox.selectedIndex].setAttribute("selected", "selected");
        
        var ids = '';
        var price = 0;
        var price_vat = 0;
        var tmp = selectbox.id.split('_');

        if (otype == 'T'){
            ids = multi_get_option_ids(selectbox);
            if (manage_stock != 'C' && optstock_table[ids] <= 0) {
                base_price_html.innerHTML = '<font color=red>품절</font>';
                return;
            } else if (ids.length != 0) {
                price = optprice_table[ids];
                price_vat = optstock_vat_table[ids];
            }
        }

        if (otype == 'F' || otype == 'E'){
            if (frm.opid.length == undefined){
                ids = multi_get_option_ids(selectbox);
                if (ids != '0-0-0' && otype == 'F') {
                    price = optprice_table[ids];
                    price_vat = optstock_vat_table[ids];
                }
                if (ids != '' && otype == 'E') {
                    price = optprice_table[ids];
                    price_vat = optstock_vat_table[ids];
                }
            } else {
                for (var i = 0; i < frm.opid.length; i++){
                    ids = multi_get_option_ids(document.getElementsByName('selectbox_'+tmp[1]+'_'+ (i+1))[0]);
                    if (ids != '0' &&  ids != '0-0-0' && otype == 'F') {// syjung201005 : ???
                        price += optprice_table[ids];
                        price_vat += optstock_vat_table[ids];
                    }
                    if (ids != '' && otype == 'E') {
                        price += optprice_table[ids];
                        price_vat += optstock_vat_table[ids];
                    }
                }
            }
        }

        optionTotal[tmp[1]] = parseInt(price) ? parseInt(price) : 0;
        optionVatTotal[tmp[1]] = parseInt(price_vat, 10) ? parseInt(price_vat, 10) : 0;

        //금액 표시
        priceInnerHtml(price_unit);

    } catch (e) {};
}

function multi_get_option_ids(selectbox) {

    var retval = '';
    var tmpval;
    var tmp = selectbox.id.split('_');

    // 조합형인경우
    if (otype == 'T') {
        if (frm.opid.length == undefined){
            tmpval = selectbox.options[selectbox.selectedIndex].value;
            if (tmpval == 0) return '';
            return  tmpval + "-0-0";
        }

        for (var i =0; i < 3; i++) {
            var selfrm = document.getElementsByName('selectbox_'+tmp[1]+'_'+ (i+1))[0];
            if (selfrm == undefined){
                    tmpval = 0;
            } else {
                tmpval = selfrm.options[selfrm.options.selectedIndex].value;
                // 옵션중 선택되지 않은 항목이 있는경우 return
                if (tmpval == 0) return '';
            }

            if (i == 0)
                retval =+ tmpval;
            else
                retval = retval + "-" + tmpval;
        }
        // 복합형인경우
    } else if (otype == 'F'){
        for (var i =0; i < 3; i++) {
            if (i == (tmp[2] - 1)) {
                tmpval = selectbox.options[selectbox.selectedIndex].value;
            } else {
                tmpval = 0;
            }
            if (i == 0)
                retval =+ tmpval;
            else
                retval = retval + "-" + tmpval;
        }
    } else if (otype == 'E'){
        tmpval = selectbox.options[selectbox.selectedIndex].value;
        if (tmpval == 0) return '';

        retval = tmp[2] + "-" + tmpval;
    }
    return retval;

}
function cyConnect(mallId,prdNo,cate_no,sid){

    var strUrl = "http://api.cyworld.com/openscrap/shopping/v1/?";
    //strUrl += "xu=" + escape("http://www2.1300k.com/shop/makeGoodsXml/makeGoodsXml.php?f_goodsno="+prdNo+"&cate_no="+cate_no);
    //strUrl += "&sid=s0200002";

    strUrl += "xu=" + escape("http://"+mallId+".cafe24.com/front/php/ghost_mall/makeCyworldPrdXml.php?product_no="+prdNo+"&cate_no="+cate_no+"&sid="+sid);
    strUrl += "&sid="+sid;

    var strOption = "width=450,height=410";

    var objWin = window.open(strUrl, 'cyopenscrap',  strOption);
    objWin.focus();

}
function openNateInfo(num){
    if (num == "1"){
        document.getElementById('divNate').style.display="none";
    }else{
        document.getElementById('divNate').style.display="";
    }
}

function nv_add_basket(arg)
{
    if (arg=="1"){
        if ( check_frm('nv') ){
            document.frm.nv_hidden_flag.value = 'order';
            document.frm.action = "order_navercheckout_a.php";
            document.frm.submit();
        }
    } else {
        var product_no = document.frm.product_no.value;
        window.open("basket_navercheckout_a.php?product_no="+product_no, "navercheckout_basket", 'scrollbars=yes,status=no,toolbar=no,width=450,height=300');
    }
}

function check_naverchk(arg) {
    if (arg=="A"){
        naverChk_soldout_flag = "T";
        naverChk_dlv_flag = 'T';
    }else{
        naverChk_soldout_flag = 'F';
    }
    set_display_naverchk();
}

function set_display_naverchk(){
    try {
        if (document.getElementById('NaverChk_Button') != null){

            if (naverChk_soldout_flag == 'F' || naverChk_dlv_flag == 'F'){
                document.getElementById('NaverChk_Button').style.display = "none";
            } else {
                document.getElementById('NaverChk_Button').style.display = "block";
            }
        }
    } catch (e) {}
}

// by 한정우
// 재입고 알림 SMS  요청 창을 띄운다.
function sms_restock_popup(){
    if (check_frm()){
        var f = document.frm;
        window_open( '/front/php/sms_restock.php', 'sms_restock' ,200, 100, 459, 490 );
    }
}


//주문수량 증감버튼. 2010-05-12. 서나리
function quantityChg(id, flag) {
    var obj = document.getElementById(id);
    if (!isNumber(obj.value)) {
        alert('숫자형식의 데이터만 가능합니다.');
        return false;

    } else {
        var tmp = parseInt(obj.value);
        if (flag=='up') {//증가
            obj.value = tmp + 1;

        } else if (flag=='down') {//감소
            if (tmp>quantityboxCnt) obj.value = tmp - 1; //최소수량까지만.
        }
    }
    return true;
}

//숫자여부 체크. 2010-05-12. 서나리
function isNumber(num) {
    return (/^[0-9]+$/).test(num);
}

//    조회수증가
function view_cnt(board_no, no, id)
{

    try
    {
        if (!document.getElementById('ifrm_board_cnt')) {

            var iframe = document.createElement("iframe");

            iframe.setAttribute("width", "0px");
            iframe.setAttribute("height", "0px");
            iframe.setAttribute("id", "ifrm_board_cnt");

            document.getElementsByTagName('body')[0].appendChild(iframe);
        }

        show_id = document.all[id]
        //ECHOSTING-28339 에 의해 show_id.style.display == 'table-row'  추가됨
        if (show_id.style.display == 'block' || show_id.style.display == 'table-row') {
            document.getElementById('ifrm_board_cnt').src = 'javascript:location.replace("/front/php/iframe_hit.php?board_no='+ board_no +'&no='+ no+'&id='+ id +'")';
        }
    }
    catch (e) {}
}

// krlee2 추가
function comment_submit_check( form, used_name )
{
    form.target="_blank'";
    var max_length = 14;
    var comment = get_string_trim(form.comment.value);
    var comment_name = get_string_trim(form.comment_name.value);
    form.comment.value = comment;

    if (form.bbs_name_authed.value == 'F') {
        window.open('/front/php/b/pop_name_auth.php','bbs_name_auth','width=420,height=630');
        return false;
    }

    if (used_name == 'block')
    {
        form.comment_name.value = get_string_trim(form.comment_name.value);
        form.comment_passwd.value = get_string_trim(form.comment_passwd.value);

        var size1 = get_string_length(form.comment_name.value);
        var size2 = get_string_length(form.comment_passwd.value);
        if (size1 > 100) {
            alert('이름을 100byte이하로 입력하세요');
            form.comment_name.focus();
            return false;
        } else if (size2 > 16) {
            alert('비밀번호를 16byte이하로 입력하세요');
            form.comment_passwd.focus();
            return false;
        }

        if (form.comment_name.value == '') {
            alert('이름을 입력하세요');
            form.comment_name.focus();
            return false;
        }

        if (form.comment_passwd.value == '') {
            alert('비밀번호를 입력하세요');
            form.comment_passwd.focus();
            return false;
        }

        if (form.comment.value == '') {
            alert('내용을 입력하세요');
            form.comment.focus();
            return false;
        }

        // 2009-05-19 : 인증키 체크 추가 - cmc_jymaeng
        try {
            if (form.captcha.value == '') {
                if (document.getElementById("captcha_img").style.display == 'block') {
                    alert('인증키를 입력하세요.');
                    form.captcha.focus();
                    return false;
                }
            }
        } catch (e) {}
    }

    json_init(form,"add");
    return false;
}

function json_init(form,mode) {

    if (mode=="add") {
        var captcha = "";
        var obj_list = form.comment_point;
        var comment_point = 0 ;

        for ( var cnt = 0, len = obj_list.length ; cnt < len ; cnt++ )
        {
            if ( obj_list[cnt].checked && !obj_list[cnt].disabled )
            comment_point = obj_list[cnt].value ;
        }

        // 2009-05-19 : 인증키 체크 추가 - cmc_jymaeng
        try {
            if (form.captcha_name.value == 'ub') var captcha = "&captcha_ub="+form.captcha_ub.value;
            else if  (form.captcha_name.value == 'qna')  var captcha ="&captcha_qna="+form.captcha_qna.value;
            else if  (form.captcha_name.value == 'free')  var captcha ="&captcha_free="+form.captcha_free.value;

        } catch (e) {}
        
        try {
            var secret_flag = 'F';
            var secret_flag_element = form.secret_flag;
            if (secret_flag_element != undefined && secret_flag_element != null) {
                if (secret_flag_element.getAttribute('type') == 'checkbox') {
                    secret_flag = (secret_flag_element.checked) ? 'T' : 'F';
                } else {
                    secret_flag = secret_flag_element.value;
                }
            }
        } catch (e) {}
        
        // syjung200907
        parma_str  = "&mode=comment_add&board_no="+form.board_no.value;
        
        parma_str += "&comment="+encodeURIComponent(form.comment.value);
        parma_str += "&no="+form.no.value+captcha;
        parma_str += "&comment_point="+comment_point;
        parma_str += "&captcha_name="+form.captcha_name.value;
        parma_str += "&secret_flag="+secret_flag;
        
        if (sAuthSSLFlag == 'T') {
            sCommentInsertParam = parma_str;
            AuthSSLManager.weave({
                // encrypt / decrypt
                'auth_mode' : 'encrypt',
                // 엘리먼트 아이디 혹은 라디오박스는 name
                'aEleId' : [ form.name +'::comment_name', form.name +'::comment_passwd' ],
                // callback function-name
                'auth_callbackName' : 'encryptCommentInsert'
            });
        } else {
            parma_str += "&comment_name="+form.comment_name.value;
            parma_str += "&comment_passwd="+form.comment_passwd.value;

            sendRequest(json_comment_insert, parma_str,'POST', '/front/php/b/board_write_a_new.php', true, true);
        }
        
    }
        else if (mode=="del") {
    }
}

/**
 * 댓글 ssl 암호화 처리 콜백함수
 * @param output
 */
function encryptCommentInsert(output)
{
    if (AuthSSLManager.isError(output) == true) {
        alert("개인정보 암호화 실패. 관리자에게 문의해 주세요.");
        return false;
    }
    var parma_str = sCommentInsertParam;
    sCommentInsertParam = '';

    parma_str += '&encode_str=' + output;
    parma_str += '&board_type=productDetail';
    sendRequest(json_comment_insert, parma_str,'POST', '/front/php/b/board_write_a_new.php', true, true);
}

function json_comment_insert(oj) {
    if ( !oj || !oj.responseText ) return ; // syjung200907
    eval("var res = " + oj.responseText);
    // 2009-05-19 : 비표준으로 동작하던 부분 수정 - cmc_jymaeng
    var cmt = document.getElementsByName('comment');
    if (res.Static[0].error) {
        if (res.Static[0].error) alert(res.Static[0].error);
        return ; // syjung200907
        document.location.reload();
    } else {
        var bbsno = 'div_comment_list_'+res.Static[7].comment_bbs_no;
        var div_comment_tpl_no = 'div_comment_tpl_'+res.Static[8].comment_board_no;
        var captcha_img_name = 'captcha_img_'+res.Static[12].comment_captcha_name+'_'+res.Static[7].comment_bbs_no;
        var cbyte_span_name = 'cbyte_span'+res.Static[12].comment_captcha_name+'_'+res.Static[7].comment_bbs_no;
        var comment_name = 'comment_'+res.Static[12].comment_captcha_name+'_'+res.Static[7].comment_bbs_no;
        var captcha_name = 'captcha_'+res.Static[12].comment_captcha_name+'_'+res.Static[7].comment_bbs_no;
        comment_tpl = document.getElementsByName(div_comment_tpl_no)[0].value;
        comment_tpl = comment_tpl.replace(/\[ajax_comment_no\]/g,res.Static[0].comment_no);
        comment_tpl = comment_tpl.replace("[ajax_comment_name]",res.Static[1].comment_name);
        comment_tpl = comment_tpl.replace("[ajax_comment]",res.Static[4].comment_comment);
        comment_tpl = comment_tpl.replace("[ajax_comment_member_id]",res.Static[2].comment_member_id);
        comment_tpl = comment_tpl.replace("[ajax_comment_write_date]",res.Static[3].comment_write_date);
        comment_tpl = comment_tpl.replace("[ajax_comment_point_html]",res.Static[6].comment_point_html);
        comment_tpl = comment_tpl.replace(/\[ajax_comment_board_no\]/gi,res.Static[8].comment_board_no);
        comment_tpl = comment_tpl.replace("[ajax_comment_bbs_no]",res.Static[7].comment_bbs_no);

        if (document.getElementById(captcha_img_name)){
            document.getElementById(captcha_img_name).src = res.Static[5].comment_captcha;
        }
        document.getElementById(comment_name).value = '';
       document.getElementById(captcha_name).value = '';

        ret_comment_tpl = comment_tpl;
        ret_comment_tpl = document.getElementById(bbsno).innerHTML+ret_comment_tpl;
        document.getElementById(bbsno).innerHTML=ret_comment_tpl;

       // syjung200907
       var obj_cmt_size_msg = document.getElementById( cbyte_span_name ) ;
       if ( obj_cmt_size_msg ) obj_cmt_size_msg.innerHTML = '0' ;
        try {
            if (document.getElementById('blog_ck').value=="T") {
                self.resizeTo(document.body.scrollWidth, document.body.scrollHeight);
            }
        } catch (e) {}
    }

}

function get_string_trim( string )
{
    return string.replace(/(^\s*)|(\s*$)/g, "");
}

function str_limit_check( obj, max_len, cmt_name, cmt_no )
{

    var comment = obj.value;

    // syjung200907
    if ( max_len == 0 ) return ;
    if ( !max_len ) max_len = 200;
    if ( !cmt_no ) cmt_no = '' ;

  var cbyte_span_name = 'cbyte_span_' +cmt_name+'_'+cmt_no ;

    var obj_cmt_size_msg = document.getElementById( cbyte_span_name ) ;
    content_length = get_string_length( comment );

    if ( obj_cmt_size_msg ) obj_cmt_size_msg.innerHTML = content_length;

    if ( content_length > max_len )
    {
        msg = '메시지는 ' + max_len + ' Byte 이하로 입력해주세요.';
        alert( msg );
        obj.value = substring_k(comment, max_len);

        if ( obj_cmt_size_msg ) document.getElementById(cbyte_span_name ).innerHTML = max_len;

    }
}

function get_string_length( string )
{
    var count = 0;

    var tmp_str = new String(string);
    var temp = tmp_str.length;

    var onechar;

    for ( k=0; k<temp; k++ )
    {
        onechar = tmp_str.charAt(k);

        if (escape(onechar).length > 4)
        {
            count += 2;
        }
        else
        {
            count += 1;
        }
    }

    return count;
}

var _bIsOverride = false;
//선택된 상품만 주문하기
function selectbuy_action() {
    var hFrm = document.frm;
    var sParams = '';
    var sTemp = '';
    var hTemp = '';
    if (typeof(frm['option_type']) == 'object' && typeof(frm['product_no']) == 'object') {
        sParams += '&mode=check_same_product';
        sParams += '&option_type='+hFrm.option_type.value;
        sParams += '&product_no='+hFrm.product_no.value;
        sParams += '&basket_type='+hFrm.basket_type.value;

        for ( var i=1; i<13; i++){
            hTemp = hFrm['option'+i];
            if (hTemp){
                sTemp = hFrm['option'+i].value;
            }else{
                sTemp ='';
            }

            sParams += '&option'+i+'='+sTemp;
        }
        //try {
            sendRequest( send_selectbuy, sParams, 'POST', 'basket_ajax.php', false, true ) ;
        //}catch(e){
        //}
    }

}
function send_selectbuy(oj){

    if (!oj) return;
    if (!oj.responseText) return;

    try{
        eval( 'var aResData =' + oj.responseText );
    }catch(e){
        return;
    }

    if (!aResData) return;
    if (aResData.sRetCode == 'MASK_SUCCESS') {
        if (!aResData.aData) return;
        if (aResData.aData.nexturl2) {
            var sUrl = aResData.aData.nexturl2 + '?redirect_url=' + aResData.aData.nexturl + '&basket_type=' + aResData.aData.basket_type;
        } else {
            var sUrl = aResData.aData.nexturl + '?basket_type=' + aResData.aData.basket_type;
        }
        if (sUrl) {
            document.location.href = sUrl;
        }
    } else if (aResData.sRetCode == 'PRODUCT_EXIST') {
        var iPrdtCnt= aResData.aData.iPrdtCnt;
        if (!confirm("동일상품이 장바구니에 " + iPrdtCnt +"개 있습니다.\n함께 구매하시겠습니까?")){
            _bIsOverride = true;
        }else{
            _bIsOverride = false;
        }

    }
    return;
}

function coupon_layer(coupon_li, coupon_no)
{
    this.coupon_layer_close();

    var div_layer;
    var layer_content_html;

    for (var i = 0 ; i <  coupon_li.childNodes.length; i++)
    {
        if (coupon_li.childNodes[i].id == ('coupon_layer_content_' + coupon_no)) {

            layer_content_html   =   coupon_li.childNodes[i].innerHTML;
        }

        if (coupon_li.childNodes[i].id == ('div_layer_p_' + coupon_no) ) {
               div_layer       =       coupon_li.childNodes[i];
        }
    }

    for (var ii = 0; ii < div_layer.childNodes.length; ii++)
    {
        if (div_layer.childNodes[ii].nodeName == 'DIV') 
        {
            div_layer.childNodes[ii].style.left = (div_layer.offsetWidth - 0) + 'px';
            
            div_layer.childNodes[ii].innerHTML = "<iframe name='ifrm_product_coupon_layer' id='ifrm_product_coupon_layer' style='display:none' width='520px' height='208px' frameborder='0' allowTransparency='true' scrolling='no' frameborder='0' scrollbars='no' marginheight='0' marginwidth='0'></iframe>";
        }
    }

    var doc_form_product_coupon_layer = document.createElement("form");

    doc_form_product_coupon_layer.id        =    'form_product_coupon_layer';
    doc_form_product_coupon_layer.target    =    'ifrm_product_coupon_layer';
    doc_form_product_coupon_layer.method    =    'POST';
    doc_form_product_coupon_layer.action    =    'iframe_product_coupon_layer.php';

    if (!document.getElementById('form_product_coupon_layer')) 
    {
        document.getElementsByTagName('body')[0].appendChild(doc_form_product_coupon_layer);
    }

    if (document.getElementById('ifrm_product_coupon_layer')) 
    {
        document.getElementById('form_product_coupon_layer').innerHTML        =   layer_content_html;
        document.getElementById('form_product_coupon_layer').submit();
        document.getElementsByName('ifrm_product_coupon_layer')[0].style.display    =    'block';
    }
}

//     쿠폰정보 레이어팝업닫기
function coupon_layer_close()
{
       var dom = document.getElementsByName('div_layerCouponBack');

       for (var i = 0; i < dom.length; i++)
       {
           dom[i].innerHTML = "";
       }
}
//     상품상세 노출되어진 전체 쿠폰 다운받기
function coupon_all_down() {

       var doc =       document.getElementsByName('input_layerCouponNo');
       var tmp =       "";

       for (var i = 0 ; i < doc.length ; i++) {

               tmp     +=      doc[i].value + ",";
       }

       if (tmp != '') {



            var doc_frm_coupon_a    =    document.createElement("form");
            doc_frm_coupon_a.id        =    'frm_coupon_a';
            doc_frm_coupon_a.method    =    'POST';
            doc_frm_coupon_a.action    =    '/front/php/coupon/coupon_a.php';

            //  frm_coupon_a 엘리멘트가 없는경우만 실행
            if (!document.getElementsByName('frm_coupon_a')[0]) {
                document.getElementsByTagName('body')[0].appendChild(doc_frm_coupon_a);
            }

            if (document.getElementById('frm_coupon_a')) {
                document.getElementById('frm_coupon_a').innerHTML   =   '<input type="hidden" id="coupon_zone_sel_coupon_no" name="coupon_zone_sel_coupon_no" value="'+ tmp +'">';
                document.getElementById('frm_coupon_a').innerHTML   +=   '<input type="hidden" id="opener_url" name="opener_url" value="'+ document.URL +'">';
                document.getElementById('frm_coupon_a').submit();
            }

       } else {
           alert('발급가능한 쿠폰정보가 없습니다.');
       }
}

//상품상세 노출되어진 전체 쿠폰 다운받기 - 레이어
function coupon_all_down_layer()
{
   var doc = document.getElementsByName('input_layerCouponNo');
   var tmp = "";
   for (var i = 0 ; i < doc.length ; i++) {
       tmp += doc[i].value + ",";
   }

   if (tmp != '') {
       var callUrl = "/exec/front/Newcoupon/IssueDownload/";
       var aParam = '&coupon_no=' + tmp;
       aParam += '&return_type=json';

       try {
           sendRequest(completeIssueCoupon, aParam, 'POST', callUrl , false, true) ;
       } catch(e) {
       }
   } else {
       alert('발급가능한 쿠폰정보가 없습니다.');
   }
}

function completeIssueCoupon(obj)
{
    var data = JSON.parse(obj.responseText);
    
    var iTotalList = parseInt(data['total_list']);
    var iSuccessCnt = 0;
    if (typeof(data['issue_list']) !== 'undefined') {
        iSuccessCnt = parseInt(data['issue_list'].length);
    }
    var iFailCnt = parseInt(iTotalList - iSuccessCnt);

    var sMessage = '';
    if (typeof(data.message) === 'object') {
        for (var i = 0; i < data['message'].length; i++) {
            sMessage += '<li>' + data['message'][i] + '</li>';
        }
    } else {
        sMessage = '<li>'+data.message+'</li>';
    }

    var sStyle = '.couponDown { overflow:hidden; position:absolute; top:50%; left:50%; z-index:1000; width:560px; margin:0px 0 0 -280px;  border:1px solid #7f8186; color:#747474; font:11px "돋움",Dotum,AppleGothic,sans-serif; background-color:#fff; }';
    sStyle += '.couponDown h1 { height:39px; margin:0; padding:0 35px 0 19px; color:#fefefe; font-size:14px; line-height:39px; background-color:#666; }';
    sStyle += '.couponDown img { border:0; vertical-align:top; }';
    sStyle += '.couponDown p { margin:0; }';
    sStyle += '.couponDown .close { position:absolute; right:14px; top:12px; }';
    sStyle += '.couponDown .btnArea { overflow:hidden; padding:10px 0; border-top:1px solid #c7ccd2; text-align:center; background:#e5e5e5; }';
    sStyle += '.couponDown .content { padding:30px 30px 20px; line-height:20px; }';
    sStyle += '.couponDown .content .total { padding:0 0 0 6px; color:#000; font-size:12px; background:url("//img.echosting.cafe24.com/design/skin/default/coupon/bul_coupon.gif") no-repeat 0 6px; }';
    sStyle += '.couponDown .content .total .point { color:#6292db; }';
    sStyle += '.couponDown .content .desc { padding:0 0 5px 6px; }';
    sStyle += '.couponDown .content .couponList { overflow-y:auto; height:120px; padding:10px; border:1px solid #d8d8d8; line-height:18px; }';
    sStyle += '.couponDown .content .couponList ul { margin:0 0 10px; padding:0; }';
    sStyle += '.couponDown .content .couponList ul li { list-style:none; margin:0; padding:0; }';

    var sContent = '<div class="couponDown" id="couponDownLayer">';
    sContent += '    <h1>쿠폰 다운로드 완료</h1>';
    sContent += '    <div class="content">';
    sContent += '        <p class="total"><strong>총 '+ iTotalList +'건</strong> [성공 <strong class="point">'+ iSuccessCnt  +'</strong>건 / 실패 <strong>'+ iFailCnt +'</strong>건]</p>';
    sContent += '        <p class="desc">상세내역을 확인해주세요.</p>';
    sContent += '        <div class="couponList">';
    sContent += '            <ul>';
    sContent += sMessage;
    sContent += '            </ul>';
    sContent += '        </div>';
    sContent += '    </div>';
    sContent += '    <div class="btnArea">';
    sContent += '        <a href="/front/php/myshop/myshop_coupon.php"><img src="//img.echosting.cafe24.com/design/skin/default/coupon/btn_mycoupon.gif" alt="마이쿠폰 확인" /></a>';
    sContent += '    </div>';
    sContent += '    <div class="close"><a href="#none" onclick="couponDownLayerClose()"><img src="//img.echosting.cafe24.com/design/skin/default/common/btn_close.gif" alt="닫기" /></a></div>';
    sContent += '</div>';

    var style = document.createElement('style');
    style.setAttribute("type", "text/css");
    if (style.styleSheet) {   // for IE
        style.styleSheet.cssText = sStyle;
    } else {                // others
        var textnode = document.createTextNode(sStyle);
        style.appendChild(textnode);
    }
    document.getElementsByTagName('head')[0].appendChild(style);

    var obj = document.createElement('div');
    obj.innerHTML = sContent;
    document.body.insertBefore(obj, document.body.childNodes[0]);

    //$("body").prepend(sContent);
}

function couponDownLayerClose()
{
    document.getElementById('couponDownLayer').style.display = 'none';
    location.reload();
}

var mainBigImg;
var mainBigImgWidth;
var mainBigImgHeight;

//  상품상세 페이지에서 이미지 확대보기 기능
var ZoomImageClass  =    function ()
{
    this.ori_img_div        =   ""; //  오리지널 이미지에 생성되어질 div영역 핸들
    this.target_img_div     =   ""; //  타겟 이미지에 생성되어질 div영역 핸들
    this.target_img         =   ""; //  타겟 이미지 핸들
    this.parentNode         =   ""; //  오리지날 img부모값
    this.bigImg             =   ""; //  확대보여줄 이미지 경로
    this.borderColor        =   ""; //  boarder 색상
    this.e                  =   ""; //
    this.left               =   ""; //
    this.top                =   ""; //
    this.event              =   ""; //
    this.offsetTop          =   ""; //
    this.offsetLeft         =   ""; //
    this.offsetBottom       =   ""; //
    this.offsetRight        =   ""; //
    this.offsetBottomLimit  =   ""; //
    this.offsetRightLimit   =   ""; //
}

//  이미지 노출 영역 생성해주기 + 이미지 생성
ZoomImageClass.prototype.create =   function ()
{
    //  미리보기창 생성
    if (!document.getElementById('target_img_parent_div')) {

        var div = document.createElement("div");
        div.innerHTML       =   "  "
                            +   "        <table border=0 cellspacing=0 cellpadding=0 align=right widht=100%>  "
                            +   "            <tr>  "
                            +   "                <td>  "
                            +   "                    <div id='target_img_parent_div' style='position:relative;top:0px;left:10px;width:0px;height:0px;display:none'>  "
                            +   "                        <div style='border:3px solid black;background-color:black;position:absolute;width:300px;height:300px;opacity:0.75;KHTMLOpacity:0.75;MozOpacity:0.75;filter:Alpha(opacity=75);z-index:99999;'>  "
                            +   "                        </div>  "
                            +   "                        <div id='target_img_div' style='position:absolute;width:300px;height:300px;border:3px solid "+ this.borderColor +";background-image:url("+ this.bigImg +");background-repeat:no-repeat;z-index:999999;'></div>  "
                            +   "                        <div style='position:absolute;width:300px;height:300px'>"
                            +   "                           <iframe width=100% height=100% frameborder=0px></iframe>"
                            +   "                        </div>"
                            +   "                    </div>  "
                            +   "                </td>  "
                            +   "            </tr>  "
                            +   "        </table>";


        this.parentNode.insertBefore(div, this.parentNode.firstChild)
    }

    //  미리보기에서 보여질부분에 대한 선택창 생성
    if (!document.getElementById('ori_img_div')) {

        var div = document.createElement("div");
        div.innerHTML       =   "<div id='ori_img_div' style='display:none;border:3px solid " + this.borderColor + ";width:200px;height:200px;position:absolute;z-index:0;allowtransparency=true;'></div>";
        this.parentNode.appendChild(div);
    }

    //  미리보기에서 보여질부분에 대한 창 생성
    if (!document.getElementById('big_img_mouse_over_div') && this.node.width > 1) {

        var div = document.createElement("div");
        div.innerHTML   =   "<div style='width:100%;position:relative;left:0px;top:0px;display:block;z-index:999999' id='big_img_mouse_over_div'><div style='position:absolute;left:0xp;top:-30px;width:300px;opacity:0.75;KHTMLOpacity:0.75;MozOpacity:0.75;filter:Alpha(opacity=75)' align='center'><img src='//img.cafe24.com/img1/front/common/mouseover.gif' style='cursor:pointer'></div></div>";
        this.parentNode.appendChild(div);
    }

}

//  마우스 move 에 따른 이미지 보여주기
ZoomImageClass.prototype.move   =   function (event)
{
    var e           = event || window.event;

    document.getElementById('big_img_mouse_over_div').style.display =   'none';
    document.getElementById('target_img_parent_div').style.display  =   'block';
    document.getElementById('ori_img_div').style.display            =   'block';

    changeImage(mainBigImg,mainBigImgWidth,mainBigImgHeight);


    var left    = e.pageX ? e.pageX : document.documentElement.scrollLeft + e.clientX + document.body.scrollLeft;
    var top     = e.pageY ? e.pageY : document.documentElement.scrollTop + e.clientY + document.body.scrollTop;

    var ori_img_div     =   document.getElementById('ori_img_div');
    var target_img_div  =   document.getElementById('target_img_div');
    var ori_img_div_offsetTop       =   getRealOffsetTop(ori_img_div);
    var ori_img_div_offsetLeft      =   getRealOffsetLeft(ori_img_div);
    var ori_img_div_offsetBottom    =   getRealOffsetTop(ori_img_div) + ori_img_div.offsetHeight;
    var ori_img_div_offsetRight     =   getRealOffsetLeft(ori_img_div) + ori_img_div.offsetWidth;

    //  이미지의 우측 넘어가지 않는 선에서 div 움직여준다
    if ((left + 100) < ZoomImageClass.prototype.offsetRight && (left - 100) > ZoomImageClass.prototype.offsetLeft) {
        ori_img_div.style.left  =   left - 100;
    } else if ((left - 100) > ZoomImageClass.prototype.offsetLeft && ZoomImageClass.prototype.node.width > 200) {
        ori_img_div.style.left  =   ZoomImageClass.prototype.offsetRight - 200;
    } else {
        ori_img_div.style.left  =   ZoomImageClass.prototype.offsetLeft;
    }

    //  이미지의 하단 넘어가지 않는 선에서 div 움직여준다
    if ((top + 100) < ZoomImageClass.prototype.offsetBottom && (top - 100) > ZoomImageClass.prototype.offsetTop) {
        ori_img_div.style.top    =   top - 100;
    } else if ((top - 100) > ZoomImageClass.prototype.offsetTop && ZoomImageClass.prototype.node.height > 200) {
        ori_img_div.style.top    =   ZoomImageClass.prototype.offsetBottom - 200;
    } else {
        ori_img_div.style.top    =   ZoomImageClass.prototype.offsetTop;
    }

    var move_bg_px  =   (ori_img_div.offsetLeft - ZoomImageClass.prototype.offsetLeft) + " " + (ori_img_div.offsetTop - ZoomImageClass.prototype.offsetTop);
    var move_bg_pxY =   -((ori_img_div.offsetTop - ZoomImageClass.prototype.offsetTop) * 2);
    var move_bg_pxX =   -((ori_img_div.offsetLeft - ZoomImageClass.prototype.offsetLeft) * 2);

    //  해당 이미지 파일에 마우스 무브일때 이벤트 등록
    if (window.addEventListener) {    //FF

        target_img_div.style.backgroundPosition     =   move_bg_pxX + " " + move_bg_pxY;

    }
    else if (document.body.attachEvent) {    //IE

        target_img_div.style.backgroundPositionY    =   move_bg_pxY;
        target_img_div.style.backgroundPositionX    =   move_bg_pxX;
    }
}

//  초기 설정값에 따른 변수선언
ZoomImageClass.prototype.out   =   function ()
{
    document.getElementById('big_img_mouse_over_div').style.display =   'block';
    document.getElementById('target_img_parent_div').style.display  =   'none';
    document.getElementById('ori_img_div').style.display            =   'none';
}

//  초기 설정값에 따른 변수선언
ZoomImageClass.prototype.init   =   function (node, bigImg, borderColor)
{
    this.node               =   node;
    this.parentNode         =   node.parentNode.parentNode;
    this.bigImg             =   bigImg;
    this.borderColor        =   borderColor;
    this.offsetTop          =   getRealOffsetTop(node);
    this.offsetLeft         =   getRealOffsetLeft(node);
    this.offsetBottom       =   getRealOffsetTop(node) + node.offsetHeight;
    this.offsetRight        =   getRealOffsetLeft(node) + node.offsetWidth;
    this.offsetBottomLimit  =   this.offsetBottom + 200;
    this.offsetRightLimit   =   this.offsetRight + 200;

    //  각종 영역생성
    this.create();

    //  해당 이미지 파일에 마우스 무브일때 이벤트 등록
    if (window.addEventListener) {    //FF

        node.addEventListener("mouseover", this.move, false);
        document.getElementById('ori_img_div').addEventListener("mousemove", this.move, false);
        document.getElementById('ori_img_div').addEventListener("mouseout", this.out, false);
    }
    else if (document.body.attachEvent) {    //IE

        node.attachEvent("onmousemove", this.move);
        node.attachEvent("onmouseout", this.out);
    }

}

function getRealOffsetTop(o)
{
    return o ? o.offsetTop + getRealOffsetTop(o.offsetParent) : 0;
}

//    절대 좌표값 반환 Left
function getRealOffsetLeft(o)
{
    return o ? o.offsetLeft + getRealOffsetLeft(o.offsetParent) : 0;
}

function _zoomImage()
{
    try
    {
        var nodes = document.getElementsByTagName('img');
        var node = {};

        for (var i=0; i<nodes.length; i++) {
            if (nodes[i].name == 'big_img') {
                node = nodes[i];
                mainBigImg = nodes[i].src;
                mainBigImgWidth = nodes[i].width;
                mainBigImgHeight = nodes[i].height;

                break;
            }
        }

        if (!node) return;

        if (zoomImage_bigImg != '' && preview_image_script == 'T') {
            ZoomImageClass.prototype.init(node, zoomImage_bigImg, zoomImage_borderColor);
        }
    }
    catch (e)
    {

    }
}

//관련상품 체크. 2011-03-29 서나리.
var RtnPrd = {
    init:function(iPno)
    {
        this.iPno = iPno;
        this.basket_info = this.getBasketInfo(iPno);
        this.iProductPrice = this.basket_info['iPrice'];//상품가
        this.iOptPrice = 0; //옵션추가가격
        this.sHasOption = eval('PrdState'+iPno)['has_option'];
        this.iLimit = eval('PrdState'+iPno)['limitCnt'];//옵션 선택 전 재고수량
        this.sState = eval('PrdState'+iPno)['limitState'];//옵션 선택 전 재고상태
        this.sStockManageType = eval('PrdState'+iPno)['stockManageType'];//재고관리종류
        this.sOptType = this.basket_info['sOptType'];//옵션종류

        //basket_info 순서확인
        var iBskInfo = document.getElementsByName('basket_info[]').length;
        if (iBskInfo > 0) {
            var oBasketInfo = document.getElementsByName('basket_info[]');
            for (var b=0; b<iBskInfo; b++) {
                if (iPno == oBasketInfo[b].value.split('|')[0]) {
                    if (iBskInfo > 1) {
                        this.oQuantity = document.getElementsByName('quantity1[]')[b];
                    } else {
                        this.oQuantity = document.getElementsByName('quantity1')[b];
                    }
                    this.oBasketInfo = oBasketInfo[b];
                }
            }
        }
    },
    setNullOpt:function(iPno)
    {
        //선택옵션
        var oOpt = "";
        if (document.getElementsByName('option_'+iPno+'[]').length > 0) {
            oOpt = document.getElementsByName('option_'+iPno+'[]');
        } else if (document.getElementsByName('option_'+iPno).length > 0) {
            oOpt = document.getElementsByName('option_'+iPno);
        }
        if (oOpt.length > 0) {
            for (var i=0; i<oOpt.length; i++) {
                oOpt[i].value = "";
            }
            this.iOptPrice = 0;
        }

        //사용자 지정 옵션
        var oOptStr = "";
        if (document.getElementsByName('user_option_'+iPno+'[]').length > 0) {
            var oOptStr = document.getElementsByName('user_option_'+iPno+'[]');
        } else if (document.getElementsByName('user_option_'+iPno).length > 0) {
            var oOptStr = document.getElementsByName('user_option_'+iPno);
        }
        if (oOptStr != "") {
            for (var os=0, iOsLen=oOptStr.length; os<iOsLen; os++) {
                oOptStr[os].value = "";
            }
        }
    },
    prdChk:function(oObj)
    {
        iPno = oObj.value.split('|')[0];
        this.init(iPno);
        if (oObj.checked == true) {
            if (!this.optPrcss(iPno)) return false;
        }

        return true;
    },
    optPrcss:function(iPno)
    {
        this.init(iPno);

        //선택옵션
        var oOpt = "";
        if (document.getElementsByName('option_'+iPno+'[]').length > 0) {
            oOpt = document.getElementsByName('option_'+iPno+'[]');
        } else if (document.getElementsByName('option_'+iPno).length > 0) {
            oOpt = document.getElementsByName('option_'+iPno);
        }

        var iOptChk = 0;
        var sOptId = "";
        if (oOpt.length > 0) {
            var aOptID = new Array();
            for (var i=0, iOptLen=oOpt.length; i<iOptLen; i++) {
                var sNcss = oOpt[i].getAttribute('ncss');
                if (sNcss=='T' && (oOpt[i].value==0 || oOpt[i].value=="")) continue; //필수옵션 선택 체크
                aOptID[iOptChk] = (oOpt[i].value=="") ? 0 : oOpt[i].value;
                iOptChk++;
            }
            if (iOptChk==oOpt.length) {
                if ((this.sOptType=='T' || this.sOptType=='F') && oOpt.length < 3) {
                    for (var t=iOptChk; t<3; t++) aOptID[t] = 0;
                }
                sOptId = aOptID.join('-');

                //옵션별 체크
                if (this.sOptType=='T' && sOptId!="") {//조합
                    if (typeof(eval('PrdOptPrice'+iPno)[sOptId]) != 'undefined') {
                        this.iOptPrice = eval('PrdOptPrice'+iPno)[sOptId];//가격
                    }
                    if (this.sStockManageType!="C") {
                        this.iLimit = (isNaN(eval('PrdOptStockCnt'+iPno)[sOptId])) ? 0 : parseInt(eval('PrdOptStockCnt'+iPno)[sOptId], 10);

                        if (!this.stockAlert(this.iLimit, this.oQuantity.value)) {
                            if (this.sState == 'M') {
                                this.oQuantity.focus();
                            } else {
                                this.setNullOpt(iPno);
                            }
                            return false;
                        }
                    }
                } else if (this.sOptType=='F' && sOptId!="") {//복합
                    var sOptTmpIdx1 = aOptID[0]+'-0-0';
                    var sOptTmpIdx2 = '0-'+aOptID[1]+'-0';
                    var sOptTmpIdx3 = '0-0-'+aOptID[2];

                        var iOptPrice1 = (isNaN(eval('PrdOptPrice'+iPno)[sOptTmpIdx1])) ? 0 : parseInt(eval('PrdOptPrice'+iPno)[sOptTmpIdx1], 10);
                        var iOptPrice2 = (isNaN(eval('PrdOptPrice'+iPno)[sOptTmpIdx2])) ? 0 : parseInt(eval('PrdOptPrice'+iPno)[sOptTmpIdx2], 10);
                        var iOptPrice3 = (isNaN(eval('PrdOptPrice'+iPno)[sOptTmpIdx3])) ? 0 : parseInt(eval('PrdOptPrice'+iPno)[sOptTmpIdx3], 10);
                        this.iOptPrice = iOptPrice1 + iOptPrice2 + iOptPrice3;//옵션추가금액

                        if (this.sStockManageType!="C") {
                            var iOptCnt1 = (isNaN(eval('PrdOptStockCnt'+iPno)[sOptTmpIdx1])) ? 0 : parseInt(eval('PrdOptStockCnt'+iPno)[sOptTmpIdx1], 10);
                            var iOptCnt2 = (isNaN(eval('PrdOptStockCnt'+iPno)[sOptTmpIdx2])) ? 0 : parseInt(eval('PrdOptStockCnt'+iPno)[sOptTmpIdx2], 10);
                            var iOptCnt3 = (isNaN(eval('PrdOptStockCnt'+iPno)[sOptTmpIdx3])) ? 0 : parseInt(eval('PrdOptStockCnt'+iPno)[sOptTmpIdx3], 10);
                            if ((sOptTmpIdx1!='0-0-0' && iOptCnt1 < 1) || (sOptTmpIdx2!='0-0-0' && iOptCnt2 < 1) || (sOptTmpIdx3!='0-0-0' && iOptCnt3 < 1)) {
                                this.iLimit = 0;
                            } else {
                                var aSortTmp = new Array();
                                if (sOptTmpIdx1!='0-0-0') aSortTmp.push(iOptCnt1);
                                if (sOptTmpIdx2!='0-0-0') aSortTmp.push(iOptCnt2);
                                if (sOptTmpIdx3!='0-0-0') aSortTmp.push(iOptCnt3);
                                if (aSortTmp.length > 0) {
                                    aSortTmp.sort(function(a,b){return a-b;});//옵션 중 제일 작은 수량으로 표시 및 제한
                                    this.iLimit = aSortTmp[0];
                                }
                            }
                            if (!this.stockAlert(this.iLimit, this.oQuantity.value)) {
                                if (this.sState == 'M') {
                                    this.oQuantity.focus();
                                } else {
                                    this.setNullOpt(iPno);
                                }
                                return false;
                            }
                        }
                } else if (this.sOptType=='E' && aOptID.length > 0) {//저장
                    for (var o=0, iOptLen=aOptID.length; o<iOptLen; o++) {
                        var oOptPrice = eval('PrdOptPrice'+iPno);
                        if (typeof(oOptPrice[o+1][aOptID[o]-1]) != 'undefined') {
                            if (isNumber(oOptPrice[o+1][aOptID[o]-1])) {
                                this.iOptPrice = parseInt(this.iOptPrice, 10) + parseInt(oOptPrice[o+1][aOptID[o]-1], 10);
                            }
                        }
                    }
                }
            }
            if (this.sStockManageType!="C" && ((this.sOptType!='E' && sOptId!="") || this.sOptType=='E' || iOptChk==oOpt.length)) {
                if (!this.stockAlert(this.iLimit, this.oQuantity.value)) {
                    if (this.sState == 'M') {
                        this.oQuantity.focus();
                    } else {
                        this.setNullOpt(iPno);
                    }
                    return false;
                }
            }
        } else if (this.sHasOption != 'T' && this.sStockManageType!="C") {
            if (!this.stockAlert(this.iLimit, this.oQuantity.value)) {
                if (this.sState == 'M') {
                    this.oQuantity.focus();
                } else {
                    this.setNullOpt(iPno);
                    this.oBasketInfo.checked = false;
                    this.oBasketInfo.focus();
                }
                return false;
            }
        }

        this.displayAmount();
        return true;
    },
    stockAlert:function(iStock, iQuantity)
    {
        if (parseInt(iStock,10) >= 1) {//옵션별 재고
            if (parseInt(iStock,10) >= parseInt(iQuantity,10)) {
                this.sState = 'T';
                return true;
            } else {
                alert('구매하실 수량이 재고수량보다 많습니다.(현재재고:'+iStock+')');
                this.sState = 'M';
                return false;
            }
        } else {
            alert('선택하신 상품은 품절입니다.');
            this.sState = 'F';
            return false;
        }
    },
    displayAmount:function()
    {
        var iResultPrice = parseInt(this.iProductPrice, 0) + parseInt(this.iOptPrice, 0);
        var html = product_price_design.replace("[price]", number_format(iResultPrice));
        try{
            document.getElementById('opt_price_'+this.iPno).innerHTML = html;
        }catch(e){}
    },
    getBasketInfo:function(iPno)
    {
        if (iPno < 1) return false;
        return eval('PrdState'+iPno)['basket_info'];
    }
} //RtnPrd


var oPrdBoardForm;

/**
 * 암호화 요청방법
 */
function encryptPrdBoardSubmit(oForm)
{
    oPrdBoardForm = oForm;

    if (sAuthSSLFlag != 'T') {
        oForm.submit();
        return false;
    }

    AuthSSLManager.weave({
        // encrypt / decrypt
        'auth_mode': 'encrypt'
        // 엘리먼트 아이디 혹은 라디오박스는 name
        , 'aEleId': ['secret_passwd']
        // callback function-name
        , 'auth_callbackName': 'encryptPrdBoardSubmit_Complete'
    });
    return false;
}
/**
 * callback
 * @param String output
 */
function encryptPrdBoardSubmit_Complete(output) {

    if ( AuthSSLManager.isError(output) == true ) {
        alert("개인정보 암호화 실패. 관리자에게 문의해 주세요.");
        return false;
    }

    if (typeof(document.oPrdBoardSslForm) == 'object') {
        document.getElementsByTagName('body')[0].removeChild(document.oPrdBoardSslForm)
    }
    var oForm = document.createElement('form');
    oForm.setAttribute('method', 'post');
    oForm.setAttribute('name', 'oPrdBoardSslForm');
    oForm.setAttribute('id', 'oPrdBoardSslForm');
    oForm.setAttribute('action', oPrdBoardForm.action);
    oForm.setAttribute('target', oPrdBoardForm.target);

    for (i=0; i<oPrdBoardForm.elements.length; i++) {
        if (oPrdBoardForm.elements[i].name != 'secret_passwd') {
            var oCopyInput = document.createElement("input");
            oCopyInput.type = "hidden";
            oCopyInput.name = oPrdBoardForm.elements[i].name;
            oCopyInput.value = oPrdBoardForm.elements[i].value;
            oForm.appendChild(oCopyInput);
        }
    }

    var oCopyInput = document.createElement("input");
    oCopyInput.name = 'encode_str';
    oCopyInput.id = 'encode_str_del';
    oCopyInput.type = "hidden";
    oCopyInput.value = output;
    oForm.appendChild(oCopyInput);

    document.getElementsByTagName('body')[0].appendChild(oForm)

    oPrdBoardSslForm.submit();
}

var BigDataLog = {
        '_elementId'  : 'bigdata_log', // 굳이 변경하지 않아도 될 듯
        '_cookieName' : 'bigdata_log', // 환경에 맞게 변경하여 사용

        'getcookie' : function(name) {
            if (!document.cookie) return null;

            name = name || this._cookieName;
            var val = null;
            var arr = document.cookie.split((escape(name)+'='));
            if (arr.length >= 2) {
                var arrSub = arr[1].split(';');
                val = unescape(arrSub[0]);
            }

            return val;
        },

        'delcookie' : function(name) {
            name = name || this._cookieName;
            var sCookie  = escape(name) + '=; ';
                sCookie += 'expires='+ (new Date(1)).toGMTString() +'; ';
                sCookie += 'path=/; ';
                sCookie += 'domain='+ document.domain.replace(/^www\./i, '') +'; ';
            document.cookie = sCookie;
        },

        '_script' : function(src) {
            var node = document.createElement('script');
            node.setAttribute('type', 'text/javascript');
            node.setAttribute('id', this._elementId);
            node.setAttribute('src', src);
            document.body.appendChild(node);
        },

        '_iframe' : function(src) {
            var node = document.createElement('iframe');
            node.setAttribute('id', this._elementId);
            node.setAttribute('src', src);
            node.style.display = 'none';
            node.style.width = '0';
            node.style.height = '0';
            document.body.appendChild(node);
        },

        'save' : function() {
            var src  = '/front/php/bigdata_log.php'; // 환경에 맞게 변경하여 사용
                src += '?referer='+encodeURIComponent(document.referrer);
                src += '&href='+encodeURIComponent(location.href);

            this._script(src);
            //this._iframe(src);
        }
}

if (BigDataLog.getcookie()) {
    BigDataLog.delcookie();
} else {
    if (window.attachEvent) window.attachEvent('onload', function(){BigDataLog.save();});
    else                    window.addEventListener('load', function(){BigDataLog.save();}, false);
}


//  페이지 로드완료시 실행이 되어진다
window.onload   =   function () {
    _zoomImage();
}

// 최대 할인쿠폰 다운받기 팝업
function popupDcCoupon(product_no, coupon_no, cate_no) {
    href = '/front/php/popupDcCoupon.php?product_no='+product_no+'&coupon_no='+coupon_no+'&cate_no='+cate_no;
    option = 'toolbar=no,scrollbars=no,resizable=yes,width=285,height=157,left=0,top=0';
    win_name = 'popupDcCoupon'

    window.open( href, win_name, option );
}

var SecretComment = {
    /**
     * 비밀댓글 파라미터
     */	
    _param : {},
    
    /**
     * 비밀댓글 파라미터 저장
     * @param string key
     * @param string value
     */	
    setParam : function(key, value) {
        this._param[key] = value;
    },
    
    /**
     * 비밀댓글 파라미터 확인
     * @param string key
     */    	
    getParam : function(key) {
        return this._param[key];
    },
    
    /**
     * 비밀댓글 파라미터 초기화
     */
    resetParam : function() {
        this._param = {};
    },
    
    /**
     * 비밀댓글 확인 폼 열기
     * @param int board_no
     * @param int comment_no
     */ 
    showForm : function(board_no, comment_no) {
        var form_element = document.getElementById('secret_'+ board_no +'_'+comment_no);
    
        if (form_element != null) {
            form_element.style.display = 'block';
        } 
    },
    
    /**
     * 비밀댓글 확인 폼 닫기
     * @param int board_no 
     * @param int comment_no
     */   	
    hideForm : function(board_no, comment_no) {
        var form_element = document.getElementById('secret_'+ board_no +'_'+comment_no);
    
        if (form_element != null) {
            form_element.style.display = 'none';
        }
    },
    
    /**
     * 비밀댓글 확인
     * @param int board_no
     * @param int bbs_no
     * @param int comment_no  
     */       	
    showComment : function(board_no, bbs_no, comment_no) {
        var comment_password_id = 'pw_secret_comment_' + board_no + '_' + comment_no; 
        var comment_password = document.getElementById(comment_password_id);
    
        if (comment_password != null && get_string_trim(comment_password.value) == '') {
            alert('댓글비밀번호 항목은 필수 입력값입니다.');
            comment_password.focus();
            return;
        }
        
        this.setParam('board_no', board_no);
        this.setParam('bbs_no', bbs_no);
        this.setParam('comment_no', comment_no);
        
        if (sAuthSSLFlag == 'T') {
            AuthSSLManager.weave({
                'auth_mode': 'encrypt', 
                'aEleId': [comment_password_id], 
                'auth_callbackName': 'SecretComment.encryptCallback'
            });
        } else {
            var param_str = '&mode=comment_sec_json&comment_no=' + comment_no + '&board_no=' + board_no + '&comment_passwd=' + comment_password.value;
            sendRequest(SecretComment.showCommentCallback, parma_str, 'POST', '/front/php/b/board_read_new.php', true, true);
        }
    },
    
    /**
     * 개인정보 암호화 콜백
     * @param string output  
     */	
    encryptCallback : function(output) {
        if (AuthSSLManager.isError(output) == true) {
            alert("개인정보 암호화 실패. 관리자에게 문의해 주세요.");
            return false;
        }
        var param_str = '&mode=comment_sec_json&comment_no=' + SecretComment.getParam('comment_no') + '&board_no=' + SecretComment.getParam('board_no') + '&encode_str=' + output;
        sendRequest(SecretComment.showCommentCallback, param_str,'POST', '/front/php/b/board_read_new.php', true, true);
    },
    
    /**
     * 비밀댓글 확인 후 콜백
     * @param object oj  
     */ 	
    showCommentCallback : function(oj) {
        if (!oj || !oj.responseText) {
            return;
        }
        try {
            eval("var res = " + oj.responseText);
            if (res.return_code == 'fail') {
                alert(res.message);
            }
            else {
                var secret_comment_element = document.getElementById('cmt_sec_link_' + res.board_no + '_' + res.comment_no);
                if (secret_comment_element != null) {
                    secret_comment_element.innerHTML = res.comment;
                    secret_comment_element.onclick = null;
                    secret_comment_element.removeAttribute('id');
                    secret_comment_element.removeAttribute('style');
                }
                SecretComment.hideForm(res.board_no, res.comment_no);
            }
        } 
        catch (e) {
        }
    }
}
