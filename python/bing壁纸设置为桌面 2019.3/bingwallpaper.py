import requests, re, os
import win32api, win32con, win32gui


# 获取图片
r = requests.get("https://cn.bing.com/").text
imgid = re.findall(r"background-image:url\(/th(.+?)\);",r)
imgurl = "https://cn.bing.com/th" + imgid[0]
img = requests.get(imgurl).content
name = re.findall(r"id=(.+?)&",imgid[0])

# 保存图片
path = "C:/bing图片/"
isExists = os.path.exists(path) 
if isExists == False:
	os.makedirs(path) 
with open(path + name[0], "wb") as f:
    f.write(img)

# 设为桌面
	# 打开指定注册表路径
reg_key = win32api.RegOpenKeyEx(win32con.HKEY_CURRENT_USER, "Control Panel\\Desktop", 0, win32con.KEY_SET_VALUE)
	# 最后的参数:2拉伸,0居中,6适应,10填充,0平铺
win32api.RegSetValueEx(reg_key, "WallpaperStyle", 0, win32con.REG_SZ, "2")
	# 最后的参数:1表示平铺,拉伸居中等都是0
win32api.RegSetValueEx(reg_key, "TileWallpaper", 0, win32con.REG_SZ, "0")
	# 刷新桌面
win32gui.SystemParametersInfo(win32con.SPI_SETDESKWALLPAPER, path + name[0], win32con.SPIF_SENDWININICHANGE)



