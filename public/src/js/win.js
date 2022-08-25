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
	//用时
	var countSecond = window.location.href.split("=")[1];
	$("#time").children().html(countSecond+"	s");
	//底部按钮
	//返回键
	$("#back").click(function() {
		window.open("index.html","_self")
	});
});