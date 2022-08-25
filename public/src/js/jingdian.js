var musicName;	//本次游戏使用的乐谱名

//点击下一个黑块
function clickNext(e) {
	$(".white").on("tap",function() {		//踩到白块lose
   		window.open("lose_jingdian.html","_self")
   	});
	$(e).parent().prev().children(".black").one("click",function() { 	//当点击下一个时
	   	operateCurrentDiv(this);
	   	//添加的div数量等于乐谱长度则全部添加完毕，停止添加
	   	if( loadAppendI < musicName.length ) {
	   		appendDiv( musicName[ loadAppendI ] );
	   	} 
	   	//点击的div数量等于乐谱长度则全部点击完毕，停止点击下一个
	  	if( clickedDiv < musicName.length ) {
	  		clickNext(this);
	  	}
	  	//全部点击完毕时，win
	  	else {
	  		stopFlag = 1;
	  	}

   	});
}

function win() {
	window.open("win_jingdian.html?countSecond="+countSecond.toFixed(3),"_self");
}

//顶部计时
var countSecond = 0.000;	//已花时间
var stopFlag = 0;	//控制计时停止
function addSecond()
{ 
	if(stopFlag === 1)
	{
		setTimeout("win()",1000);
		return;
	}
	countSecond += 0.001;
	$("#countSecond").text(countSecond.toFixed(3).toString()+"/s");
	setTimeout("addSecond()",1);
}

//添加start,stop div
function appendSS() {
	//顶部计数
	var countSecond = $("<p></p>");
	countSecond.attr("id","countSecond");
	//停止
	var parentDivStop = $("<div></div>");
	parentDivStop.attr("id","stop");
	//开始
	var parentDivStart = $("<div></div>");
	parentDivStart.attr("id","start");

	parentDivStop.append("<div></div>").append("<div></div>").append("<div></div>").append("<div></div>");
	parentDivStart.append("<div></div>").append("<div></div>").append("<div></div>").append("<div></div>");

	$("#main").append(countSecond);
	$("#countSecond").after(parentDivStart).after(parentDivStop);
}

var loadAppendI = 0;	//用于遍历乐谱数组
//添加中间div
function appendDiv(musicNameLine) {
	//初始化一行
	var parentDiv = $("<div></div>");
	var childDiv0 = $("<div></div>");
	var childDiv1 = $("<div></div>");
	var childDiv2 = $("<div></div>");
	var childDiv3 = $("<div></div>");

	//随机选择0-3列中的一列
	var SWLine = Math.floor(Math.random()*4); 

	//遍历乐谱当前行的音符
	var i=0; 
	while(musicNameLine[i]) {
		var src = "src/sound/" + musicNameLine[i] + ".mp3";
		var audio = $("<audio></audio>").attr("src",src);
		switch( SWLine )
		{
			case 0:
				childDiv0.append(audio);
				break;
			case 1:
				childDiv1.append(audio);
				break;
			case 2:
				childDiv2.append(audio);
				break;
			case 3:
				childDiv3.append(audio);
				break;
		}
		i++;
	}

	switch ( SWLine ) //将选中的块设置为黑块
	{
		case 0:
			childDiv0.addClass("black");
			childDiv1.addClass("white");
			childDiv2.addClass("white");
			childDiv3.addClass("white");	
			break;
		case 1:
			childDiv0.addClass("white");
			childDiv1.addClass("black");
			childDiv2.addClass("white");
			childDiv3.addClass("white");	
			break;
		case 2:
			childDiv0.addClass("white");
			childDiv1.addClass("white");
			childDiv2.addClass("black");
			childDiv3.addClass("white");	
			break;
		case 3:
			childDiv0.addClass("white");
			childDiv1.addClass("white");
			childDiv2.addClass("white");
			childDiv3.addClass("black");	
			break;
	}
	parentDiv.append(childDiv0).append(childDiv1).append(childDiv2).append(childDiv3);

	$("#stop").after(parentDiv);

	//用于下一次进入函数时传入下一个音符
	loadAppendI++;	
}

function operateCurrentDiv(currentDiv) {
	clickedDiv++;
	var divHeight = $(".black").height();
	window.scrollBy(0,-divHeight);
	   	
	//遍历黑块的子元素
   	var childNum = 0;
   	while( $(currentDiv).children()[childNum] ) {
   		//如果标签为audio则播放
   		if ($(currentDiv).children()[childNum].tagName == "AUDIO")
   			$(currentDiv).children()[childNum].play();
   		childNum++;
   	}

	$(currentDiv).css("background-color","grey");
}

var clickedDiv = 0;

$(document).ready(function() {
	//游戏页面隐藏
	$("#main").hide();
	//加载乐曲列表
	var i=0;
	for(var showName in catalog) {
		var tr = $("<tr></tr>");
		var tdFirst = $("<td></td>").html(i+1);
		var tdLast = $("<td></td>").html(showName);
		//奇数行则添加类
		if( i%2 == 1 ) {
			tr.addClass("odd");
		}
		tr.append(tdFirst).append(tdLast);
		$("#choose-music").append(tr);
		i++;
	}
	//选择乐曲时
	$("td").on("tap",function() {
		var showName = $(this).parent().children().eq(1).html();
		//加载相应js文件
		$.getScript("src/music/music-jingji/"+catalog[showName]+".js",function(){
			//获取乐谱文件
			musicName = eval(catalog[showName]);
		
		
			//隐藏目录页面，显示游戏页面
			$("#choose-music").hide();
			$("#main").show();
			
			//开始游戏
			$("body").css("overflow","hidden");

			var loadAppendDiv = $(document).height()/50 + 1;	//控制最开始添加多少个div
			if( loadAppendDiv > musicName.length) {
				loadAppendDiv = musicName.length;
			}
			//添加countSecond,stop,start
			appendSS();
			for( ; loadAppendI < loadAppendDiv ; ) {
				appendDiv( musicName[ loadAppendI ] );
			}

			//设置main长度为全屏
			var currentWindowHeight = $(document).height();
			$("#main").css("height",currentWindowHeight);
			//每次窗口大小改变
			$(window).resize(function() {
				//调整main大小
				currentWindowHeight = $(document).height();
				$("#main").css("height",currentWindowHeight);

			});

			//开始时页面在底部
		   	$.mobile.silentScroll( $(document).height());
		   	window.onbeforeunload = function () {
		  	 	$.mobile.silentScroll( $(document).height());
		   	}

			//顶部计时
		   	$("#countSecond").text("0.000"+"/s");

		   	//第一个黑块添加文字
			$("#start").prev().children(".black").append("<p>开始</p>");
			//$("#start").prev().children(".black").css("height","80%")
		   	//点击开始,页面开始滚动
		   	$("#start").prev().children(".black").one("click",function() {
		   		operateCurrentDiv(this);
		   		addSecond();
		   		clickNext(this);
		   	});
		   	//踩到白块lose
		   	$(".white").on("tap",function() {
		   		window.open("lose_jingdian.html","_self")
		   	});
		});
	});
	
});