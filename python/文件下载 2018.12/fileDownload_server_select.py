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


import argparse, socket, json, os, base64, select
import utils

HOST = "127.0.0.1"
PORT = 1060
PATH = "./srcfile/"

socket_list = []

#select模型
def selectModel(sc):
    data = utils.recvData(sc)
    try:
        #客户端异常关闭
        if( data["serverMode"] == "offline" ):
            print("client {} offline".format(sc))
            socket_list.remove(sc)
            sc.close()
            return
        elif( data["serverMode"] == "select" ):
            sendDataBuf = utils.download(data["srcfile"], data["dstfile"])
            utils.sendData(sc, sendDataBuf)
        else:
            print(data)
            sendDataBuf = {"success":"false","error":"this is select server, please choose select server mode"}
            utils.sendData(sc, sendDataBuf)
    except:
        #客户端异常关闭
        print(data)
        socket_list.remove(sc)
        sc.close()
        return
        
    
def server():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind((HOST, PORT))
    sock.listen(5)
     
    socket_list.append(sock)

     
    while True:
        try:
            readable, writeable, exceptional = select.select(socket_list, [], [])
        except Exception as e:
            print(e)
            continue

        for sc in readable:
            if sc == sock:
                conn, addr = sock.accept()
                socket_list.append(conn)
            else:
                try:
                    selectModel(sc)
                except:
                    socket_list.remove(sc)
    


if __name__ == "__main__":
    server()