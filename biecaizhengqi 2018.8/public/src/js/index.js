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
	//每个按键跳转
	$("#jingdian").click(function() {
		window.open("jingdian.html","_self")
	});
	$("#jingji").click(function() {
		window.open("jingji.html","_self")
	});
	$("#shuangshou").click(function() {
		window.open("shuangshou-choosemusic.html","_self")
	});
	$("#shuangren").click(function() {
		window.open("shuangren.html","_self")
	});
	$("#jieli").click(function() {
		window.open("jieli.html","_self")
	});
	$("#paihangbang").click(function() {
		window.open("paihangbang.html","_self")
	});
	//登录
	if( window.location.href.match("uname=") != null) {
		$("#form-denglu").hide();
		$('.line').css('animation-play-state','paused');
	}
	else {
		$("#form-denglu").show();
		$('.line').css('animation-play-state','paused');

		$("#paihangbang").on("animationend webkitAnimationEnd",function(e) {
			$("#paihangbang").click(function(){
				//$("#choose-login").show();
			});
			
		//	$('.line').css('animation-play-state','running');
		})
		$("#zhuce-confirmpwd").keydown(function() {
			var pwd = $("#zhuce-pwd").val();
			var confirmpwd =  $("#zhuce-confirmpwd").val();
			if( confirmpwd.length > pwd.length ) {
				alert("确认密码不一致");
			}
			else if( pwd.slice(0,confirmpwd.length) != confirmpwd) {
				alert("确认密码不一致");
			}
		});
	}
	//获取用户信息，以前登陆过则获取本地存储，没有则分配新账号
	getUserInfo();
	alert("欢迎~"+window.localStorage.id)
});

//获取用户名
function getUname() {
	var url = window.location.href;
	var reg = /\?uname=(.*)/;
	return url.match(reg)[1];
}

//从本地存储中读取用户信息
function getUserInfo() {
	if( !window.localStorage.length ) {
		$.ajax({
			type: "POST",
			url: "sign",
			data: {"id":window.localStorage.id},
			dataType: "json",
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert("error message :" + errorThrown.toString());
			},
			success: function(data) {
				window.localStorage.id = data;
			}
		});
	}
}