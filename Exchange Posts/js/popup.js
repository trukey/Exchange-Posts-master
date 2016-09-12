/**
 * Created by xwm on 15-9-28.
 * discuz 微信信息抓取处理过程
 */

var title='';
var author='';
var inner='';

var imgUrl='';

var imgUrls='';

var type='';
var timg='';


function click(e) {

	if(1 == type){
	  chrome.tabs.executeScript(null,
				{code:"document.getElementById('subject').value='" + title + "';document.getElementById('e_textarea').value='" + inner  + "';document.getElementById('e_downremoteimg').click();"});
	}else if(2 == type){
			  chrome.tabs.executeScript(null,
				{code:"document.getElementsByTagName('input')[0].value='" + title + "';document.getElementsByTagName('input')[1].value='" + author + "';document.getElementById('js_imagedialog').click;document.getElementById('ueditor_0').contentWindow.document.body.innerHTML='" + inner + "';"});
	}else{
		alert('The url is not allowed!');
	}
}


function change(e) {
  var linkurl = document.getElementById("scurl").value;
  
  type = domainURI(linkurl);
  if('mp.weixin.qq.com'==type){
	  type = 1;
	getMes_w(linkurl);
  }else if('dcrx.xwm.360.cn'==type || 'home.qihoo.net'==type){
	  type = 2;
	getMes_h(linkurl);
  }else{
	  type = 0;
	alert('The url is not allowed!');
  }
  

}

function domainURI(str){
    var durl=/http:\/\/([^\/]+)\//i;
    var domain = str.match(durl);
    return domain[1];
 }

function getMes_w(linkurl){
	$.ajax({
			type:"GET",
			url:linkurl,
			cache:false,
			dataType:"html",
			success:function(data){
				inner=data;
				title = data;
				
				var t1 = title.indexOf('activity-name');
				title = title.substr(t1+41);
				var t2 = title.indexOf('</h2>');
				title = title.substring(0,t2-23);
				title = title.split("\r\n"); 

				
				
				var s1 = inner.indexOf('js_cover');
				
				if(s1 >= 0){
					inner = inner.substr(s1-412);
				}else{
					s1 = inner.indexOf('js_content');
					inner = inner.substr(s1+12);
				}
				

				var s2 = inner.indexOf('first_sceen__time');
				inner = inner.substring(0,s2-4);

				
				var re = /\bsrc\s*=\s*"http:[^>"]*wx_fmt/ig;
				var imglink = inner.match(re);
				
				var len = imglink.length;

				imgUrl = new Array(len);
				
				
				for(var i=0;i<len;i++)
				{
					imgUrl[i]= new Image();
					imgUrl[i].src = imglink[i].replace(/wx_fmt/,"wx_fmt.jpg").replace(/\/0"/,"/0.jpg");
				}
				
				
				//inner = inner.replace(/\bstyle="[^>]*"/g,"").replace(/<script(.|\n)*\/script>\s*/ig, "").replace(/"http/g,">[/p][img]\nhttp").replace(/wx_fmt/g,"wx_fmt.jpg[/img][/p]<").replace(/\/0"/,"/0.jpg[/img][/p]<").replace(/&nbsp;/," ");
				//inner = inner.replace(/<div[^>]*>/g,"[/p][/p]\n").replace(/<\/p>/g,"[/p]\n").replace(/\ +/g,"").replace(/[\r\n]/g,"").replace(/\\/gi,"\\\\").replace(/"/gi,"\\\"").replace(/'/gi,"\\\'").replace(/<[^>]*>/g,"").replace(/\(function[^>]*>/g,"").replace(/'\);}\)\(\);/g,"").replace(/data-[^>]*>/g,"").replace(/\/>/g,""); 
				//inner = inner.substring(0,inner.length-1);
				//alert(inner);
				inner = inner.replace(/suffix_src[^>]*>/g,"").replace(/<p>/g,"").replace(/<\/p>/g,"[/p]").replace(/\bstyle="[^>]*"/g,"").replace(/<script(.|\n)*\/script>\s*/ig, "");

				inner = inner.replace(/http:\/\/[^"]*\/640\?wx_fmt=/,"").replace(/"http/g,">[/p][img]\nhttp").replace(/wx_fmt/g,"wx_fmt.jpg[/img][/p]<").replace(/\/0"/,"/0.jpg[/img]\n<").replace(/\/640"/,"/640.jpg[/img]\n<").replace(/&nbsp;/," ");

				inner = inner.replace(/<div[^>]*>/g,"[/p]\n").replace(/<\/p>/g,"[/p]\n").replace(/\ +/g,"").replace(/[\r\n]/g,"").replace(/\\/gi,"\\\\").replace(/"/gi,"\\\"").replace(/'/gi,"\\\'").replace(/<[^>]*>/g,"").replace(/\(function[^>]*>/g,"").replace(/'\);}\)\(\);/g,"").replace(/data-[^>]*>/g,"").replace(/\/>/g,"");

				inner = inner.replace(/[\/p]+/,"[\/p]").replace(/[\[]*[\[\/p\]]+/,"[/p]").replace(/\[\]/,"").replace(/<[^>]*/g,"");
				inner += "<ttt";
				inner = inner.replace(/<ttt/,"");
			},
			error:function(){
				inner = 'failer';
			}
	});
}

function getMes_h(linkurl){
	$.ajax({
			type:"GET",
			url:linkurl,
			cache:false,
			dataType:"html",
			success:function(data){
				inner=data;
				title = data;
				author = data;

				var t1 = title.indexOf('thread_subject');
				title = title.substr(t1+16);
				var t2 = title.indexOf('</span>');
				title = title.substring(0,t2);
				title = title.split("\r\n"); 

				var a1 = author.indexOf('xi2');
				author = author.substr(a1+5);
				var a2 = author.indexOf('</a>');
				if(a2 <= 8){
					author = author.substring(0,a2);
				}else{
					author = author.substring(0,8);
				}
				
				author = author.split("\r\n");
				
				var i1 = inner.indexOf('<br />');
				inner = inner.substr(i1+7);
				
				var i2 = inner.indexOf('</tr>');
				inner = inner.substring(0,i2);
				
				var re = /zoomfile=\"data\/attachment\/forum\/[^"]*.jpg\"/ig;
				var imglink = inner.match(re);
				if(imglink != null){
					//alert(imglink);
					var len = imglink.length;
					imgUrl = new Array(len);
					
					for(var i=0;i<len;i++)
					{
						imgUrl[i]= new Image();
						imgUrl[i].src = imglink[i].replace(/\bzoomfile=\"/,"http:\/\/home.qihoo.net\/").replace(/.jpg\"/,".jpg");
					}
					
					/*for(var i=0;i<len;i++)
					{
						imgUrls += (imgUrl[i].src + "<br />");
					}
					alert(imgUrls);*/
				}
				

				//inner = '<img class="lazy" style="border: 0px; cursor: pointer; display: inline;" datasrc="g5/M00/0C/04/ChMkJ1X7sLqIK_8AAAO9dNigRLYAACwqgER6D0AA72M501.jpg" src="http://i1.bbswater.fd.zol-img.com.cn/t_s1200x5000/g5/M00/0C/04/ChMkJ1X7sLqIK_8AAAO9dNigRLYAACwqgER6D0AA72M501.jpg" data-width="1200" width="1200" height="800" data-original="http://i1.bbswater.fd.zol-img.com.cn/t_s1200x5000/g5/M00/0C/04/ChMkJ1X7sLqIK_8AAAO9dNigRLYAACwqgER6D0AA72M501.jpg" data-picid="36906677" data-role="gallery" data-info="1200#1" data-src="4">/0';
 				inner = inner.replace(/\bzoomfile=\"data\/attachment\/forum\//gi,"\/>http:\/\/home.qihoo.net\/data\/attachment\/forum\/").replace(/.jpg\"\ file/gi,".jpg\"\>\ <img");
				inner = inner.replace(/<img/gi,"<div ").replace(/<strong>/g,"<p>").replace(/<\/strong>/g,"<\/p>");			
				
				inner = inner.replace(/\\/gi,"\\\\").replace(/"/gi,"\\\"").replace(/'/gi,"\\\'").replace(/[\r\n]+/g,"<p>").replace(/http:\/\/home.qihoo.net\//g,"<img src=\"http:\/\/home.qihoo.net\/");
				inner = inner.replace(/<div[^>]*>/g,"<p>").replace(/<\/div>/g,"<\/p>").replace(/<strong>[^<]*<\/strong>/g,"").replace(/<em[^<]*<\/em>/g,"").replace(/<span[^<]*<\/span>/g,"").replace(/<p class[^<]*<\/p>/g,"").replace(/<a[^<]*<\/a>/g,"");
 		

			},
			error:function(){
				inner = 'failer';
			}
	});		
}


document.addEventListener('DOMContentLoaded', function () {
	var scurl = document.getElementById("scurl");
	scurl.addEventListener('change', change);

    var divs = document.getElementById("btn");
    divs.addEventListener('click', click);
});

