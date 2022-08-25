var musicName = wuNianTaGui;	//本次游戏使用的乐谱名

//控制页面自动滚动
var passedDiv = 0;
var scrollerHeight = 0;
function scroller() {
	var divHeight = $(".black").height();

	if( scrollerHeight * 2 > (clickedDiv+1) * divHeight ) {
		//跳转到输
		window.open("lose_twoHands.html","_self")
	}

	else if( clickedDiv*2+1 <= musicName.length ) {
		var time = musicName[clickedDiv*2+1]["time"];
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
   		window.open("lose_twoHands.html","_self")
   	});
	$(e).parent().prev().children(".black").one("click",function() { //点击该行一个黑块
		operateCurrentDiv(this);
		$(e).parent().prev().children(".black").one("click",function() { //点击该行另一个黑块
			operateCurrentDiv(this); 
		   	if( loadAppendI*2 < musicName.length ) {
		   		appendDiv();
		   	} 

		  	if( clickedDiv*2 < musicName.length ) {
		  		clickNext(this);
		  	}
		  	else {
		  		//跳转到赢
		  		window.open("win_twoHands.html","_self")
		  	}
		});
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

//添加中间div
var loadAppendI = 0;	//用于遍历乐谱数组
function appendDiv() {
	//初始化一行
	var parentDiv = $("<div></div>");
	var childDiv0 = $("<div></div>");
	var childDiv1 = $("<div></div>");
	var childDiv2 = $("<div></div>");
	var childDiv3 = $("<div></div>");

	//随机选择左边两列中的一列
	var SWLineL = Math.floor(Math.random()*2); 
	//随机选择右边两列中的一列
	var SWLineR = Math.floor(Math.random()*2); 

	//遍历乐谱当前行的音符(左手)
	var i=0; 
	while(musicName[loadAppendI*2]["l"+i]) {
		var src = "src/sound/" + musicName[loadAppendI*2+1]["r"+i] + ".mp3";
		var audio = $("<audio></audio>").attr("src",src);
		switch( SWLineL )
		{
			case 0:
				childDiv0.append(audio);
				break;
			case 1:
				childDiv1.append(audio);
				break;
		}
		i++;
	}
	//遍历乐谱当前行的音符(右手)
	i=0; 
	while(musicName[loadAppendI*2+1]["r"+i]) {
		var src = "src/sound/" + musicName[loadAppendI*2+1]["r"+i] + ".mp3";
		var audio = $("<audio></audio>").attr("src",src);
		switch( SWLineR )
		{
			case 0:
				childDiv2.append(audio);
				break;
			case 1:
				childDiv3.append(audio);
				break;
		}
		i++;
	}
	switch ( SWLineL ) //将选中的块设置为黑块(左手)
	{
		case 0:
			childDiv0.addClass("black");
			childDiv1.addClass("white");
			break;
		case 1:
			childDiv0.addClass("white");
			childDiv1.addClass("black");
			break;
	}
	switch ( SWLineR ) //将选中的块设置为黑块(右手)
	{
		case 0:
			childDiv2.addClass("black");
			childDiv3.addClass("white");
			break;
		case 1:
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
   			$(currentDiv).children()[childNum].play();
   		childNum++;
   	}

	$(currentDiv).css("background-color","grey");
}

var clickedDiv = 0;
$(document).ready(function() {
	var loadAppendDiv = $(document).height()/50 + 1;	//控制最开始添加多少个div
	if( loadAppendDiv*2 > musicName.length) {
		loadAppendDiv = musicName.length/2;
	}
	//添加countSecond,stop,start
	appendSS();
	for( ; loadAppendI < loadAppendDiv ; ) {
		appendDiv();
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
   	$(document).scrollTop($(document).height());
   	//刷新时回到底部
   	window.onbeforeunload = function () {
   		$(document).scrollTop($(document).height());
   	}

	//顶部计数
   	$("#countNum").text("000");

   	//第一个黑块添加文字
	$("#start").prev().children(".black").append("<p>开始</p>");

   	//点击开始,页面开始滚动
   	$("#start").prev().children(".black").one("click",function() { //点击该行一个黑块
   		operateCurrentDiv(this);
   		$("#start").prev().children(".black").one("click",function() { //点击该行另一个黑块
   			operateCurrentDiv(this);
   			clickNext(this);
   		});
   	});
   	//踩到白块输
   	$(".white").click(function() {
   		window.open("lose_twoHands.html","_self")
   	});
});