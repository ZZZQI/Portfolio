#发送数据格式
#{
#   "funSelec": "act/dealerSaid/playerSaid/tc1/tc2/tz1/tz2/coin/silver/gold/ended",
#   "success": "True/False",
#   "money": {"coin":0,"silver":3,"gold":5}
#   "message": "", 
#   "error": "",
#   "fromFriendName":""
#   "changeMoney":-3
#}#


import argparse, socket, json, os, base64, threading, utils

HOST = "127.0.0.1"
PORT = 1060
PATH = "./srcfile/"


#多线程方式
def multi(sc):
    while True:
        data = utils.recvData(sc)
        try:
            #客户端异常关闭
            if( data["serverMode"] == "offline" ):
                print("client {} offline".format(sc))
                sc.close()
                return
            elif( data["serverMode"] == "multi" ):
                print(data)
                sendDataBuf = utils.download(data["srcfile"], data["dstfile"])
                utils.sendData(sc, sendDataBuf)
            else:
                print(data)
                sendDataBuf = {"success":"false","error":"this is multi server, please choose multi server mode"}
                utils.sendData(sc, sendDataBuf)
        except:
            #客户端异常关闭
            print(data)
            sc.close()
            return
        
    
def server():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((HOST,PORT))
    sock.listen()
    print("listening at", sock.getsockname())
    while True:
        sc, sockname = sock.accept()
        print("Connected by {}".format(sockname))
        multiThread = threading.Thread(target = multi, args=(sc,))
        multiThread.start()
   
    sock.close()


if __name__ == "__main__":
    server()



