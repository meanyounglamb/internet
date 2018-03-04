function open_window( filename, option, name )
{
	if( !name )
	{
		name = 'new'
	}


        win = window.open( filename, name, option );

        return win
}

function window_open( page, name, top, left, width, height )
{
	option = "'toolbar=no," +
		"location=no," +
		"directories=no," +
		"status=no," +
		"menubar=no," +
		"scrollbars=yes," +
		"resizable=yes," +
		"width=" + width + "," +
		"height=" + height + "," +
		"top=" + top + "," +
		"left=" + left + "'"

        window.open( page, name, option );
}

function open_poll_pop( mode, no )
{
	page = '/front/php/poll_r.php?mode=' + mode + '&no=' + no;
	window_open( page, 'poll', 100, 300, 466, 382 );
}

/*Left menu 반투명 레이어 구현*/
function Layer_overload(LayerName,Status) 
{
    if (navigator.appName == "Netscape")
    {
		LayerN = document.getElementById(LayerName).style;
		if (Status == 'show') LayerN.visibility = 'visible';
		if (Status == 'hide') LayerN.visibility = 'hidden';
    }	
    else
    {
		LayerN = document.all[LayerName].style;
		if (Status == 'show') LayerN.visibility = 'visible';
		if (Status == 'hide') LayerN.visibility = 'hidden';
    }
}

/*Left menu구현*/
var old='';

function menu(name)
{
	submenu=eval("submenu_"+name+".style");
	if(old!=submenu)
	{
		if(old!='')
		{
			old.display='none';
		}
		submenu.display='block';
		old=submenu;
	}
	else
	{
		submenu.display='none';
		old='';
	}
}


function Layer_rollover(img_name,img_url)
{
	var menu;	
	//tmp = new String( "document."+img_name );
	menu=eval("document."+img_name);		
	menu.src = img_url;
	return;
}

function image_zoom( product_no, main_cate_no, display_group )
{
	//href = '/front/php/image_zoom.php?img='+image+'&product_no='+document.frm.product_no.value;
	href = '/front/php/image_zoom.php?product_no='+product_no+'&main_cate_no='+main_cate_no+'&display_group='+display_group;
	option = 'toolbar=no,scrollbars=no,resizable=yes,width=800,height=640,left=0,top=0';
	win_name = 'image'

	window.open( href, win_name, option );
}
            