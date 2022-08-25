const User = require("mysql-pro");
const userBean = new User({
	mysql: {
		host: "localhost",
		user: "root",
		password: "Zq.676762",
		database: "biecaizhengqi",
		port: "3306",
		insecureAuth : true
	}
});

module.exports = userBean;