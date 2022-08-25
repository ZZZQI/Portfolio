$(document).ready(function() {
	//检测窗口大小
	var currentWindowHeight = $(window).height();
	$("#main").css("height",currentWindowHeight);
	$(".line").css("height",currentWindowHeight/3);
	//每次窗口大小改变，调整main大小
	$(window).resize(function() {
		currentWindowHeight = $(window).height();
		$("#main").css("height",currentWindowHeight);
		$(".line").css("height",currentWindowHeight/3);
	});
	//底部按钮
	//返回
	$("#back").click(function() {
		window.open("index.html","_self")
	});
	//重来
	$("#again").click(function() {
		 history.back(-1);
	});
});