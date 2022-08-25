$(document).ready(function() {
	$.ajax({
		type: "POST",
		url: "paihangbang",
		dataType: "json",
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("error message :" + errorThrown.toString());
		},
		success: function(data) {
			//排序
			function compare(a,b) {
				return a.score < b.score;
			}
			data.sort(compare);
			console.log(data);
			//输出
			var i=0,j=0;
			var lastScore = data[0].score;
			for(var key in data) {
				if(data[key].score < lastScore) {
					lastScore = data[key].score;
					j++;
				}

				var tr = $("<tr></tr>");
				var tdFirst = $("<td></td>").html(j+1);
				var tdSecond = $("<td></td>").html(data[key].uname);
				var tdThird = $("<td></td>").html(data[key].score);
				//奇数行则添加类
				if( i%2 == 1 ) {
					tr.addClass("odd");
				}
				tr.append(tdFirst).append(tdSecond).append(tdThird);
				$("#paihangbang").append(tr);
			}
		}
	});

});