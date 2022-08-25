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
		//获取乐谱文件名
		var musicName = catalog[showName];
		window.open("shuangshou.html?musicName="+musicName,"_self");

	});
});