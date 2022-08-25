var socket = io();
socket.on("connect", function() {
	alert("socket connect!")
});
socket.on("play",function(soundName) {
	playMusic(soundName);
});
socket.on("disconnect", function(){alert("socket disconnect!")});



function playMusic(soundName) {
	var src = "src/sound/" + soundName;
	var audio = $("<audio></audio>").attr("src",src).addClass("temp");
	$("#main").append(audio);
	$("#main>audio:last")[0].play();
	$("#main").remove(".temp");
}



var musicName;	//本次游戏使用的乐谱名

//控制页面自动滚动
var passedDiv = 0;
var scrollerHeight = 0;
function scroller() {
	var divHeight = $(".black").height();

	if( scrollerHeight > (clickedDiv+1) * divHeight ) {
		//跳转到输
		window.open("lose_jingji.html","_self")
	}

	else if( clickedDiv <= musicName.length ) {
		var time = musicName[clickedDiv]["time"];
		var msPpx = (time*1000) / divHeight;
		window.scrollBy(0,-1);
		scrollerHeight++;
		setTimeout("scroller()",msPpx*10);
	}
	
	return 0;
}

//顶部计数
function addNum() {
	clickedDiv++;
	if(clickedDiv <= 9) {
		$("#countNum").text("00" + clickedDiv.toString());
	}
	else if(clickedDiv <= 100 && clickedDiv >= 10) {
		$("#countNum").text("0" + clickedDiv.toString());
	}
	else {
		$("#countNum").text(clickedDiv.toString());
	}
}

//点击下一个黑块
function clickNext(e) {
	$(".white").click(function() {
   		window.open("lose_jingji.html","_self")
   	});
	$(e).parent().prev().children(".black").one("click",function() { 
		operateCurrentDiv(this);
	   	if( loadAppendI < musicName.length ) {
	   		appendDiv( musicName[ loadAppendI ] );
	   	} 

	  	if( clickedDiv < musicName.length ) {
	  		clickNext(this);
	  	}
	  	else {
	  		//跳转到赢
	  		window.open("win_jingji.html","_self")
	  	}

   	});
}


//添加start,stop div
function appendSS() {
	//顶部计数
	var countNum = $("<p></p>");
	countNum.attr("id","countNum");
	//停止
	var parentDivStop = $("<div></div>");
	parentDivStop.attr("id","stop");
	//开始
	var parentDivStart = $("<div></div>");
	parentDivStart.attr("id","start");

	parentDivStop.append("<div></div>").append("<div></div>").append("<div></div>").append("<div></div>");
	parentDivStart.append("<div></div>").append("<div></div>").append("<div></div>").append("<div></div>");

	$("#main").append(countNum);
	$("#countNum").after(parentDivStart).after(parentDivStop);
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
	//已点击的数量增加
	addNum();
	//页面自动滚动
	scroller();	
	//遍历黑块的子元素
   	var childNum = 0;
   	while( $(currentDiv).children()[childNum] ) {
   		//如果标签为audio则播放
   		if ($(currentDiv).children()[childNum].tagName == "AUDIO")
   			//$(currentDiv).children()[childNum].play();
   			socket.emit('audio', $(currentDiv).children()[childNum].src);
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
	$("td").click(function() {
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
				//页面回到底部
				$(document).scrollTop($(document).height());

			});

			//开始时页面在底部
		   	$.mobile.silentScroll( $(document).height());
		   	window.onbeforeunload = function () {
		   		$.mobile.silentScroll( $(document).height());
		   	}

			//顶部计数
		   	$("#countNum").text("000");

		   	//第一个黑块添加文字
			$("#start").prev().children(".black").append("<p>开始</p>");

		   	//点击开始,页面开始滚动
		   	$("#start").prev().children(".black").one("click",function() {
		   		operateCurrentDiv(this);
		   		clickNext(this);
		   	});
		   	//踩到白块输
		   	$(".white").click(function() {
		   		window.open("lose_jingji.html","_self")
		   	});

   		});
	});
});