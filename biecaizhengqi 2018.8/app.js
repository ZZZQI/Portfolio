const Koa = require("koa");
const path = require("path");
const serve = require("koa-static");
const route = require("koa-route");
const fs = require("fs");
const userBean = require("./mysql/userBean");
const IO = require("koa-socket");
const bodyParser = require("koa-bodyparser");

//初始化一个服务器
const app = new Koa();
const io = new IO();

//加载静态资源
const staticFile = serve(path.join(__dirname+"/public"))
app.use(staticFile);
app.use(bodyParser());

//路由
	//首页
const main = ctx => {
	ctx.response.type = "html";
	ctx.response.body = fs.createReadStream("./public/index.html");
}
app.use(route.get("/index.html",main));
	//经典
const jingdian = ctx => {
	ctx.response.type = "html";
	ctx.response.body = fs.createReadStream("./public/jingdian.html");
}
app.use(route.get("/jingdian.html",jingdian));
	//竞技
const jingji = ctx => {
	ctx.response.type = "html";
	ctx.response.body = fs.createReadStream("./public/jingji.html");
}
app.use(route.get("/jingji.html",jingji));
	//双手
const shuangshou = ctx => {
	ctx.response.type = "html";
	ctx.response.body = fs.createReadStream("./public/shunagshou-choosemusic.html");
}
app.use(route.get("/shunagshou-choosemusic.html",shuangshou));
	//双人
const shuangren = ctx => {
	ctx.response.type = "html";
	ctx.response.body = fs.createReadStream("./public/shuangren.html");
}
app.use(route.get("/shuangren.html",shuangren));
	//排行榜
const paihangbang = ctx => {
	ctx.response.type = "html";
	ctx.response.body = fs.createReadStream("./public/paihangbang.html");
}
app.use(route.get("/paihangbang.html",paihangbang));


//表单、ajax
app.use(async (ctx) => {
	//登录
	if(ctx.url === "/sign-in" && ctx.method === "POST") {
		let postData = await parsePostData(ctx);
		//在数据库中查找
		let existFlag = await searchDatabase(postData);
		if( existFlag ) {
			ctx.response.redirect("/index.html?uname="+postData.uname);
		}
		else {
			ctx.response.redirect("/index.html");
		}
	}
	//注册
	else if(ctx.url === "/sign-up" && ctx.method === "POST") {
		let postData = await parsePostData(ctx);
		//写入数据库
		insertDatabase(postData);
		ctx.response.redirect("/index.html?uname="+postData.uname);
	}
	//免密码登陆/注册
	else if(ctx.url === "/sign" && ctx.method === "POST") {
		let data = ctx.request.body;
		let id = await cipherFreeSign(data);
		console.log(id)
		ctx.response.body = JSON.stringify(id);
	}
	//排行榜
	else if(ctx.url === "/paihangbang" && ctx.method === "POST") {
		let arrayData = await getScore();
		ctx.response.body = JSON.stringify(arrayData);
	}
	//出错
	else {
		ctx.body = "<h1>404<h1>";
	}

});

io.attach(app);
var id=0;
io.on("connection",function(socket) {
	socket.id = id;
	id++;
	console.log("a client connected!")
	io.on("audio", (ctx,data) => {
		var soundName = data.split("/sound/")[1];
	//	io.socket.emit("play","music!");
		console.log(socket.id)
		io.sockets.connected[0].socket.emit("play", soundName);
	});
});


//解析上下文里的数据
function parsePostData(ctx) {
	return new Promise((resolve,reject) => {
		try {
			let postdata = "";
			ctx.req.addListener("data",(data) => {
				postdata += data;
			})
			ctx.req.addListener("end",function() {
				let parseData = parseQueryStr(postdata);
				resolve(parseData);
			})
		}
		catch (err) {
			reject(err);
		}
	});
}
//将数据转为json格式
function parseQueryStr(queryStr) {
	let queryData = {};
	let queryStrList = queryStr.split("&");
	for(let[index,queryStr] of queryStrList.entries()) {
		let itemList = queryStr.split("=");
		queryData[itemList[0]] = decodeURIComponent(itemList[1]);
	}
	return queryData;
}

//注册,向数据库插入数据
function insertDatabase(postData) {
	if( postData.uname != "" && postData.pwd != "" ) {
			var inquireSql = "SELECT * from users";
			var addSql = "insert into users (id,uname,pwd,score) values(?,?,?,?)";
			//查询数据库中是否已存在
			userBean.query(inquireSql, [postData.uname]).then(function(rs) {
				for(var i=0; i<rs.length; i++) {
					if( rs[i].uname == postData.uname && rs[i].pwd == postData.pwd ) {
						console.log("此用户已存在");
						return;
					}
				}
				//不存在则写入
				var insertData = [rs.length+1, postData.uname, postData.pwd, 0.00];
				userBean.query(addSql, insertData, [postData.uname]).then(function(err) {
					if(err.message) {
						console.log("insert err:",err.message);
						return;
					}
					console.log("insert success");
				});
			});
			
		}
}

//登录,在数据库中查找数据
function searchDatabase(postData) {
	return new Promise((resolve,reject) => {
		try {
			if( postData.uname != "" && postData.pwd != "" ) {
				let inquireSql = "SELECT * from users";
				//查询数据库中是否已存在
				userBean.query(inquireSql, [postData.uname]).then(function(rs) {
					for(let i=0; i<rs.length; i++) {
						if( rs[i].uname == postData.uname && rs[i].pwd == postData.pwd ) {
							//存在
							resolve("true");
							break;
						}
					}
				});	
			}
		}
		catch(err) {
			reject(err);
		}
		
	});
	
}

//免密码注册/登陆
function cipherFreeSign(postData) {
	return new Promise((resolve,reject) => {
		try {
			if( postData.id == null ) {
				var inquireSql = "SELECT * from users";
				var addSql = "insert into users (id,uname,pwd,score) values(?,?,?,?)";
				//不存在则写入
				userBean.query(inquireSql, [postData.uname]).then(function(rs) {
					//不存在则写入
					var insertData = [rs.length+1, rs.length+1,"cipherFree", 0.00];
					userBean.query(addSql, insertData, [postData.uname]).then(function(err) {
						if(err.message) {
							console.log("insert err:",err.message);
							return;
						}
						console.log("insert success");
						resolve(rs.length+1);
					});
				});	
			}
			else {
				console.log("免密码登陆出错")
			}
		}
		catch(err) {
			reject(err);
		}
	});
}

//获取用户得分
function getScore() {
	return new Promise((resolve,reject) => {
		try {
			let inquireSql = "SELECT * from users";
			//遍历数据库
			userBean.query(inquireSql).then(function(rs) {
				let arrayData = [];
				for(let i=0; i<rs.length; i++) {
					let queryUser = {};
					queryUser.uname = rs[i].uname;
					queryUser.score = rs[i].score;
					arrayData.push(queryUser);
				}
				resolve(arrayData);
			});
		}
		catch(err) {
			reject(err);
		}
		
	});
	
}


//设置监听端口
app.listen(3000);