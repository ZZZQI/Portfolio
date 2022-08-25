#发送数据格式
#{
#   "funSelec":"signin/signup/ya/newGame",
#   "userInfo":{"uname":"", "pwd":""},
#   "ya":{"uname":"","betMode":"tc/dc...", "num":"5", "betType":"coin/silver/gold"},
#   "message":""
#}


import argparse, socket, threading, json, base64

PATH = "./dstfile/"
BUFSIZE = 65535
HOST = "127.0.0.1"
PORT = 1060
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    sock.connect((HOST, PORT))
except Exception as e:
    print(e)


#整理格式
def formatserverMode(serverMode):
    if serverMode == "单线程":
        serverMode = "single"
    elif serverMode == "多线程":
        serverMode = "multi"
    elif serverMode == "select":
        serverMode == "select"
    elif serverMode == "asyncio":
        serverMode = "asyncio"

    return serverMode


#发送源文件名
def sendsrcfile(serverMode, srcfile, dstfile):
    sendDataBuf = { "serverMode":formatserverMode(serverMode), "srcfile":srcfile, "dstfile":dstfile }
    return sendData(sendDataBuf)


#将文件保存到本地
def client_download(dstfile, data):
    fout = open(PATH + dstfile, 'wb')
    fout.write(base64.b64decode(data.encode("ascii")))
    fout.close()

#接收消息
def recvData():
    data = ""
    more = ""
    while more != "#":
        try:
            data += more
            more = sock.recv(1)
            more = more.decode("ascii")
        except ConnectionResetError:
            return {"funSelec":"ConnectionResetError", "error":"server offline"}
        except Exception as e:
            return { "success": "error", "error": e }
    data = json.loads(data)
    return data

#发送消息
def sendData(data):
    data = json.dumps(data) + "#"
    try:
        sock.sendall(data.encode("ascii"))
        return "True"
    except:
        return "False"



def sendOffline():
    sendDataBuf = { "serverMode":"offline" }
    sendData(sendDataBuf)